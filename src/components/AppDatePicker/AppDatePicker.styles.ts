import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const appDatePickerStyles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    height: 44,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.md,
    paddingHorizontal: APP_SPACING.sm,
    backgroundColor: APP_COLORS.surface,
  },
  valueText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
  placeholderText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: APP_COLORS.chatIconMuted,
  },
});
