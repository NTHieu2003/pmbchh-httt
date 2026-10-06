import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const guideFaqItemStyles = StyleSheet.create({
  card: {
    backgroundColor: APP_COLORS.white,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    padding: APP_SPACING.sm + APP_SPACING.xxs,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: APP_COLORS.chatSidebarSoftBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  answerWrap: {
    paddingHorizontal: APP_SPACING.sm + APP_SPACING.xxs,
    paddingBottom: APP_SPACING.sm + APP_SPACING.xxs,
    paddingLeft: 32 + APP_SPACING.sm + APP_SPACING.sm + APP_SPACING.xxs,
  },
  answer: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.6,
    color: APP_COLORS.chatSubtitle,
  },
});
