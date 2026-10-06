import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const scenarioFormCardStyles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_SPACING.xxs,
  },
  tab: {
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    backgroundColor: APP_COLORS.chatSidebarBg,
  },
  tabActive: {
    backgroundColor: '#fdecd8',
    borderColor: '#e8792e',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  tabTextActive: {
    color: '#c2571a',
  },
  description: {
    fontSize: 11,
    color: APP_COLORS.chatSubtitle,
    fontStyle: 'italic',
    lineHeight: 15,
  },
  warningBox: {
    backgroundColor: '#fff1f0',
    borderWidth: 1,
    borderColor: '#ffccc7',
    borderRadius: Radius.sm,
    padding: APP_SPACING.sm,
  },
  warningText: {
    fontSize: 11,
    color: APP_COLORS.danger,
    lineHeight: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  runButton: {
    marginTop: APP_SPACING.xs,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: APP_COLORS.chatBrandRed,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: APP_SPACING.xxs,
  },
  runButtonDisabled: {
    backgroundColor: APP_COLORS.chatIconMuted,
  },
  runButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.white,
    letterSpacing: 0.3,
  },
  realtimeButton: {
    marginTop: APP_SPACING.xs,
    height: 40,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.primary,
    backgroundColor: APP_COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: APP_SPACING.xxs,
  },
  realtimeButtonText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.primary,
    letterSpacing: 0.3,
  },
});
