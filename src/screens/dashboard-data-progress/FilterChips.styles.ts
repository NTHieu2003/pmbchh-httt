import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const filterChipsStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_SPACING.xs,
  },
  chip: {
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    backgroundColor: APP_COLORS.surface,
  },
  chipActive: {
    backgroundColor: APP_COLORS.primary,
    borderColor: APP_COLORS.primary,
  },
  chipText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  chipTextActive: {
    color: APP_COLORS.white,
  },
});
