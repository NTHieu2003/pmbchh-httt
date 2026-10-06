import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const meetingRoomInfoModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.xl,
  },
  card: {
    width: '85%',
    maxWidth: 640,
    maxHeight: '80%',
    backgroundColor: APP_COLORS.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    backgroundColor: APP_COLORS.navy,
  },
  title: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  tabRow: {
    flexDirection: 'row',
    gap: APP_SPACING.xxs,
    paddingHorizontal: APP_SPACING.md,
    paddingTop: APP_SPACING.sm,
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
  body: {
    paddingHorizontal: APP_SPACING.md,
    paddingTop: APP_SPACING.sm,
  },
  seatingChartBox: {
    minHeight: 200,
  },
  field: {
    marginBottom: APP_SPACING.md,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
    marginBottom: 4,
  },
  value: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
    lineHeight: FontSize.sm * 1.5,
  },
  closeButton: {
    margin: APP_SPACING.md,
    alignSelf: 'flex-end',
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  closeButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
});
