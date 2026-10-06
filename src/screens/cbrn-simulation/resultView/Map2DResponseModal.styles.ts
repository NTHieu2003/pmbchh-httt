import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const map2DResponseModalStyles = StyleSheet.create({
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
    backgroundColor: '#0f766e',
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
  ovValueSuccess: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: '#16a34a',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginBottom: APP_SPACING.xs,
  },
  stationCard: {
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.md,
    padding: APP_SPACING.sm,
    marginBottom: APP_SPACING.xs,
  },
  stationTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginBottom: 4,
  },
  stationField: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
    lineHeight: 18,
    marginTop: 2,
  },
  stationFieldLabel: {
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: APP_SPACING.sm,
    margin: APP_SPACING.md,
  },
  closeButton: {
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
  exportDocButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.md,
    backgroundColor: '#0f766e',
  },
  exportDocButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.white,
  },
});
