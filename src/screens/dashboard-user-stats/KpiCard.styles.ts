import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const kpiCardStyles = StyleSheet.create({
  // All 4 cards share one row (`flex: 1` each, see `kpiRow` in
  // DashboardUserStatsScreen.styles.ts) — sized down from the old 2-per-row
  // layout so 4 still fit comfortably.
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    backgroundColor: APP_COLORS.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    padding: APP_SPACING.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
    marginBottom: 4,
  },
  // Number + growth indicator share one line: "2 (↑100%)".
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  growthInline: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});
