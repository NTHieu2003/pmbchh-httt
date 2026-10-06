import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const suggestedQuestionsPanelStyles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: APP_COLORS.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    marginBottom: APP_SPACING.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
  },
  headerTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  list: {
    padding: APP_SPACING.sm,
    gap: APP_SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.sm,
    borderRadius: Radius.md,
    backgroundColor: APP_COLORS.chatSuggestionRowBg,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: APP_COLORS.chatIconMuted,
  },
  rowText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
});
