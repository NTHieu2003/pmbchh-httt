import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const meetingRoomSttPanelStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    gap: APP_SPACING.xxs,
    paddingHorizontal: APP_SPACING.sm,
    paddingBottom: APP_SPACING.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: APP_SPACING.xs,
    alignItems: 'center',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  tabActive: {
    backgroundColor: '#dfe6fa',
    borderColor: APP_COLORS.primary,
  },
  tabText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  tabTextActive: {
    color: APP_COLORS.primary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: APP_SPACING.sm,
    paddingBottom: APP_SPACING.sm,
    gap: APP_SPACING.xs,
  },
  messageCard: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    padding: APP_SPACING.sm,
    gap: 2,
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
  },
  speakerName: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.primary,
  },
  timeText: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatIconMuted,
  },
  contentText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
  liveCard: {
    backgroundColor: '#fff6e0',
    borderColor: APP_COLORS.chatBrandRed,
  },
  liveBadge: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.chatBrandRed,
  },
  processingText: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatIconMuted,
    fontStyle: 'italic',
    paddingHorizontal: APP_SPACING.sm,
    paddingBottom: APP_SPACING.xs,
  },
});
