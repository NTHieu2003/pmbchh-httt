import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

// Body-only styles — the dialog shell (backdrop, card, header, footer,
// keyboard avoidance) comes from AppModal.
export const meetingRoomCreateSpeechModalStyles = StyleSheet.create({
  // Merged into AppModal's body content container (keeps its padding).
  body: {
    paddingTop: APP_SPACING.sm,
    gap: APP_SPACING.xxs,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: APP_SPACING.sm,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.md,
    backgroundColor: '#f8fafc',
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  filePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.md,
    backgroundColor: '#f8fafc',
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.sm,
  },
  filePickerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
});
