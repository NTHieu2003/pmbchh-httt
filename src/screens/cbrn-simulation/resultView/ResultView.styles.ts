import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize } from '@/utils';

export const resultViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
    backgroundColor: APP_COLORS.white,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: APP_COLORS.chatBrandRed,
  },
  tabText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.chatIconMuted,
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: APP_COLORS.chatBrandRed,
  },
  content: {
    flex: 1,
  },
});
