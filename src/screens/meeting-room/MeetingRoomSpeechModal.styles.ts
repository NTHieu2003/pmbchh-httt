import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

// Body-only styles — the dialog shell (backdrop, card, header, footer)
// comes from AppModal.
export const meetingRoomSpeechModalStyles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'row',
    gap: APP_SPACING.md,
    padding: APP_SPACING.lg,
  },
  column: {
    flex: 1,
    borderRadius: Radius.md,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#eef0f3',
    overflow: 'hidden',
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    minHeight: 44,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#eef0f3',
  },
  // `flex: 1` is safe here: the title always sits in the row-direction
  // `columnHeader`, so it only eats leftover horizontal space and pushes
  // the "Thêm" button to the far right.
  columnTitle: {
    flex: 1,
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 4,
    borderRadius: Radius.xl,
    backgroundColor: '#e8eefc',
  },
  addButtonText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.sm,
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
    backgroundColor: APP_COLORS.surface,
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  indexText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.chatSubtitle,
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  speaker: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
  },
  meta: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
  },
  statusPill: {
    paddingHorizontal: APP_SPACING.xs,
    paddingVertical: 2,
    borderRadius: Radius.xl,
    backgroundColor: '#f1f5f9',
  },
  statusPillPublished: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
  },
  statusTextPublished: {
    color: '#16a34a',
  },
  content: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatIconMuted,
    fontStyle: 'italic',
  },
  emptyText: {
    padding: APP_SPACING.sm,
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
});
