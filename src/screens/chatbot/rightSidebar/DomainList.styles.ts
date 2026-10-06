import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize } from '@/utils';

export const domainListStyles = StyleSheet.create({
  listContent: {
    padding: APP_SPACING.sm,
  },
  messageBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.lg,
    gap: APP_SPACING.xs,
  },
  messageText: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
    textAlign: 'center',
  },
});
