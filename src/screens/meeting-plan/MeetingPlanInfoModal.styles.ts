import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

// Body-only styles — the dialog shell (backdrop, card, header, footer,
// keyboard avoidance, gesture root) comes from AppModal.
export const meetingPlanInfoModalStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    gap: APP_SPACING.xxs,
    padding: 4,
    marginHorizontal: APP_SPACING.lg,
    marginTop: APP_SPACING.md,
    borderRadius: Radius.md,
    backgroundColor: '#f1f5f9',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: APP_SPACING.xs,
    paddingHorizontal: APP_SPACING.xxs,
    borderRadius: Radius.sm,
  },
  tabButtonActive: {
    backgroundColor: APP_COLORS.surface,
    elevation: 1,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  tabButtonText: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
  },
  tabButtonTextActive: {
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
    marginHorizontal: APP_SPACING.lg,
    marginTop: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.sm,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
    padding: 0,
  },
  body: {
    flex: 1,
    paddingHorizontal: APP_SPACING.lg,
    paddingTop: APP_SPACING.xs,
  },
  // Seating chart: framed soft card so the zoomable image has a clear
  // bounds while panning.
  bodyImage: {
    margin: APP_SPACING.lg,
    marginTop: APP_SPACING.sm,
    paddingHorizontal: 0,
    paddingTop: 0,
    borderRadius: Radius.md,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#eef0f3',
    overflow: 'hidden',
  },
  loading: {
    marginTop: APP_SPACING.xl,
  },
  row: {
    flexDirection: 'row',
    gap: APP_SPACING.sm,
    paddingVertical: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#eef0f3',
  },
  indexBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  indexText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.chatSubtitle,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  content: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatIconMuted,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_SPACING.sm,
  },
  meta: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
  },
  emptyText: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatIconMuted,
    fontStyle: 'italic',
    marginTop: APP_SPACING.md,
  },
});
