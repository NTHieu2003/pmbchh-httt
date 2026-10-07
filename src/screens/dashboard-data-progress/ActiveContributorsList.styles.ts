import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const activeContributorsListStyles = StyleSheet.create({
  section: {
    flexGrow: 1,
    flexBasis: 520,
    minWidth: 420,
    backgroundColor: APP_COLORS.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    padding: APP_SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    marginBottom: APP_SPACING.sm,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  sampleChip: {
    paddingHorizontal: APP_SPACING.xs,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    backgroundColor: APP_COLORS.chatAmberBg,
  },
  sampleChipText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: '#92400e',
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    fontStyle: 'italic',
    paddingVertical: APP_SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: APP_SPACING.xs,
    backgroundColor: APP_COLORS.chatSidebarBg,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  headerText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.chatSubtitle,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  // Column widths — shared by header and rows so they line up.
  colRank: {
    width: 44,
    alignItems: 'center',
    textAlign: 'center',
  },
  colName: {
    flex: 2,
    paddingRight: APP_SPACING.xs,
  },
  colDept: {
    flex: 2,
    paddingRight: APP_SPACING.xs,
  },
  colCount: {
    width: 64,
    textAlign: 'right',
    paddingRight: APP_SPACING.sm,
  },
  colDate: {
    width: 130,
    textAlign: 'center',
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  // Same gold/silver/bronze as Top5Grid's rank badges.
  rankBadgeGold: {
    backgroundColor: '#f59e0b',
  },
  rankBadgeSilver: {
    backgroundColor: '#94a3b8',
  },
  rankBadgeBronze: {
    backgroundColor: '#d97706',
  },
  rankText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: '#334155',
  },
  rankTextTop: {
    color: APP_COLORS.white,
  },
  nameText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  cellText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
  },
  countText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
});
