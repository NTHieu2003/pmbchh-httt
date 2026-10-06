import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Play, Square, Trash2 } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';

import { chatMarkdownStyles } from '@/screens/chatbot/chat/markdownStyles';
import { APP_COLORS } from '@/theme';

import { meetingRoomSttPanelStyles as styles } from './MeetingRoomSttPanel.styles';

import type { LiveTranscript } from './useMeetingRoom.hook';
import type { MessageVoidChatItem } from '@/types';

type SttTab = 'full' | 'summary';

export interface MeetingRoomSttPanelProps {
  liveTranscript: LiveTranscript | null;
  persistedMessages: MessageVoidChatItem[];
  isProcessingSpeech: boolean;
  // "Nghe"/"Dừng" + "Xóa tiến trình" — matches pmbc_web's row actions,
  // delete gated to chủ trì/trợ lý the same way web gates it to `isTroLy`.
  playingMessageGid: number | null;
  onPlayAudio: (item: MessageVoidChatItem) => void;
  onDeleteMessage: (item: MessageVoidChatItem) => void;
  canDriveRoom: boolean;
}

const formatTime = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

// "Tiến trình cuộc họp (STT)" panel — mirrors pmbc_web's two sub-tabs:
// "Ý kiến đầy đủ" (live stream + persisted `content`) and "Tóm tắt ý kiến"
// (persisted `content_tomtat`, one AI summary per utterance — not a
// whole-meeting summary, see plan.md's STT research notes).
const MeetingRoomSttPanel: React.FC<MeetingRoomSttPanelProps> = ({
  liveTranscript,
  persistedMessages,
  isProcessingSpeech,
  playingMessageGid,
  onPlayAudio,
  onDeleteMessage,
  canDriveRoom,
}) => {
  const [activeTab, setActiveTab] = useState<SttTab>('full');

  const summarizedMessages = useMemo(
    () => persistedMessages.filter((item) => !!item.content_tomtat?.trim()),
    [persistedMessages]
  );

  const data = activeTab === 'full' ? persistedMessages : summarizedMessages;

  const confirmDelete = (item: MessageVoidChatItem) => {
    Alert.alert('Xóa tiến trình', 'Bạn có chắc chắn muốn xóa nội dung phát biểu này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => onDeleteMessage(item) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'full' && styles.tabActive]}
          onPress={() => setActiveTab('full')}
        >
          <Text style={[styles.tabText, activeTab === 'full' && styles.tabTextActive]}>
            Ý kiến đầy đủ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'summary' && styles.tabActive]}
          onPress={() => setActiveTab('summary')}
        >
          <Text style={[styles.tabText, activeTab === 'summary' && styles.tabTextActive]}>
            Tóm tắt ý kiến
          </Text>
        </TouchableOpacity>
      </View>

      {isProcessingSpeech && (
        <Text style={styles.processingText}>Đang xử lý nội dung phát biểu...</Text>
      )}

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={data}
        keyExtractor={(item) => String(item.gid)}
        ListHeaderComponent={
          activeTab === 'full' && liveTranscript ? (
            <View style={[styles.messageCard, styles.liveCard]}>
              <View style={styles.speakerRow}>
                <Text style={styles.speakerName}>{liveTranscript.speakerName}</Text>
                <Text style={styles.liveBadge}>● Đang nói</Text>
              </View>
              <Text style={styles.contentText}>{liveTranscript.content}</Text>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <View style={styles.messageCard}>
            <View style={styles.speakerRow}>
              <Text style={styles.speakerName}>{item.fullname}</Text>
              <View style={styles.rowActions}>
                <Text style={styles.timeText}>{formatTime(item.realTime ?? item.time)}</Text>
                {activeTab === 'full' && !!item.fileAudio && (
                  <TouchableOpacity
                    onPress={() => onPlayAudio(item)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    {playingMessageGid === item.gid ? (
                      <Square size={14} color={APP_COLORS.primary} />
                    ) : (
                      <Play size={14} color={APP_COLORS.primary} />
                    )}
                  </TouchableOpacity>
                )}
                {activeTab === 'full' && canDriveRoom && (
                  <TouchableOpacity
                    onPress={() => confirmDelete(item)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Trash2 size={14} color={APP_COLORS.chatBrandRed} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {activeTab === 'full' ? (
              <Text style={styles.contentText}>{item.content}</Text>
            ) : (
              <Markdown style={chatMarkdownStyles}>{item.content_tomtat ?? ''}</Markdown>
            )}
          </View>
        )}
        ListEmptyComponent={
          !liveTranscript ? (
            <Text style={styles.processingText}>Chưa có nội dung ghi nhận.</Text>
          ) : undefined
        }
      />
    </View>
  );
};

export default MeetingRoomSttPanel;
