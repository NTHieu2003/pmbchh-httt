import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

const EXPANDED_WIDTH = 340;
const COLLAPSED_WIDTH = 52;

export const createFormSidebarStyles = (isCollapsed: boolean) =>
  StyleSheet.create({
    container: {
      width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
      backgroundColor: APP_COLORS.chatSidebarBg,
      borderRightWidth: 1,
      borderRightColor: APP_COLORS.chatBorder,
      position: isCollapsed ? 'relative' : undefined,
    },
    collapsedHeader: {
      alignItems: 'center',
      paddingVertical: APP_SPACING.sm,
      gap: APP_SPACING.xs,
    },
    collapsedIconButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export const formSidebarStyles = StyleSheet.create({
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
  headerIconButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: APP_SPACING.sm,
    // Extra bottom room so the very last field (e.g. "Thời gian (s)" in the
    // scenario card) can still scroll clear of the keyboard — with no
    // padding there's nothing left to scroll past once you're near the end
    // of the content, so the keyboard covers it no matter how big
    // `extraHeight` is.
    paddingBottom: APP_SPACING.xxl * 3,
    gap: APP_SPACING.sm,
  },
  runButton: {
    marginTop: APP_SPACING.sm,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: APP_SPACING.xxs,
  },
  runButtonDisabled: {
    backgroundColor: APP_COLORS.primaryDisabled,
  },
  runButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
});
