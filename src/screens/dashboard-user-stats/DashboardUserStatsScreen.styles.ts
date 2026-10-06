import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const dashboardUserStatsScreenStyles = StyleSheet.create({
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
    fontSize: FontSize.md,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  // Replaces the old scrollable content container — `bottomRow` (flex: 1)
  // now fills the screen, so this just needs to be a column flex container.
  body: {
    flex: 1,
    padding: APP_SPACING.md,
    gap: APP_SPACING.md,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Matches web's `.du-filter` — date range + đơn vị autocomplete + action
  // buttons, wrapping on narrower widths.
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: APP_SPACING.sm,
    backgroundColor: APP_COLORS.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    padding: APP_SPACING.md,
  },
  filterField: {
    flexGrow: 1,
    minWidth: 160,
  },
  filterDonViField: {
    flexGrow: 2,
    minWidth: 220,
  },
  filterDonViLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
    marginBottom: 6,
  },
  filterActions: {
    flexDirection: 'row',
    gap: APP_SPACING.xs,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
    paddingHorizontal: APP_SPACING.md,
    borderRadius: Radius.md,
    backgroundColor: APP_COLORS.primary,
  },
  searchButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
    paddingHorizontal: APP_SPACING.md,
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
  // All 4 cards in one row — each KpiCard is `flex: 1` (equal width), no
  // wrap.
  kpiRow: {
    flexDirection: 'row',
    gap: APP_SPACING.sm,
  },
  // Fills whatever vertical space is left after the header/filter bar/KPI
  // row — each TopListCard stretches to this row's full height and
  // scrolls its own rows internally.
  bottomRow: {
    flex: 1,
    flexDirection: 'row',
    gap: APP_SPACING.sm,
  },
});
