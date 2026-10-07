import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

// Body-only styles — the dialog shell (backdrop, card, header, footer)
// comes from AppModal.
export const meetingRoomInfoModalStyles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    gap: APP_SPACING.xxs,
    padding: 4,
    marginBottom: APP_SPACING.md,
    borderRadius: Radius.md,
    backgroundColor: '#f1f5f9',
  },
  tab: {
    flex: 1,
    paddingVertical: APP_SPACING.xs,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  tabActive: {
    backgroundColor: APP_COLORS.surface,
    elevation: 1,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  tabText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
  },
  tabTextActive: {
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_SPACING.sm,
  },
  field: {
    flexGrow: 1,
    flexBasis: 200,
    padding: APP_SPACING.sm,
    borderRadius: Radius.md,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  fieldWide: {
    flexBasis: '100%',
  },
  seatingChartBox: {
    minHeight: 200,
    borderRadius: Radius.md,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#eef0f3',
    borderStyle: 'dashed',
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
});
