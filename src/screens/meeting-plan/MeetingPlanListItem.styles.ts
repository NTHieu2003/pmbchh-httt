import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize } from '@/utils';

export const meetingPlanListItemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.lg,
    paddingVertical: APP_SPACING.sm + APP_SPACING.xxs,
    paddingHorizontal: APP_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
    backgroundColor: APP_COLORS.surface,
  },
  left: {
    flex: 0.85,
    gap: APP_SPACING.xxs,
  },
  right: {
    flex: 0.15,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  type: {
    fontSize: FontSize.xs,
    color: APP_COLORS.primary,
    fontWeight: '600',
  },
  time: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
  },
  chutri: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatIconMuted,
    fontStyle: 'italic',
  },
  diadiem: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatIconMuted,
  },
  menuButton: {
    padding: APP_SPACING.xs,
  },
});
