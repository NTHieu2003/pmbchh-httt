import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronDown, ChevronUp, MessageCircleQuestion } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import { guideFaqItemStyles as styles } from './GuideFaqItem.styles';

import type { PmbcHdsdChatbot } from '@/types';

export interface GuideFaqItemProps {
  item: PmbcHdsdChatbot;
  expanded: boolean;
  onToggle: () => void;
}

// One FAQ card — question row (tap to expand) + plain-text answer. The real
// API response carries no file fields at all, so there's no per-row
// video/PDF action here.
const GuideFaqItem: React.FC<GuideFaqItemProps> = ({ item, expanded, onToggle }) => (
  <View style={styles.card}>
    <TouchableOpacity style={styles.header} onPress={onToggle} activeOpacity={0.7}>
      <View style={styles.iconBadge}>
        <MessageCircleQuestion size={16} color={APP_COLORS.chatBrandRed} />
      </View>
      <Text style={styles.question}>{item.cau_hoi || '(Chưa có nội dung)'}</Text>
      {expanded ? (
        <ChevronUp size={18} color={APP_COLORS.chatIconMuted} />
      ) : (
        <ChevronDown size={18} color={APP_COLORS.chatIconMuted} />
      )}
    </TouchableOpacity>

    {expanded && (
      <View style={styles.answerWrap}>
        <Text style={styles.answer}>
          {item.cau_tra_loi || 'Chưa có nội dung trả lời chi tiết.'}
        </Text>
      </View>
    )}
  </View>
);

export default GuideFaqItem;
