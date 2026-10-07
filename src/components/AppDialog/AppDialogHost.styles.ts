import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize } from '@/utils';

export const appDialogHostStyles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: APP_SPACING.sm,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: APP_SPACING.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    textAlign: 'center',
  },
  message: {
    marginTop: APP_SPACING.xs,
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.5,
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    gap: APP_SPACING.sm,
  },
});
