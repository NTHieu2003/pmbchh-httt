import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const chemicalInfoCardStyles = StyleSheet.create({
  card: {
    marginTop: APP_SPACING.xs,
    backgroundColor: APP_COLORS.chatSidebarBg,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.sm,
    padding: APP_SPACING.sm,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 11,
    color: APP_COLORS.chatSubtitle,
  },
  value: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  valueAccent: {
    color: APP_COLORS.chatBrandRed,
  },
  warningText: {
    fontSize: 11,
    color: '#b45309',
    lineHeight: 15,
    marginTop: APP_SPACING.xxs,
  },
});
