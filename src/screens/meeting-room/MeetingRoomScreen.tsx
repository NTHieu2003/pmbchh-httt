import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  Info,
  List,
  LogOut,
  Mic,
  Search,
  Settings,
  Settings2,
  SkipBack,
  SkipForward,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_COLORS } from '@/theme';
import { MeetingSocketProvider } from '@/services/websocket';

import type { MainStackParamList } from '@/navigation/navigator/MainStackNavigator';

import { meetingRoomScreenStyles as styles } from './MeetingRoomScreen.styles';
import ParticipantListItem from './ParticipantListItem';
import MeetingRoomSlideViewer from './MeetingRoomSlideViewer';
import MeetingRoomAgendaModal from './MeetingRoomAgendaModal';
import MeetingRoomInfoModal from './MeetingRoomInfoModal';
import MeetingRoomDocumentsModal from './MeetingRoomDocumentsModal';
import MeetingRoomSpeechModal from './MeetingRoomSpeechModal';
import MeetingRoomSttPanel from './MeetingRoomSttPanel';
import { useMeetingRoom } from './useMeetingRoom.hook';

type MeetingRoomRouteProp = RouteProp<MainStackParamList, 'MEETING_ROOM_SCREEN'>;

type ActiveModal = 'chuongtrinh' | 'thongtin' | 'tailieu' | 'phatbieu' | null;

// "Phòng họp không giấy" — mirrors pmbc_mobile's Phonghop.tsx structure:
// 3 panels (Tiến trình cuộc họp (STT) / Slide trình chiếu / Người tham
// gia) + a bottom action bar (Chương trình/Thông tin/Tài liệu/Phát biểu
// dialogs, chapter+page nav for chủ trì/trợ lý, Thoát). Real-time voice/STT
// (the left panel's actual content), the phát biểu rich-text editor and
// the seating-chart editor are Phase 2 (see
// plans/261005-1022-hop-khong-giay/plan.md) — this phase wires up live
// presence + agenda/page sync over the same websocket/BE contract.
const MeetingRoomScreenContent: React.FC<{ khpGid: number }> = ({ khpGid }) => {
  const navigation = useNavigation();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isJoinedExpanded, setIsJoinedExpanded] = useState(true);
  const [isNotJoinedExpanded, setIsNotJoinedExpanded] = useState(true);
  const [participantQuery, setParticipantQuery] = useState('');

  // "TT xem" — matches pmbc_mobile's view-settings menu: each panel can be
  // hidden independently, and the whole action bar can hide itself too
  // (a small floating button brings it back, since without it there'd be
  // no way to reopen the menu that hid it).
  const [isSttVisible, setIsSttVisible] = useState(true);
  const [isSlideVisible, setIsSlideVisible] = useState(true);
  const [isParticipantVisible, setIsParticipantVisible] = useState(true);
  const [isActionBarVisible, setIsActionBarVisible] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);

  const {
    isLoading,
    khtochuchop,
    sodoPhongHop,
    chuTri,
    currentUserVaiTro,
    agendaItems,
    currentAgendaIndex,
    currentAgendaItem,
    selectAgendaItem,
    goToPreviousAgendaItem,
    goToNextAgendaItem,
    currentPdfPage,
    setCurrentPdfPage,
    goToPreviousPdfPage,
    goToNextPdfPage,
    personalDocuments,
    sharedDocuments,
    personalSpeechContents,
    publishedSpeechContents,
    createPersonalSpeech,
    toggleSpeechStatus,
    deleteSpeech,
    participants,
    joinedParticipants,
    notJoinedParticipants,
    micStatus,
    toggleMic,
    toggleReminder,
    typeMic,
    changeTypeMic,
    liveTranscript,
    persistedMessages,
    isProcessingSpeech,
    playingMessageGid,
    playMessageAudio,
    deleteMessage,
    leaveMeeting,
  } = useMeetingRoom(khpGid);

  // Search only ever applies to "Đã tham gia" — same scope as
  // pmbc_mobile's Searchbar (only shown inside that accordion, only for
  // chủ trì/trợ lý).
  const canDriveRoom = currentUserVaiTro === 1 || currentUserVaiTro === 2;
  const filteredJoined = useMemo(() => {
    if (!participantQuery.trim()) return joinedParticipants;
    const q = participantQuery.toLowerCase();
    return joinedParticipants.filter((item) => item.thanhvienST?.toLowerCase().includes(q));
  }, [joinedParticipants, participantQuery]);

  const exitMeeting = () => {
    leaveMeeting();
    navigation.goBack();
  };

  // No way out of a live meeting except "Thoát" — block Android's
  // hardware/gesture back button the same way the header's back arrow and
  // the stack's `gestureEnabled: false` block the other two exits.
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => subscription.remove();
    }, [])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator color={APP_COLORS.chatBrandRed} />
          <Text style={styles.loadingText}>Đang tải thông tin cuộc họp...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {khtochuchop?.khp_tieude || 'Phòng họp không giấy'}
        </Text>
      </View>

      <View style={styles.body}>
        {/* Tiến trình cuộc họp (STT) — mirrors pmbc_web's two sub-tabs: "Ý
            kiến đầy đủ" (live transcript + persisted) / "Tóm tắt ý kiến"
            (per-utterance AI summary). See MeetingRoomSttPanel. */}
        {isSttVisible && (
          <View style={styles.sttColumn}>
            <Text style={styles.columnTitle}>Tiến trình cuộc họp (STT)</Text>
            <MeetingRoomSttPanel
              liveTranscript={liveTranscript}
              persistedMessages={persistedMessages}
              isProcessingSpeech={isProcessingSpeech}
              playingMessageGid={playingMessageGid}
              onPlayAudio={playMessageAudio}
              onDeleteMessage={deleteMessage}
              canDriveRoom={canDriveRoom}
            />
          </View>
        )}

        {isSlideVisible && (
          <View style={styles.slideColumn}>
            <Text style={styles.columnTitle}>Slide trình chiếu</Text>
            <View style={styles.slideBox}>
              <MeetingRoomSlideViewer
                fileName={currentAgendaItem?.filedinhkem}
                page={currentPdfPage}
                onPageChanged={setCurrentPdfPage}
              />
            </View>
          </View>
        )}

        {isParticipantVisible && (
        <View style={styles.participantColumn}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setIsJoinedExpanded((prev) => !prev)}
          >
            <Text style={styles.accordionTitle}>Đã tham gia ({joinedParticipants.length})</Text>
            {isJoinedExpanded ? (
              <ChevronUp size={16} color={APP_COLORS.textPrimary} />
            ) : (
              <ChevronDown size={16} color={APP_COLORS.textPrimary} />
            )}
          </TouchableOpacity>

          {isJoinedExpanded && (
            <>
              {currentUserVaiTro === 2 && (
                <View style={styles.micTypeSwitch}>
                  <TouchableOpacity
                    style={[
                      styles.micTypeButton,
                      typeMic === 'chung' && styles.micTypeButtonActive,
                    ]}
                    onPress={() => changeTypeMic('chung')}
                  >
                    <Text
                      style={[
                        styles.micTypeButtonText,
                        typeMic === 'chung' && styles.micTypeButtonTextActive,
                      ]}
                    >
                      Mic chung
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.micTypeButton,
                      typeMic === 'rieng' && styles.micTypeButtonActive,
                    ]}
                    onPress={() => changeTypeMic('rieng')}
                  >
                    <Text
                      style={[
                        styles.micTypeButtonText,
                        typeMic === 'rieng' && styles.micTypeButtonTextActive,
                      ]}
                    >
                      Mic riêng
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {canDriveRoom && (
                <View style={styles.searchBox}>
                  <Search size={14} color={APP_COLORS.chatIconMuted} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm"
                    placeholderTextColor={APP_COLORS.chatIconMuted}
                    value={participantQuery}
                    onChangeText={setParticipantQuery}
                  />
                </View>
              )}
              <FlatList
                data={filteredJoined}
                keyExtractor={(item) => String(item.gid)}
                renderItem={({ item }) => (
                  <ParticipantListItem
                    item={item}
                    isJoined
                    canDriveRoom={canDriveRoom}
                    isSpeaking={!!item.thanhvien && !!micStatus[item.thanhvien]}
                    onToggleMic={() => item.thanhvien != null && toggleMic(item.thanhvien)}
                    onToggleReminder={() =>
                      item.thanhvien != null && toggleReminder(item.thanhvien)
                    }
                  />
                )}
                style={styles.participantList}
              />
            </>
          )}

          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setIsNotJoinedExpanded((prev) => !prev)}
          >
            <Text style={styles.accordionTitle}>
              Chưa tham gia ({notJoinedParticipants.length})
            </Text>
            {isNotJoinedExpanded ? (
              <ChevronUp size={16} color={APP_COLORS.textPrimary} />
            ) : (
              <ChevronDown size={16} color={APP_COLORS.textPrimary} />
            )}
          </TouchableOpacity>

          {isNotJoinedExpanded && (
            <FlatList
              data={notJoinedParticipants}
              keyExtractor={(item) => String(item.gid)}
              renderItem={({ item }) => <ParticipantListItem item={item} isJoined={false} />}
              style={styles.participantList}
            />
          )}
        </View>
        )}
      </View>

      {!isActionBarVisible && (
        <TouchableOpacity
          style={styles.showActionBarButton}
          onPress={() => setIsActionBarVisible(true)}
        >
          <Settings size={18} color={APP_COLORS.white} />
        </TouchableOpacity>
      )}

      {isActionBarVisible && (
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setActiveModal('chuongtrinh')}>
          <List size={18} color={APP_COLORS.textPrimary} />
          <Text style={styles.actionButtonText}>Chương trình</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setActiveModal('thongtin')}>
          <Info size={18} color={APP_COLORS.textPrimary} />
          <Text style={styles.actionButtonText}>Thông tin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setActiveModal('tailieu')}>
          <FileText size={18} color={APP_COLORS.textPrimary} />
          <Text style={styles.actionButtonText}>Tài liệu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setActiveModal('phatbieu')}>
          <Mic size={18} color={APP_COLORS.textPrimary} />
          <Text style={styles.actionButtonText}>Phát biểu</Text>
        </TouchableOpacity>

        <View style={styles.actionBarSpacer} />

        {canDriveRoom && (
          <View style={styles.navGroup}>
            <TouchableOpacity
              style={[
                styles.navButton,
                (currentAgendaIndex == null || currentAgendaIndex <= 0) && styles.navButtonDisabled,
              ]}
              onPress={goToPreviousAgendaItem}
              disabled={currentAgendaIndex == null || currentAgendaIndex <= 0}
            >
              <SkipBack size={16} color={APP_COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, currentPdfPage <= 1 && styles.navButtonDisabled]}
              onPress={goToPreviousPdfPage}
              disabled={currentPdfPage <= 1}
            >
              <ChevronLeft size={16} color={APP_COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={goToNextPdfPage}>
              <ChevronRight size={16} color={APP_COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.navButton,
                (currentAgendaIndex == null || currentAgendaIndex >= agendaItems.length - 1) &&
                  styles.navButtonDisabled,
              ]}
              onPress={goToNextAgendaItem}
              disabled={currentAgendaIndex == null || currentAgendaIndex >= agendaItems.length - 1}
            >
              <SkipForward size={16} color={APP_COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.actionBarSpacer} />

        <View style={styles.viewSettingsWrapper}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsViewMenuOpen((prev) => !prev)}
          >
            <Settings2 size={18} color={APP_COLORS.textPrimary} />
            <Text style={styles.actionButtonText}>TT xem</Text>
          </TouchableOpacity>

          {isViewMenuOpen && (
            <View style={styles.viewSettingsMenu}>
              <TouchableOpacity
                style={styles.viewSettingsItem}
                onPress={() => {
                  setIsSttVisible((prev) => !prev);
                  setIsViewMenuOpen(false);
                }}
              >
                <Text style={styles.viewSettingsItemText}>
                  {isSttVisible ? 'Ẩn khung chữ' : 'Hiện khung chữ'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.viewSettingsItem}
                onPress={() => {
                  setIsSlideVisible((prev) => !prev);
                  setIsViewMenuOpen(false);
                }}
              >
                <Text style={styles.viewSettingsItemText}>
                  {isSlideVisible ? 'Ẩn màn hình' : 'Hiện màn hình'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.viewSettingsItem}
                onPress={() => {
                  setIsParticipantVisible((prev) => !prev);
                  setIsViewMenuOpen(false);
                }}
              >
                <Text style={styles.viewSettingsItemText}>
                  {isParticipantVisible ? 'Ẩn danh sách người' : 'Hiện danh sách người'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.viewSettingsItem}
                onPress={() => {
                  setIsActionBarVisible(false);
                  setIsViewMenuOpen(false);
                }}
              >
                <Text style={styles.viewSettingsItemText}>Ẩn thanh cài đặt</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.exitButton} onPress={exitMeeting}>
          <LogOut size={18} color={APP_COLORS.white} />
          <Text style={styles.exitButtonText}>Kết thúc</Text>
        </TouchableOpacity>
      </View>
      )}

      <MeetingRoomAgendaModal
        visible={activeModal === 'chuongtrinh'}
        onClose={() => setActiveModal(null)}
        items={agendaItems}
        currentIndex={currentAgendaIndex}
        onSelect={(index) => {
          selectAgendaItem(index);
          setActiveModal(null);
        }}
      />
      <MeetingRoomInfoModal
        visible={activeModal === 'thongtin'}
        onClose={() => setActiveModal(null)}
        khtochuchop={khtochuchop}
        meetingLocation={sodoPhongHop?.meetingLocation}
        chuTri={chuTri}
      />
      <MeetingRoomDocumentsModal
        visible={activeModal === 'tailieu'}
        onClose={() => setActiveModal(null)}
        personalDocuments={personalDocuments}
        sharedDocuments={sharedDocuments}
      />
      <MeetingRoomSpeechModal
        visible={activeModal === 'phatbieu'}
        onClose={() => setActiveModal(null)}
        personalItems={personalSpeechContents}
        publishedItems={publishedSpeechContents}
        participants={participants}
        onCreate={createPersonalSpeech}
        onToggleStatus={toggleSpeechStatus}
        onDelete={deleteSpeech}
      />
    </SafeAreaView>
  );
};

const MeetingRoomScreen: React.FC = () => {
  const route = useRoute<MeetingRoomRouteProp>();
  const khpGid = route.params.khp_gid;

  return (
    <MeetingSocketProvider>
      <MeetingRoomScreenContent khpGid={khpGid} />
    </MeetingSocketProvider>
  );
};

export default MeetingRoomScreen;
