import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const meetingRoomScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: APP_SPACING.sm,
  },
  loadingText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.sm,
    backgroundColor: APP_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  // 3-panel row — matches pmbc_mobile's Tiến trình cuộc họp (STT) / Slide
  // trình chiếu / Người tham gia card row exactly (same panel count, order
  // and titles); each panel here is its own bordered white box instead of
  // react-native-paper's <Card>, matching this app's own modal/list styling.
  body: {
    flex: 1,
    flexDirection: 'row',
    gap: APP_SPACING.xs,
    padding: APP_SPACING.xs,
  },
  columnTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
  },
  sttColumn: {
    flex: 1,
    backgroundColor: APP_COLORS.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    overflow: 'hidden',
  },
  sttEmptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.lg,
  },
  slideColumn: {
    flex: 2,
    backgroundColor: APP_COLORS.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    overflow: 'hidden',
  },
  slideBox: {
    flex: 1,
  },
  participantColumn: {
    flex: 1.1,
    backgroundColor: APP_COLORS.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  // Collapsible section headers — same role as pmbc_mobile's
  // <List.Accordion> (react-native-paper, not installed in v2), rebuilt
  // with a plain toggle + chevron.
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.sm,
    margin: APP_SPACING.xxs,
  },
  accordionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  // "Mic chung" / "Mic riêng" switch — matches pmbc_web's ds-user
  // `.button-mic`/`.button-mic-hightlight` (#dfe6fa bg, #3f6ad8 border),
  // only shown to trợ lý (`*ngIf="isTroLy"` on web).
  micTypeSwitch: {
    flexDirection: 'row',
    marginHorizontal: APP_SPACING.xxs,
    marginBottom: APP_SPACING.xxs,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  micTypeButton: {
    flex: 1,
    paddingVertical: APP_SPACING.xs,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  micTypeButtonActive: {
    backgroundColor: '#dfe6fa',
    borderBottomColor: APP_COLORS.primary,
  },
  micTypeButtonText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  micTypeButtonTextActive: {
    color: APP_COLORS.primary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
    marginHorizontal: APP_SPACING.xxs,
    marginBottom: APP_SPACING.xxs,
    paddingHorizontal: APP_SPACING.sm,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: APP_COLORS.background,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
    padding: 0,
  },
  participantList: {
    maxHeight: 220,
  },
  emptyText: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatIconMuted,
    fontStyle: 'italic',
    paddingHorizontal: APP_SPACING.sm,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
    backgroundColor: APP_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.chatBorder,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  actionButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  actionBarSpacer: {
    flex: 1,
  },
  // Chapter/page nav — matches pmbc_mobile's backward/previous/next/forward
  // ButtonTooltip row (chủ trì/trợ lý only).
  navGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xxs,
  },
  navButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  viewSettingsWrapper: {
    position: 'relative',
  },
  // Dropdown panel for the "TT xem" button — opens upward since the button
  // sits at the very bottom of the screen (matches pmbc_mobile's Menu
  // anchored to the same button, react-native-paper/Menu not installed
  // in v2 so this is a plain absolute-positioned card instead).
  viewSettingsMenu: {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    marginBottom: APP_SPACING.xxs,
    minWidth: 180,
    backgroundColor: APP_COLORS.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    paddingVertical: APP_SPACING.xxs,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
  },
  viewSettingsItem: {
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
  },
  viewSettingsItemText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
  // Floating re-show button — only needed when "Ẩn thanh cài đặt" hid the
  // whole action bar, otherwise the "TT xem" menu that hides it would be
  // unreachable again.
  showActionBarButton: {
    position: 'absolute',
    right: APP_SPACING.sm,
    bottom: APP_SPACING.sm,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: APP_COLORS.navy,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.md,
    backgroundColor: APP_COLORS.chatBrandRed,
  },
  exitButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
});
