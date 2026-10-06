import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const map2DViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  captureArea: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: APP_COLORS.chatSidebarBg,
  },
  domainCard: {
    position: 'absolute',
    left: APP_SPACING.sm,
    bottom: APP_SPACING.sm,
    maxWidth: 230,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: '#0284c7',
    borderRadius: Radius.md,
    padding: APP_SPACING.sm,
  },
  domainCardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: APP_SPACING.xs,
  },
  domainCardTitle: {
    flex: 1,
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  domainCardArea: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284c7',
    marginTop: 2,
  },
  domainCardLine: {
    fontSize: 10,
    color: APP_COLORS.chatSubtitle,
    marginTop: 2,
  },
  domainCardActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: APP_SPACING.xxs,
  },
  domainCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#0284c7',
  },
  domainCardButtonText: {
    fontSize: 9,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  responseCard: {
    position: 'absolute',
    right: APP_SPACING.sm,
    top: APP_SPACING.sm,
    maxWidth: 220,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: '#ea580c',
    borderRadius: Radius.md,
    padding: APP_SPACING.sm,
  },
  responseCardTitle: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: '#ea580c',
  },
  responseCardLine: {
    fontSize: 10,
    color: APP_COLORS.textPrimary,
    marginTop: 2,
  },
  responseCardButton: {
    marginTop: APP_SPACING.xxs,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#ea580c',
  },
  responseCardButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.xl,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    textAlign: 'center',
  },
});
