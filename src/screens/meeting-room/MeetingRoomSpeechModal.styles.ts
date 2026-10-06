import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const meetingRoomSpeechModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.xl,
  },
  card: {
    width: '85%',
    maxWidth: 760,
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
  body: {
    flex: 1,
    flexDirection: 'row',
    gap: APP_SPACING.md,
    paddingHorizontal: APP_SPACING.md,
    paddingTop: APP_SPACING.sm,
  },
  column: {
    flex: 1,
  },
  columnTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginBottom: APP_SPACING.xs,
    paddingBottom: APP_SPACING.xxs,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: APP_SPACING.xs,
  },
  // Only applied together with `columnTitle` inside `columnHeader` — makes
  // the title eat the row's leftover *horizontal* space so the "+" button
  // sits at the far right. Must stay off the base style: `columnTitle`
  // alone is also used as a direct (column-axis) child of `column` for the
  // published list, where `flex: 1` would instead grow it vertically and
  // shove the FlatList (and its one row) down to the bottom of the card.
  columnTitleInHeader: {
    flex: 1,
  },
  addButton: {
    marginBottom: APP_SPACING.xs,
    padding: 2,
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
  speaker: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: APP_SPACING.sm,
  },
  meta: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
  },
  content: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatIconMuted,
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatIconMuted,
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: APP_SPACING.md,
    marginTop: 2,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionLinkText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.primary,
  },
  actionLinkTextDanger: {
    color: APP_COLORS.chatBrandRed,
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
