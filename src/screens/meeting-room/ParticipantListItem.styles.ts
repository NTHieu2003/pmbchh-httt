import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize } from '@/utils';

export const participantListItemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    paddingVertical: APP_SPACING.xxs,
    paddingHorizontal: APP_SPACING.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
  unit: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
  },
  actionButton: {
    padding: 4,
  },
});
