import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { History } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import { ChatMessageList } from '../chatbot/chat';
import { messageViewerStyles as styles } from './MessageViewer.styles';

import type { ChatListItem } from '@/types';

export interface MessageViewerProps {
  selectedConversationId: string | null;
  selectedTitle: string;
  messages: ChatListItem[];
  isLoading: boolean;
}

// Right panel — read-only conversation viewer, no composer/send capability
// at all (this screen is purely for reviewing history, not chatting).
// Reuses ChatMessageList/ChatMessageBubble as-is from the chatbot feature.
const MessageViewer: React.FC<MessageViewerProps> = ({
  selectedConversationId,
  selectedTitle,
  messages,
  isLoading,
}) => {
  if (!selectedConversationId) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <History size={40} color={APP_COLORS.chatIconMuted} />
          <Text style={styles.emptyText}>
            Chọn một cuộc trò chuyện ở bên trái để xem chi tiết nội dung.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {selectedTitle}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={APP_COLORS.chatBrandRed} />
        </View>
      ) : (
        <ChatMessageList listChat={messages} showTypingIndicator={false} />
      )}
    </View>
  );
};

export default MessageViewer;
