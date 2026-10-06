import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const map2DImpactModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.xl,
  },
  card: {
    width: '92%',
    maxWidth: 640,
    maxHeight: '85%',
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
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  body: {
    paddingHorizontal: APP_SPACING.md,
    paddingTop: APP_SPACING.sm,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_SPACING.sm,
    marginBottom: APP_SPACING.sm,
  },
  overviewItem: {
    flexGrow: 1,
    minWidth: 140,
    backgroundColor: APP_COLORS.background,
    borderRadius: Radius.sm,
    padding: APP_SPACING.sm,
  },
  ovLabel: {
    fontSize: 10,
    color: APP_COLORS.chatSubtitle,
  },
  ovValue: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginTop: 2,
  },
  ovValueDanger: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: '#dc2626',
    marginTop: 2,
  },
  ovValueInfo: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: '#0284c7',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginBottom: APP_SPACING.xs,
  },
  levelCard: {
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.md,
    padding: APP_SPACING.sm,
    marginBottom: APP_SPACING.xs,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
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
    marginTop: 4,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  guidanceCard: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: Radius.md,
    padding: APP_SPACING.sm,
    marginTop: APP_SPACING.xs,
    marginBottom: APP_SPACING.sm,
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
