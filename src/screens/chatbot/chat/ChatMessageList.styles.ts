import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const chatMessageListStyles = StyleSheet.create({
  list: {
    width: '100%',
    flex: 1,
    paddingHorizontal: APP_SPACING.height12
  },
  listContent: {
    paddingVertical: APP_SPACING.md,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    marginTop: APP_SPACING.xs,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.lg,
    backgroundColor: APP_COLORS.chatSidebarBg,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: APP_COLORS.chatIconMuted,
  },
  typingLabel: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: APP_COLORS.chatIconMuted,
    marginTop: APP_SPACING.sm,
  },
});
