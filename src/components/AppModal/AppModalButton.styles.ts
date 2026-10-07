import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize } from '@/utils';

export const appModalButtonStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: APP_SPACING.xs,
    minWidth: 110,
    height: 44,
    paddingHorizontal: APP_SPACING.lg,
    borderRadius: 12,
  },
  block: {
    flex: 1,
  },
  primary: {
    backgroundColor: APP_COLORS.primary,
  },
  danger: {
    backgroundColor: '#dc2626',
  },
  success: {
    backgroundColor: '#16a34a',
  },
  secondary: {
    backgroundColor: APP_COLORS.surface,
    borderWidth: 1,
    borderColor: '#d9dde3',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});
