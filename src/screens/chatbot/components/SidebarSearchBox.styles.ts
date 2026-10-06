import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const sidebarSearchBoxStyles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
    marginHorizontal: APP_SPACING.sm,
    marginTop: APP_SPACING.xs,
    paddingHorizontal: APP_SPACING.sm,
    height: 45,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    backgroundColor: APP_COLORS.white,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.xs,
    color: APP_COLORS.textPrimary,
  },
});
