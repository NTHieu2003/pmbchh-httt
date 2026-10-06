import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 52;

export const createLeftSidebarStyles = (isCollapsed: boolean) =>
  StyleSheet.create({
    container: {
      width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
      backgroundColor: APP_COLORS.chatSidebarBg,
      borderRightWidth: 1,
      borderRightColor: APP_COLORS.chatBorder,
    },
    collapsedContent: {
      alignItems: 'center',
      paddingVertical: APP_SPACING.sm,
      gap: APP_SPACING.sm,
    },
    collapsedLogoButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: APP_SPACING.xs,
    },
    collapsedLogo: {
      width: 32,
      height: 32,
    },
    collapsedIconButton: {
      width: 36,
      height: 36,
      borderRadius: Radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    collapsedNewChatButton: {
      backgroundColor: APP_COLORS.chatBrandRed,
    },
    collapsedMessageButton: {
      backgroundColor: APP_COLORS.chatSidebarSoftBg,
    },
  });

export const leftSidebarStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  logo: {
    width: 32,
    height: 32,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: APP_SPACING.sm,
    paddingBottom: APP_SPACING.xl,
  },
  newConversationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: APP_SPACING.xs,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: APP_COLORS.chatBrandRed,
    margin: APP_SPACING.sm,
  },
  newConversationText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
    marginTop: APP_SPACING.lg,
    paddingVertical: APP_SPACING.xxs,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  sectionBody: {
    marginTop: APP_SPACING.xxs,
  },
  emptyText: {
    fontSize: FontSize.sm,
    fontStyle: 'italic',
    color: APP_COLORS.chatIconMuted,
    marginTop: APP_SPACING.sm,
  },
  loadingRow: {
    paddingVertical: APP_SPACING.sm,
    alignItems: 'flex-start',
  },
  convRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: APP_SPACING.xs,
    paddingHorizontal: APP_SPACING.xxs,
    borderRadius: Radius.sm,
  },
  convRowPinIcon: {
    marginRight: APP_SPACING.xxs,
  },
  convRowTextWrap: {
    flex: 1,
  },
  convRowTitle: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
  convRowTime: {
    fontSize: 10,
    color: APP_COLORS.chatIconMuted,
    marginTop: 1,
  },
  convRowMenuButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
