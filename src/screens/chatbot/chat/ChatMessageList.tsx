import React, { useEffect, useRef } from 'react';
import { FlatList, Text, View } from 'react-native';

import ChatMessageBubble from './ChatMessageBubble';
import { chatMessageListStyles as styles } from './ChatMessageList.styles';

import type { ChatListItem } from '@/types';

export interface ChatMessageListProps {
  listChat: ChatListItem[];
  showTypingIndicator: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  listChat,
  showTypingIndicator,
}) => {
  const listRef = useRef<FlatList<ChatListItem>>(null);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [listChat, showTypingIndicator]);

  return (
    <FlatList
      ref={listRef}
      style={styles.list}
      data={listChat}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatMessageBubble item={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={
        <>
          {showTypingIndicator && (
            <View style={styles.typingRow}>
              <View style={styles.typingBubble}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
              <Text style={styles.typingLabel}>Đang suy nghĩ...</Text>
            </View>
          )}
          {listChat.length > 0 && (
            <Text style={styles.disclaimer}>
              ChatBot có thể mắc lỗi. Hãy kiểm tra các thông tin quan trọng.
            </Text>
          )}
        </>
      }
    />
  );
};

export default ChatMessageList;
