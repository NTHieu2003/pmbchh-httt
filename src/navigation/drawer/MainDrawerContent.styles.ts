import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const mainDrawerContentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.chatSidebarBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  logo: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  menu: {
    flex: 1,
    padding: APP_SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.sm,
    borderRadius: Radius.md,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  menuItemActive: {
    backgroundColor: APP_COLORS.chatSidebarSoftBg,
    borderBottomColor: 'transparent',
  },
  menuItemText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  menuItemTextActive: {
    color: APP_COLORS.chatBrandRed,
    fontWeight: '700',
  },
  footer: {
    padding: APP_SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.chatBorder,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: APP_SPACING.xs,
    height: 44,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  logoutText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.danger,
  },
  softwareInfo: {
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
    backgroundColor: APP_COLORS.footer,
  },
  softwareInfoText: {
    fontSize: 10,
    fontWeight: '500',
    color: APP_COLORS.white,
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 14,
  },
  supportText: {
    fontSize: 10,
    fontWeight: '600',
    color: APP_COLORS.white,
    textAlign: 'center',
    marginTop: APP_SPACING.xxs,
  },
});
