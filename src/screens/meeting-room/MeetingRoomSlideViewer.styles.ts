import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize } from '@/utils';

export const meetingRoomSlideViewerStyles = StyleSheet.create({
  pdf: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.lg,
  },
  placeholderText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    textAlign: 'center',
  },
  errorText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.danger,
    textAlign: 'center',
  },
});
