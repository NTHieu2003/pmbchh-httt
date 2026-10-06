import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const top5GridStyles = StyleSheet.create({
  section: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    padding: APP_SPACING.md,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginBottom: APP_SPACING.sm,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    fontStyle: 'italic',
    paddingVertical: APP_SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_SPACING.sm,
  },
  // 5 cells, fixed width so they wrap predictably rather than a strict
  // 1-row-of-5 (which would be cramped on narrower tablet widths).
  cell: {
    width: '19%',
    minWidth: 150,
    flexGrow: 1,
    backgroundColor: APP_COLORS.chatSidebarBg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    padding: APP_SPACING.sm,
    alignItems: 'center',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: APP_COLORS.chatBrandRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: APP_SPACING.xs,
  },
  // Matches web's `.rank-tag` — gold/silver/bronze for the top 3.
  rankBadgeGold: {
    backgroundColor: '#f59e0b',
  },
  rankBadgeSilver: {
    backgroundColor: '#94a3b8',
  },
  rankBadgeBronze: {
    backgroundColor: '#d97706',
  },
  rankBadgeText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: APP_SPACING.xxs,
  },
  count: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  percent: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
    marginTop: 2,
  },
  // Matches web's `.podium-view-btn` / `.gold` variant for rank 1.
  viewButton: {
    marginTop: APP_SPACING.sm,
    width: '100%',
    alignItems: 'center',
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.sm,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  viewButtonGold: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  viewButtonText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: '#334155',
  },
  viewButtonTextGold: {
    color: '#b45309',
  },
});
