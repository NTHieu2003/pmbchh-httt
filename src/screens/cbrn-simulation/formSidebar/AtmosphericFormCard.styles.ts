import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const atmosphericFormCardStyles = StyleSheet.create({
  windRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: APP_SPACING.xs,
  },
  windInputWrap: {
    flex: 1,
  },
  stabilityBadge: {
    width: APP_SPACING.height32,
    height: APP_SPACING.height32,
    borderRadius: Radius.sm,
    backgroundColor: '#d7f5ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stabilityBadgeText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#0d9488',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
  },
  toggleLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  pillGroupLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.chatSubtitle,
    letterSpacing: 0.3,
    marginBottom: APP_SPACING.xxs,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_SPACING.xxs,
  },
  pill: {
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xxs,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    backgroundColor: APP_COLORS.chatSidebarBg,
  },
  pillActive: {
    backgroundColor: APP_COLORS.chatBrandRed,
    borderColor: APP_COLORS.chatBrandRed,
  },
  pillText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  pillTextActive: {
    color: APP_COLORS.white,
  },
});
