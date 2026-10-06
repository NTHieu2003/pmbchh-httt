import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const cbrnScenarioListItemStyles = StyleSheet.create({
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
  // 90/10 split — info left, status badge right (same ratio as "Lĩnh vực
  // Chatbot").
  left: {
    flex: 0.78,
    gap: APP_SPACING.xs,
  },
  right: {
    flex: 0.22,
    alignItems: 'flex-start',
    gap: APP_SPACING.xxs,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: APP_SPACING.xs,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  attachButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: APP_COLORS.primary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
  },
  // Primary content — bold, same style role as "linhVuc" on the Lĩnh vực
  // Chatbot screen.
  title: {
    flexShrink: 1,
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  fileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 1,
  },
  fileText: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatIconMuted,
    flexShrink: 1,
  },
  // Secondary metadata — muted, same style role as "nganh" there.
  meta: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
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
