import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const topListCardStyles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 320,
    backgroundColor: APP_COLORS.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    padding: APP_SPACING.md,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginBottom: APP_SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
    paddingBottom: APP_SPACING.xs,
  },
  headerCell: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.chatSubtitle,
    textAlign: 'center',
  },
  listScroll: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.background,
  },
  cell: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
    textAlign: 'center',
  },
  cellLeft: {
    textAlign: 'left',
  },
  rankBadge: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.chatBrandRed,
  },
  emptyText: {
    fontSize: FontSize.sm,
    fontStyle: 'italic',
    color: APP_COLORS.chatIconMuted,
    textAlign: 'center',
    paddingVertical: APP_SPACING.lg,
  },
});
