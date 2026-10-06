import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const meetingRoomAgendaModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.xl,
  },
  card: {
    width: '60%',
    maxWidth: 640,
    height: '70%',
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
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.xs,
    backgroundColor: APP_COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  tableHeaderText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.chatSubtitle,
  },
  timeCol: {
    width: 110,
  },
  contentCol: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: APP_SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: APP_SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.background,
  },
  rowCurrent: {
    backgroundColor: APP_COLORS.chatSidebarSoftBg,
  },
  timeText: {
    fontSize: FontSize.xs,
  },
  contentText: {
    fontSize: FontSize.sm,
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
