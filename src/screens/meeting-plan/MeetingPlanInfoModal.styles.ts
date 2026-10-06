import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const meetingPlanInfoModalStyles = StyleSheet.create({
  keyboardAvoider: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.xl,
  },
  card: {
    width: '85%',
    maxWidth: 640,
    height: '75%',
    backgroundColor: APP_COLORS.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    backgroundColor: APP_COLORS.navy,
  },
  title: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.xxs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: APP_COLORS.primary,
  },
  tabButtonText: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    fontWeight: '600',
    color: APP_COLORS.chatIconMuted,
  },
  tabButtonTextActive: {
    color: APP_COLORS.primary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
    marginHorizontal: APP_SPACING.md,
    marginTop: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.sm,
    height: 38,
    borderRadius: Radius.sm,
    backgroundColor: APP_COLORS.background,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
    padding: 0,
  },
  body: {
    flex: 1,
    paddingHorizontal: APP_SPACING.md,
    paddingTop: APP_SPACING.sm,
  },
  loading: {
    marginTop: APP_SPACING.xl,
  },
  row: {
    flexDirection: 'row',
    gap: APP_SPACING.xs,
    paddingVertical: APP_SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.background,
  },
  index: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: FontSize.sm,
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
  closeButton: {
    margin: APP_SPACING.md,
    alignSelf: 'flex-end',
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  closeButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
});
