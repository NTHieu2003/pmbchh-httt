import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const cbrnScenarioDetailModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.xl,
  },
  card: {
    width: '90%',
    maxWidth: 560,
    maxHeight: '80%',
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
    paddingHorizontal: APP_SPACING.md,
    paddingTop: APP_SPACING.sm,
  },
  field: {
    marginBottom: APP_SPACING.md,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
    marginBottom: 4,
  },
  value: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
    lineHeight: FontSize.sm * 1.5,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xxs,
    borderRadius: Radius.xl,
  },
  statusActive: {
    backgroundColor: '#dcfce7',
  },
  statusInactive: {
    backgroundColor: '#f1f5f9',
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  statusTextActive: {
    color: '#16a34a',
  },
  statusTextInactive: {
    color: APP_COLORS.chatSubtitle,
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
