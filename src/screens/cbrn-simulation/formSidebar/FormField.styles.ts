import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const formFieldStyles = StyleSheet.create({
  label: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.chatSubtitle,
    letterSpacing: 0.3,
    marginBottom: APP_SPACING.xxs,
  },
  input: {
    height: APP_SPACING.height32,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.sm,
    paddingHorizontal: APP_SPACING.sm,
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
    backgroundColor: APP_COLORS.chatSidebarBg,
  },
  hint: {
    fontSize: 11,
    color: APP_COLORS.chatIconMuted,
    marginTop: APP_SPACING.xxs,
  },
});
