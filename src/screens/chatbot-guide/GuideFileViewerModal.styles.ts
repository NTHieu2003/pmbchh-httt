import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const guideFileViewerModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.xl,
  },
  // Floating dialog card, not full-screen — matches web's centered
  // MatDialog sizing (fixed w/h, not the whole viewport).
  card: {
    width: '90%',
    maxWidth: 900,
    height: '82%',
    maxHeight: 620,
    backgroundColor: '#000000',
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    backgroundColor: '#111111',
  },
  title: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '700',
    color: APP_COLORS.white,
    marginRight: APP_SPACING.sm,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: APP_SPACING.sm,
  },
  loadingText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.white,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.white,
    textAlign: 'center',
    paddingHorizontal: APP_SPACING.xl,
  },
});
