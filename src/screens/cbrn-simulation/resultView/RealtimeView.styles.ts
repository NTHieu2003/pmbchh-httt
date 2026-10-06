import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const realtimeViewStyles = StyleSheet.create({
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    flex: 1,
  },
  clockText: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
    fontFamily: 'monospace',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    flexWrap: 'wrap',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: APP_COLORS.primary,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.md,
  },
  playButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  resetButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    backgroundColor: APP_COLORS.white,
  },
  speedChipRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    flex: 1,
  },
  speedChip: {
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    backgroundColor: APP_COLORS.background,
  },
  speedChipActive: {
    backgroundColor: APP_COLORS.primary,
  },
  speedChipText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
  },
  speedChipTextActive: {
    color: APP_COLORS.white,
  },
  seekBarTrack: {
    height: 16,
    borderRadius: Radius.sm,
    backgroundColor: APP_COLORS.background,
    overflow: 'visible',
    justifyContent: 'center',
  },
  seekBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: Radius.sm,
    backgroundColor: APP_COLORS.primaryDisabled,
  },
  seekBarThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: APP_COLORS.primary,
    borderWidth: 2,
    borderColor: APP_COLORS.white,
  },
  seekTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seekTimeText: {
    fontSize: 11,
    color: APP_COLORS.chatSubtitle,
    fontFamily: 'monospace',
  },
  seekNowLink: {
    fontSize: 11,
    color: APP_COLORS.primary,
    fontWeight: '600',
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
  svgWrap: {
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  timelineWrap: {
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.md,
    padding: APP_SPACING.sm,
    gap: 4,
  },
  timelineTitle: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
  },
});
