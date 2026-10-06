import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize } from '@/utils';

export const messageViewerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.surface,
  },
  header: {
    paddingHorizontal: APP_SPACING.lg,
    paddingVertical: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.xl,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: APP_COLORS.chatSubtitle,
    textAlign: 'center',
    marginTop: APP_SPACING.sm,
  },
});
