import { StyleSheet } from 'react-native';

// Body-only styles — the dialog shell (backdrop, card, header) comes from
// AppModal (size xl, 90% window height).
export const htmlDocViewerModalStyles = StyleSheet.create({
  // Light gray canvas behind the white document page.
  canvas: {
    backgroundColor: '#f1f3f6',
  },
  webview: {
    flex: 1,
    backgroundColor: '#f1f3f6',
  },
});
