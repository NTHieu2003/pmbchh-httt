import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const domainFieldListItemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.lg,
    paddingVertical: APP_SPACING.sm + APP_SPACING.xxs,
    paddingHorizontal: APP_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
    backgroundColor: APP_COLORS.surface,
  },
  left: {
    flex: 0.9,
    gap: APP_SPACING.xs,
  },
  right: {
    flex: 0.15,
    alignItems: 'flex-start',
  },
  nganh: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    marginBottom: 2,
  },
  linhVuc: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    marginBottom: 2,
  },
  moTa: {
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * 1.4,
    fontStyle: 'italic',
    color: APP_COLORS.chatIconMuted,
  },
  statusBadge: {
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xxs,
    borderRadius: Radius.xl,
    flexShrink: 0,
  },
  statusActive: {
    backgroundColor: '#dcfce7',
  },
  statusInactive: {
    backgroundColor: '#f1f5f9',
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  statusTextActive: {
    color: '#16a34a',
  },
  statusTextInactive: {
    color: APP_COLORS.chatSubtitle,
  },
});
