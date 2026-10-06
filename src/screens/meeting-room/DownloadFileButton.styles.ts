import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { FontSize } from '@/utils';

export const downloadFileButtonStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  text: {
    fontSize: FontSize.xs,
    color: APP_COLORS.primary,
    flexShrink: 1,
    textDecorationLine: 'underline',
  },
});
