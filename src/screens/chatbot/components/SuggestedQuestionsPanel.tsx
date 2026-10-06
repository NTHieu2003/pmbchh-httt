import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Lightbulb, X } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import { suggestedQuestionsPanelStyles as styles } from './SuggestedQuestionsPanel.styles';

// Mirrors pmbc_web's chatbot.component.ts `suggestedQuestions` — a fixed,
// hardcoded list (not fetched from an API) + pickSuggestion/toggleSuggestions.
const SUGGESTED_QUESTIONS = [
  'Quy trình xử lý văn bản mật như thế nào?',
  'Chế độ, chính sách đối với quân nhân?',
  'Hướng dẫn lập báo cáo công tác Đảng?',
  'Các biểu mẫu báo cáo mới nhất?',
  'Quy định về công tác cán bộ hiện hành?',
];

export interface SuggestedQuestionsPanelProps {
  onSelect: (question: string) => void;
  onClose: () => void;
}

const SuggestedQuestionsPanel: React.FC<SuggestedQuestionsPanelProps> = ({
  onSelect,
  onClose,
}) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.headerTitleRow}>
        <Lightbulb size={16} color={APP_COLORS.chatAmber} />
        <Text style={styles.headerTitle}>Câu hỏi gợi ý</Text>
      </View>
      <TouchableOpacity
        onPress={onClose}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <X size={16} color={APP_COLORS.chatIconMuted} />
      </TouchableOpacity>
    </View>

    <View style={styles.list}>
      {SUGGESTED_QUESTIONS.map((question) => (
        <TouchableOpacity
          key={question}
          style={styles.row}
          onPress={() => onSelect(question)}
        >
          <View style={styles.bullet} />
          <Text style={styles.rowText}>{question}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default SuggestedQuestionsPanel;
