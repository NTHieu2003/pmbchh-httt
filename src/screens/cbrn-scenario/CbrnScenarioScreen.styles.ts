import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const cbrnScenarioScreenStyles = StyleSheet.create({
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
  exportButton: {
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
  exportButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
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
  },
  errorText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.xs,
    borderRadius: 8,
    backgroundColor: APP_COLORS.primary,
  },
  retryButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
    marginHorizontal: APP_SPACING.sm,
    marginTop: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.sm,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: APP_COLORS.surface,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
    padding: 0,
  },
  statusFilterRow: {
    flexDirection: 'row',
    gap: APP_SPACING.xxs,
    marginHorizontal: APP_SPACING.sm,
    marginTop: APP_SPACING.sm,
  },
  statusPill: {
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  statusPillActive: {
    backgroundColor: '#dfe6fa',
    borderColor: APP_COLORS.primary,
  },
  statusPillText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  statusPillTextActive: {
    color: APP_COLORS.primary,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: APP_SPACING.sm,
  },
  emptyBox: {
    paddingVertical: APP_SPACING.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    fontStyle: 'italic',
  },
});
