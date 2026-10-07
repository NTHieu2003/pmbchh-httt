import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

// Body-only styles — the dialog shell (backdrop, card, header, footer)
// comes from AppModal.
export const cbrnScenarioAttachModalStyles = StyleSheet.create({
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: APP_SPACING.lg,
    gap: APP_SPACING.xs,
  },
  listHeader: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: APP_SPACING.xxs,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: APP_SPACING.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: APP_SPACING.sm,
    padding: APP_SPACING.sm,
    borderRadius: Radius.md,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  rowSelected: {
    backgroundColor: '#eef3fd',
    borderColor: '#c7d6f5',
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  rowMeta: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
    lineHeight: FontSize.xs * 1.5,
  },
  kbupPill: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 2,
    borderRadius: Radius.xl,
    backgroundColor: '#e8eefb',
  },
  kbupPillText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.primary,
  },
  checkbox: {
    width: 22,
    height: 22,
    marginTop: 1,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    backgroundColor: APP_COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: APP_COLORS.primary,
    borderColor: APP_COLORS.primary,
  },
});
