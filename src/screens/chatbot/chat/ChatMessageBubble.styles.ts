import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const chatMessageBubbleStyles = StyleSheet.create({
  row: {
    width: '100%',
    marginBottom: APP_SPACING.md,
  },
  userRow: {
    alignItems: 'flex-end',
  },
  assistantRow: {
    alignItems: 'flex-start',
  },
  userBubble: {
    maxWidth: '80%',
    backgroundColor: APP_COLORS.chatMessageBubble,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderBottomLeftRadius: Radius.xl,
    // borderRadius: Radius.lg,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
  },
  userText: {
    fontSize: FontSize.md,
    color: APP_COLORS.textPrimary,
  },
  assistantContent: {
    width: '100%',
  },
  assistantText: {
    fontSize: FontSize.md,
    color: APP_COLORS.textPrimary,
    lineHeight: 22,
  },
  errorText: {
    color: APP_COLORS.danger,
    fontWeight: '600',
  },
  caret: {
    fontSize: FontSize.md,
    color: APP_COLORS.chatIconMuted,
  },
});
