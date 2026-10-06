import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const appPopoverStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menu: {
    position: 'absolute',
    backgroundColor: APP_COLORS.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    paddingVertical: APP_SPACING.xxs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    height: 44,
    paddingHorizontal: APP_SPACING.sm,
  },
  itemDivider: {
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.chatBorder,
  },
  itemLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});
