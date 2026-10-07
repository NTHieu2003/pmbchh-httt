import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize } from '@/utils';

// Body-only styles — the dialog shell (backdrop, card, header) comes from
// AppModal (size xl, 90% window height).
export const guideFileViewerModalStyles = StyleSheet.create({
  // PDF pages and loading/error states sit on a light gray canvas.
  canvas: {
    backgroundColor: '#f1f3f6',
  },
  // Video keeps a black canvas behind the player.
  canvasVideo: {
    backgroundColor: '#000000',
  },
  pdf: {
    flex: 1,
    backgroundColor: '#f1f3f6',
  },
  video: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.xl,
  },
  stateText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    textAlign: 'center',
  },
});
