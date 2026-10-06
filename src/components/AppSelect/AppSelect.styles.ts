import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const appSelectStyles = StyleSheet.create({
  inputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: APP_SPACING.height32,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.sm,
    paddingHorizontal: APP_SPACING.sm,
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
    backgroundColor: APP_COLORS.chatSidebarBg,
  },
  // Extra right padding so typed/selected text never runs under the clear button.
  inputWithClear: {
    paddingRight: APP_SPACING.height32,
  },
  clearButton: {
    position: 'absolute',
    right: APP_SPACING.xs,
    top: 0,
    bottom: 0,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    marginTop: APP_SPACING.xs,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.sm,
    backgroundColor: APP_COLORS.white,
    overflow: 'hidden',
  },
  // `mode="overlay"` — floats over sibling content instead of pushing it
  // down (absolutely positioned, same left/right edges as the input).
  dropdownOverlay: {
    position: 'absolute',
    top: APP_SPACING.height32 + APP_SPACING.xs,
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  dropdownLoading: {
    paddingVertical: APP_SPACING.md,
    alignItems: 'center',
  },
  dropdownEmpty: {
    padding: APP_SPACING.sm,
    fontSize: FontSize.xs,
    color: APP_COLORS.chatIconMuted,
    fontStyle: 'italic',
  },
  dropdownItem: {
    height: APP_SPACING.height44,
    justifyContent: 'center',
    paddingHorizontal: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  dropdownItemLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  dropdownItemSubLabel: {
    fontSize: 11,
    color: APP_COLORS.chatIconMuted,
    marginTop: 1,
  },
});
