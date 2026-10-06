import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const statsTableStyles = StyleSheet.create({
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
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    marginBottom: APP_SPACING.sm,
  },
  searchBox: {
    flexGrow: 1,
    minWidth: 220,
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.sm,
    paddingHorizontal: APP_SPACING.sm,
    height: 40,
    backgroundColor: APP_COLORS.chatSidebarBg,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
  },
  checkboxLabel: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
  counter: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
    marginTop: APP_SPACING.sm,
    marginBottom: APP_SPACING.xs,
  },
  counterBold: {
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  tableScroll: {
    marginTop: APP_SPACING.xs,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: APP_COLORS.chatSidebarBg,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  headerCell: {
    paddingVertical: APP_SPACING.xs,
    paddingHorizontal: APP_SPACING.xxs,
    justifyContent: 'center',
  },
  headerCellText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.chatSubtitle,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
    minHeight: 44,
  },
  // Matches web's `.highlight-row` (top 3) / `.zero-row` (no documents yet).
  highlightRow: {
    backgroundColor: '#fffbeb',
  },
  zeroRow: {
    opacity: 0.7,
  },
  rankTag: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankTagDefault: {
    backgroundColor: '#f1f5f9',
  },
  rankTagGold: {
    backgroundColor: '#f59e0b',
  },
  rankTagSilver: {
    backgroundColor: '#94a3b8',
  },
  rankTagBronze: {
    backgroundColor: '#d97706',
  },
  rankTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  rankTagTextOnColor: {
    color: APP_COLORS.white,
  },
  cellText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
    textAlign: 'center',
    paddingHorizontal: APP_SPACING.xxs,
    paddingVertical: APP_SPACING.xs,
  },
  cellWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  textSuccess: {
    color: '#16a34a',
    fontWeight: '700',
  },
  linkText: {
    color: APP_COLORS.primary,
    fontWeight: '700',
  },
  emptyRow: {
    paddingVertical: APP_SPACING.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    fontStyle: 'italic',
  },
  levelBadge: {
    paddingHorizontal: APP_SPACING.xs,
    paddingVertical: 4,
    borderRadius: Radius.xl,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  level_very_active: {
    backgroundColor: '#dcfce7',
  },
  level_active: {
    backgroundColor: '#dbeafe',
  },
  level_normal: {
    backgroundColor: '#fef9c3',
  },
  level_low: {
    backgroundColor: '#f1f5f9',
  },
  paginationFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: APP_SPACING.sm,
    marginTop: APP_SPACING.sm,
    paddingTop: APP_SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.chatBorder,
  },
  pageSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
  },
  pageSizeLabel: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
  },
  pageSizeChip: {
    width: 32,
    height: 28,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageSizeChipActive: {
    backgroundColor: APP_COLORS.primary,
    borderColor: APP_COLORS.primary,
  },
  pageSizeChipText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  pageSizeChipTextActive: {
    color: APP_COLORS.white,
  },
  pageNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
  },
  pageNavButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  pageInfo: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
});
