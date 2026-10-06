import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const createChatbotStyles = (isTablet: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: APP_COLORS.surface,
    },
    row: {
      flex: 1,
      flexDirection: 'row',
    },
    // --- middle column ---
    middleScroll: {
      flex: 1,
    },
    middleScrollContent: {
      flexGrow: 1,
      alignItems: 'center',
      padding: APP_SPACING.lg,
    },
    // `minHeight` is set inline (measured viewport height) — centers
    // short content, grows (and stops centering) once content overflows,
    // so the surrounding ScrollView always scrolls correctly.
    centerWrapper: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    middleContent: {
      width: '100%',
      maxWidth: 640,
      alignItems: 'center',
    },
    logo: {
      width: isTablet ? 84 : 68,
      height: isTablet ? 103 : 84,
      marginBottom: APP_SPACING.md,
    },
    greeting: {
      fontSize: isTablet ? FontSize.displayXS : FontSize.xl,
      fontWeight: 'bold',
      color: APP_COLORS.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: FontSize.md,
      color: APP_COLORS.chatSubtitle,
      marginTop: APP_SPACING.xs,
      textAlign: 'center',
    },
    composerGreetingSpacing: {
      width: '100%',
      marginTop: APP_SPACING.xxl,
    },
    composer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
      borderWidth: 1,
      borderColor: APP_COLORS.chatBorder,
      borderRadius: Radius.lg * 3,
      paddingLeft: APP_SPACING.xs,
      paddingRight: APP_SPACING.xxxs,
      paddingVertical: APP_SPACING.xxxs,
      gap: APP_SPACING.xs,
    },
    composerAddButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: APP_COLORS.chatBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    composerInput: {
      flex: 1,
      fontSize: FontSize.md,
      color: APP_COLORS.textPrimary,
      paddingVertical: APP_SPACING.sm,
    },
    composerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: APP_SPACING.sm,
      paddingRight: APP_SPACING.xxxs,
    },
    composerIconButton: {
      width: 32,
      height: 32,
      borderRadius: Radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    composerIconButtonActive: {
      backgroundColor: APP_COLORS.chatAmberBg,
    },
    composerSendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: APP_COLORS.chatBrandRed,
      alignItems: 'center',
      justifyContent: 'center',
    },
    // --- chat mode (once the conversation has messages) ---
    chatColumn: {
      flex: 1,
    },
    composerDocked: {
      width: '100%',
      maxWidth: 640,
      alignSelf: 'center',
      paddingHorizontal: APP_SPACING.lg,
      paddingBottom: APP_SPACING.lg,
    },
    stopButtonRow: {
      alignItems: 'center',
      paddingVertical: APP_SPACING.xxs,
    },
    stopButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: APP_SPACING.xxs,
      paddingHorizontal: APP_SPACING.sm,
      paddingVertical: APP_SPACING.xxs,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: APP_COLORS.chatBorder,
      backgroundColor: APP_COLORS.white,
    },
    stopButtonText: {
      fontSize: FontSize.xs,
      fontWeight: '600',
      color: APP_COLORS.chatBrandRed,
    },
  });
