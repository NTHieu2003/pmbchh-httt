import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

const LIST_WIDTH = 300;

export const historyListStyles = StyleSheet.create({
  container: {
    width: LIST_WIDTH,
    backgroundColor: APP_COLORS.chatSidebarBg,
    borderRightWidth: 1,
    borderRightColor: APP_COLORS.chatBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  headerTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
    marginTop: APP_SPACING.sm,
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
  convRowActive: {
    backgroundColor: APP_COLORS.chatSidebarSoftBg,
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
