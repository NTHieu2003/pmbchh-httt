import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

// Body-only styles — the dialog shell (backdrop, card, header, footer)
// comes from AppModal.
export const meetingRoomAgendaModalStyles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: APP_SPACING.lg,
    marginTop: APP_SPACING.md,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.md,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  tableHeaderText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  timeCol: {
    width: 130,
  },
  contentCol: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: APP_SPACING.lg,
    paddingTop: APP_SPACING.xs,
    paddingBottom: APP_SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#eef0f3',
  },
  rowCurrent: {
    backgroundColor: APP_COLORS.chatSidebarSoftBg,
    borderRadius: Radius.md,
    borderBottomColor: 'transparent',
  },
  timePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: APP_SPACING.xs,
    paddingVertical: 2,
    borderRadius: Radius.xl,
    backgroundColor: '#f1f5f9',
  },
  timePillCurrent: {
    backgroundColor: '#fee2e2',
  },
  timeText: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
  },
  contentText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
    lineHeight: FontSize.sm * 1.4,
  },
  textCovered: {
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  textCurrent: {
    fontWeight: '700',
    color: APP_COLORS.chatBrandRed,
  },
  textUpcoming: {
    fontStyle: 'italic',
    color: APP_COLORS.chatSubtitle,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatIconMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: APP_SPACING.lg,
  },
});
