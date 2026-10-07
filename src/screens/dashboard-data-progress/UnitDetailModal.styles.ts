import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

// Body-only styles — the dialog shell (backdrop, card, header, footer)
// comes from AppModal.
export const unitDetailModalStyles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_SPACING.sm,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: 120,
    padding: APP_SPACING.sm,
    borderRadius: Radius.md,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  statCardSuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: '#dcfce7',
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  statValueSuccess: {
    color: '#16a34a',
  },
  listCard: {
    marginTop: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.sm,
    borderRadius: Radius.md,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: APP_SPACING.xl,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    paddingVertical: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#eef0f3',
  },
  docRowLast: {
    borderBottomWidth: 0,
  },
  docIndex: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef0f3',
  },
  docIndexText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
  },
  docInfo: {
    flex: 1,
  },
  docTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  docMeta: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 3,
    borderRadius: Radius.xl,
    backgroundColor: '#f1f5f9',
  },
  statusPillValid: {
    backgroundColor: '#dcfce7',
  },
  statusPillText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.chatSubtitle,
  },
  statusPillTextValid: {
    color: '#16a34a',
  },
});
