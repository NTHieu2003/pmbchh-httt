import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const headerUserMenuStyles = StyleSheet.create({
  container: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    maxWidth: 240,
    paddingLeft: APP_SPACING.xxxs,
    paddingRight: APP_SPACING.sm,
    height: 36,
    borderRadius: 18,
    backgroundColor: APP_COLORS.chatSidebarSoftBg,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_COLORS.chatBrandRed,
  },
  userName: {
    flexShrink: 1,
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxxs,
    height: 36,
    paddingHorizontal: APP_SPACING.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  logoutText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.danger,
  },
});
