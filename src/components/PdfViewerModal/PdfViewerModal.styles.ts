import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize } from '@/utils';

// Body-only styles — the dialog shell (backdrop, card, header) comes from
// AppModal (size xl, 90% window height).
export const pdfViewerModalStyles = StyleSheet.create({
  // Light gray canvas behind the PDF pages / error state.
  canvas: {
    backgroundColor: '#f1f3f6',
  },
  pdf: {
    flex: 1,
    backgroundColor: '#f1f3f6',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.xl,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    textAlign: 'center',
  },
});
