import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const formCardStyles = StyleSheet.create({
  card: {
    backgroundColor: APP_COLORS.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    padding: APP_SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    marginBottom: APP_SPACING.sm,
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e8792e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  body: {
    gap: APP_SPACING.sm,
  },
});
