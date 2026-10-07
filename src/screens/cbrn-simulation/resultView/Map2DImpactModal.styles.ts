import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

// Body-only styles — the dialog shell (backdrop, card, header, footer)
// comes from AppModal. The danger/info value colors, level swatches and the
// amber guidance card encode data/severity and stay as they were.
export const map2DImpactModalStyles = StyleSheet.create({
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_SPACING.sm,
    marginBottom: APP_SPACING.md,
  },
  overviewItem: {
    flexGrow: 1,
    flexBasis: 160,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#eef0f3',
    borderRadius: Radius.md,
    padding: APP_SPACING.sm,
  },
  ovLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  ovValue: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginTop: 4,
  },
  ovValueDanger: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: '#dc2626',
    marginTop: 4,
  },
  ovValueInfo: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: '#0284c7',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: APP_SPACING.xs,
  },
  levelCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#eef0f3',
    borderRadius: Radius.md,
    padding: APP_SPACING.sm,
    marginBottom: APP_SPACING.xs,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
  },
  levelSwatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  levelLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  levelField: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
    marginTop: 4,
  },
  levelFieldLabel: {
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  levelDescription: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#eef0f3',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  guidanceCard: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: Radius.md,
    padding: APP_SPACING.sm,
    marginTop: APP_SPACING.sm,
  },
  guidanceTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: APP_SPACING.xs,
  },
  guidanceLine: {
    fontSize: FontSize.xs,
    color: APP_COLORS.textPrimary,
    lineHeight: 19,
    marginBottom: 6,
  },
  guidanceBold: {
    fontWeight: '700',
  },
});
