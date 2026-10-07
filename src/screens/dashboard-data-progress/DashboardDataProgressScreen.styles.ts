import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const dashboardDataProgressScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.sm,
    backgroundColor: APP_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  menuButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: APP_SPACING.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    backgroundColor: APP_COLORS.surface,
  },
  refreshButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  scrollContent: {
    padding: APP_SPACING.md,
    gap: APP_SPACING.md,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.xl,
  },
  loadingText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    textAlign: 'center',
  },
  errorText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.md,
    backgroundColor: APP_COLORS.primary,
  },
  retryButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  // All 4 cards in one row.
  kpiRow: {
    flexDirection: 'row',
    gap: APP_SPACING.sm,
  },
  // Chart + active-users list side by side; wraps to stacked on narrow
  // widths (each card sets its own flexBasis/minWidth).
  bottomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: APP_SPACING.md,
  },
});
