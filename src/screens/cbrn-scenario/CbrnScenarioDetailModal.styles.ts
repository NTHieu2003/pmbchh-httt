import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

// Body-only styles — the dialog shell (backdrop, card, header, footer)
// comes from AppModal.
export const cbrnScenarioDetailModalStyles = StyleSheet.create({
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_SPACING.sm,
  },
  field: {
    flexGrow: 1,
    flexBasis: 160,
    padding: APP_SPACING.sm,
    borderRadius: Radius.md,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  section: {
    marginTop: APP_SPACING.sm,
    padding: APP_SPACING.sm,
    borderRadius: Radius.md,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 3,
    borderRadius: Radius.xl,
  },
  statusActive: {
    backgroundColor: '#dcfce7',
  },
  statusInactive: {
    backgroundColor: '#f1f5f9',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotActive: {
    backgroundColor: '#16a34a',
  },
  statusDotInactive: {
    backgroundColor: '#94a3b8',
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
});
