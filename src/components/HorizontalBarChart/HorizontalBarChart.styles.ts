import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const horizontalBarChartStyles = StyleSheet.create({
  section: {
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
  subtitle: {
    marginTop: 2,
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    fontStyle: 'italic',
    paddingVertical: APP_SPACING.md,
  },
  chart: {
    marginTop: APP_SPACING.md,
    gap: APP_SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
  },
  label: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
  // Recessive track so the bar's length reads against the full scale.
  track: {
    flex: 1,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#f1f3f6',
    overflow: 'hidden',
  },
  // Anchored at the baseline (left), rounded only at the data end.
  bar: {
    height: '100%',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: APP_COLORS.primary,
  },
  value: {
    width: 96,
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  share: {
    fontSize: FontSize.xs,
    fontWeight: '400',
    color: APP_COLORS.chatSubtitle,
  },
});
