import React from 'react';
import { Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { chatMessageBubbleStyles as styles } from './ChatMessageBubble.styles';
import { chatMarkdownStyles } from './markdownStyles';

import type { ChatListItem } from '@/types';

export interface ChatMessageBubbleProps {
  item: ChatListItem;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ item }) => {
  const isUser = item.message.role === 'user';

  if (isUser) {
    return (
      <View style={[styles.row, styles.userRow]}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{item.message.content}</Text>
        </View>
      </View>
    );
  }

  // Error messages are plain strings (not markdown from the upstream model) —
  // render as plain Text so error copy never gets mangled by markdown parsing.
  if (item.isError) {
    return (
      <View style={[styles.row, styles.assistantRow]}>
        <View style={styles.assistantContent}>
          <Text style={[styles.assistantText, styles.errorText]}>
            {item.message.content}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.row, styles.assistantRow]}>
      <View style={styles.assistantContent}>
        <Markdown style={chatMarkdownStyles}>
          {(item.message.content ?? '') + (item.streamingActive ? ' ▍' : '')}
        </Markdown>
      </View>
    </View>
  );
};

export default ChatMessageBubble;
