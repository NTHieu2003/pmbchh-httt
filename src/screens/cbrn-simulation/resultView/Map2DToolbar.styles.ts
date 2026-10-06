import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const map2DToolbarStyles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
    backgroundColor: APP_COLORS.surface,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    backgroundColor: '#fff6e0',
    marginRight: APP_SPACING.xxs,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: APP_COLORS.chatBrandRed,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  buttonActive: {
    backgroundColor: APP_COLORS.navy,
    borderColor: APP_COLORS.navy,
  },
  buttonText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  buttonTextActive: {
    color: APP_COLORS.white,
  },
});
