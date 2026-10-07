import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CalendarDays, Search } from 'lucide-react-native';

import { AppModal, AppModalButton } from '@/components/AppModal';
import { ZoomableImage } from '@/components/ZoomableImage';
import { APP_COLORS } from '@/theme';

import { meetingPlanInfoModalStyles as styles } from './MeetingPlanInfoModal.styles';
import DownloadFileButton from '../meeting-room/DownloadFileButton';
import { useMeetingPlanInfo } from './useMeetingPlanInfo.hook';

import type { TaiLieuChuongTrinhHopItem, ThanhPhanThamGiaItem } from '@/types';

// Swap this single line to change the seating-chart placeholder image —
// not wired to any API yet (web has no "sơ đồ chỗ ngồi" image endpoint for
// this dialog), so it's a static asset until one exists.
const SEATING_CHART_IMAGE = require('@/assets/images/login-info-bg-placeholder.png');

export interface MeetingPlanInfoModalProps {
  visible: boolean;
  onClose: () => void;
  khpGid: number | null;
}

type InfoTab = 'chuongtrinh' | 'tailieu' | 'thanhphan' | 'sodocho';

const formatDate = (raw?: string): string => {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const formatTime = (raw?: string): string => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '—';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Mirrors pmbc_web's "Danh sách chương trình họp" tab (STT/Tiêu đề/TG
// từ/Đến/Nội dung).
const renderAgendaItem = ({ item, index }: { item: TaiLieuChuongTrinhHopItem; index: number }) => (
  <View style={styles.row}>
    <View style={styles.indexBadge}>
      <Text style={styles.indexText}>{index + 1}</Text>
    </View>
    <View style={styles.rowBody}>
      <Text style={styles.name}>{item.tentailieu}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>
          {formatTime(item.thoigiantu)} – {formatTime(item.thoigianden)}
        </Text>
      </View>
      {!!item.noidung && <Text style={styles.content}>{item.noidung}</Text>}
    </View>
  </View>
);

const renderDocument = ({ item, index }: { item: TaiLieuChuongTrinhHopItem; index: number }) => (
  <View style={styles.row}>
    <View style={styles.indexBadge}>
      <Text style={styles.indexText}>{index + 1}</Text>
    </View>
    <View style={styles.rowBody}>
      <Text style={styles.name}>{item.tentailieu}</Text>
      {!!item.noidung && <Text style={styles.content}>{item.noidung}</Text>}
      <View style={styles.metaRow}>
        {!!item.nguoitaoST && <Text style={styles.meta}>Người tạo: {item.nguoitaoST}</Text>}
        {!!item.ngaytao && <Text style={styles.meta}>{formatDate(item.ngaytao)}</Text>}
      </View>
      {!!item.filedinhkem && <DownloadFileButton fileName={item.filedinhkem} />}
    </View>
  </View>
);

const renderParticipant = ({ item, index }: { item: ThanhPhanThamGiaItem; index: number }) => {
  const nameLine = [item.capbacST, item.thanhvienST || item.tenkhac].filter(Boolean).join(' ');
  const unitLine = item.donvitochuc1ST || item.thanhphanthu3 || '';
  return (
    <View style={styles.row}>
      <View style={styles.indexBadge}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.name}>{nameLine || 'Chưa rõ'}</Text>
        <View style={styles.metaRow}>
          {!!unitLine && <Text style={styles.meta}>{unitLine}</Text>}
          {!!item.vaitroST && <Text style={styles.meta}>{item.vaitroST}</Text>}
          {!!item.maghe && <Text style={styles.meta}>Vị trí: {item.maghe}</Text>}
        </View>
      </View>
    </View>
  );
};

const TABS: { key: InfoTab; label: string }[] = [
  { key: 'chuongtrinh', label: 'Chương trình họp' },
  { key: 'tailieu', label: 'Danh sách tài liệu' },
  { key: 'thanhphan', label: 'Thành phần tham gia' },
  { key: 'sodocho', label: 'Sơ đồ chỗ ngồi' },
];

// "Xem thông tin" — mirrors pmbc_web's ViewThongKeCongTacChuanBi dialog,
// scoped down to the three data tabs that matter outside a live meeting:
// "Danh sách chương trình họp" (CTH), "Danh sách tài liệu" (TLH) và
// "Thành phần tham gia" (same data as web's standalone "Danh sách đại
// biểu" screen — one table, two names on web).
const MeetingPlanInfoModal: React.FC<MeetingPlanInfoModalProps> = ({
  visible,
  onClose,
  khpGid,
}) => {
  const [activeTab, setActiveTab] = useState<InfoTab>('chuongtrinh');
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, agendaItems, documents, participants } = useMeetingPlanInfo(
    visible ? khpGid : null
  );

  const q = searchQuery.trim().toLowerCase();
  const filteredAgendaItems = useMemo(
    () =>
      q ? agendaItems.filter((item) => (item.tentailieu ?? '').toLowerCase().includes(q)) : agendaItems,
    [agendaItems, q]
  );
  const filteredDocuments = useMemo(
    () =>
      q ? documents.filter((item) => (item.tentailieu ?? '').toLowerCase().includes(q)) : documents,
    [documents, q]
  );
  const filteredParticipants = useMemo(
    () =>
      q
        ? participants.filter((item) =>
            [item.capbacST, item.thanhvienST, item.tenkhac, item.donvitochuc1ST]
              .filter(Boolean)
              .join(' ')
              .toLowerCase()
              .includes(q)
          )
        : participants,
    [participants, q]
  );

  if (!visible) return null;

  return (
    // AppModal provides this Modal's single GestureHandlerRootView, which
    // ZoomableImage's pinch/pan in the "Sơ đồ chỗ ngồi" tab relies on — do
    // not add another one here.
    <AppModal
      visible
      onClose={onClose}
      icon={CalendarDays}
      title="Thông tin cuộc họp"
      subtitle="Chương trình, tài liệu, thành phần và sơ đồ chỗ ngồi"
      size="md"
      // Tabs + FlatLists / zoomable image fill the card — AppModal's own
      // ScrollView is turned off.
      scrollable={false}
      heightRatio={0.8}
      avoidKeyboard
      footer={<AppModalButton label="Đóng" onPress={onClose} />}
    >
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabButtonText, activeTab === tab.key && styles.tabButtonTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab !== 'sodocho' && (
        <View style={styles.searchBox}>
          <Search size={14} color={APP_COLORS.chatIconMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor={APP_COLORS.chatIconMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      <View style={[styles.body, activeTab === 'sodocho' && styles.bodyImage]}>
        {isLoading ? (
          <ActivityIndicator color={APP_COLORS.primary} style={styles.loading} />
        ) : activeTab === 'chuongtrinh' ? (
          <FlatList
            data={filteredAgendaItems}
            keyExtractor={(item) => String(item.gid)}
            renderItem={renderAgendaItem}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={styles.emptyText}>Chưa có chương trình họp.</Text>}
          />
        ) : activeTab === 'tailieu' ? (
          <FlatList
            data={filteredDocuments}
            keyExtractor={(item) => String(item.gid)}
            renderItem={renderDocument}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={styles.emptyText}>Không có tài liệu.</Text>}
          />
        ) : activeTab === 'thanhphan' ? (
          <FlatList
            data={filteredParticipants}
            keyExtractor={(item) => String(item.gid)}
            renderItem={renderParticipant}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={styles.emptyText}>Không có thành phần tham gia.</Text>}
          />
        ) : (
          <ZoomableImage source={SEATING_CHART_IMAGE} />
        )}
      </View>
    </AppModal>
  );
};

export default MeetingPlanInfoModal;
