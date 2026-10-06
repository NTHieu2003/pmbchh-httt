import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const threatZoneViewStyles = StyleSheet.create({
  scrollContent: {
    padding: APP_SPACING.lg,
    gap: APP_SPACING.sm,
  },
  emptyState: {
    padding: APP_SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyTextBold: {
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  modelBadge: {
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xxs,
    borderRadius: Radius.sm,
  },
  modelBadgeHeavy: {
    backgroundColor: '#fee2e2',
  },
  modelBadgeGauss: {
    backgroundColor: '#dcfce7',
  },
  modelBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_SPACING.sm,
  },
  metricCard: {
    flexGrow: 1,
    minWidth: 130,
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.md,
    padding: APP_SPACING.sm,
  },
  metricLabel: {
    fontSize: 11,
    color: APP_COLORS.chatSubtitle,
  },
  metricValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginTop: 2,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    fontSize: FontSize.xs,
    color: APP_COLORS.textPrimary,
  },
  svgWrap: {
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  decisionLogBox: {
    backgroundColor: '#0f172a',
    borderRadius: Radius.md,
    padding: APP_SPACING.sm,
    gap: 4,
  },
  decisionLogLine: {
    fontSize: 11,
    color: '#e2e8f0',
    fontFamily: 'monospace',
  },
});
