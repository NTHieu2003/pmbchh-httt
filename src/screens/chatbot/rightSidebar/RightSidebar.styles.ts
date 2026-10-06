import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize } from '@/utils';

const EXPANDED_WIDTH = 280;
const COLLAPSED_WIDTH = 52;

export const createRightSidebarStyles = (isCollapsed: boolean) =>
  StyleSheet.create({
    container: {
      width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
      backgroundColor: APP_COLORS.chatSidebarBg,
      borderLeftWidth: 1,
      borderLeftColor: APP_COLORS.chatBorder,
      position: isCollapsed ? 'relative' : undefined,
    },
    collapsedHeader: {
      alignItems: 'center',
      paddingVertical: APP_SPACING.sm,
    },
    collapsedIconButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    expandButton: {
      position: 'absolute',
      left: -18,
      top: '50%',
      marginTop: -18,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: APP_COLORS.chatBrandRed,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
  });

export const rightSidebarStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: APP_SPACING.sm,
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
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    letterSpacing: 0.5,
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
  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
  },
  selectionText: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
  },
  selectionCount: {
    fontWeight: '700',
    color: APP_COLORS.chatBrandRed,
  },
  selectionActions: {
    flexDirection: 'row',
    gap: APP_SPACING.sm,
  },
  selectionActionText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.primary,
  },
});
