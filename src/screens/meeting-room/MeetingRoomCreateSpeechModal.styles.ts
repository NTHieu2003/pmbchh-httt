import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const meetingRoomCreateSpeechModalStyles = StyleSheet.create({
  keyboardAvoider: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.xl,
  },
  card: {
    width: '70%',
    maxWidth: 560,
    maxHeight: '85%',
    backgroundColor: APP_COLORS.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    backgroundColor: APP_COLORS.navy,
  },
  title: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  bodyScroll: {
    flexGrow: 0,
  },
  body: {
    paddingHorizontal: APP_SPACING.md,
    paddingTop: APP_SPACING.sm,
    paddingBottom: APP_SPACING.md,
    gap: APP_SPACING.xxs,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: APP_COLORS.chatSubtitle,
    marginTop: APP_SPACING.sm,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.md,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.xs,
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  filePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.xs,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.md,
    paddingHorizontal: APP_SPACING.sm,
    paddingVertical: APP_SPACING.sm,
  },
  filePickerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: APP_COLORS.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.chatBorder,
  },
  cancelButton: {
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  cancelButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  submitButton: {
    minWidth: 72,
    alignItems: 'center',
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.md,
    backgroundColor: APP_COLORS.primary,
  },
  submitButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
});
