import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, CONTENT_MAX_WIDTH, FontSize, Radius } from '@/utils';

export const createLoginStyles = (isTablet: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: APP_COLORS.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      padding: APP_SPACING.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      flexDirection: isTablet ? 'row' : 'column',
      width: '100%',
      maxWidth: CONTENT_MAX_WIDTH,
      backgroundColor: APP_COLORS.surface,
      borderRadius: Radius.lg,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    leftPanel: {
      flex: isTablet ? 1 : undefined,
      minHeight: isTablet ? undefined : 200,
      position: 'relative',
      padding: APP_SPACING.lg,
      
    },
    leftPanelBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    leftPanelTitleBlock: {
      marginTop: APP_SPACING.xs,
    },
    leftPanelTitle: {
      fontSize: FontSize.xl,
      fontWeight: 'bold',
      color: APP_COLORS.accent,
      letterSpacing: 0.5,
    },
    leftPanelSubtitle: {
      fontSize: FontSize.sm,
      color: APP_COLORS.overlayText,
      marginTop: APP_SPACING.xs,
      lineHeight: FontSize.sm * 1.5,
    },
    leftPanelTitleUnderline: {
      width: 80,
      height: 3,
      backgroundColor: APP_COLORS.accent,
      borderRadius: 2,
      marginTop: APP_SPACING.md,
    },
    supportBlock: {
      marginTop: APP_SPACING.lg,
    },
    supportSection: {
      paddingVertical: APP_SPACING.sm,
    },
    supportRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: APP_SPACING.sm,
    },
    supportRowIndented: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: APP_SPACING.sm,
      marginTop: APP_SPACING.sm,
      marginLeft: APP_SPACING.lg,
    },
    supportHeading: {
      fontWeight: 'bold',
      fontSize: FontSize.md,
      color: APP_COLORS.danger,
    },
    supportText: {
      color: APP_COLORS.white,
      fontSize: FontSize.xs,
      fontWeight: '600',
    },
    chromeBadgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: APP_SPACING.xs,
      marginTop: APP_SPACING.sm,
      marginLeft: APP_SPACING.lg,
    },
    chromeBadge: {
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.4)',
      borderRadius: Radius.sm,
      paddingHorizontal: APP_SPACING.sm,
      paddingVertical: APP_SPACING.xxxs,
    },
    chromeBadgeText: {
      color: APP_COLORS.white,
      fontSize: FontSize.xs,
    },
    rightPanel: {
      flex: 1,
      backgroundColor: APP_COLORS.surface,
      padding: isTablet ? APP_SPACING.xxl : APP_SPACING.lg,
      justifyContent: 'center',
    },
    logoImage: {
      alignSelf: 'center',
      width: isTablet ? 96 : 72,
      height: isTablet ? 96 : 72,
      marginBottom: APP_SPACING.md,
    },
    title: {
      fontSize: FontSize.xl,
      fontWeight: 'bold',
      textAlign: 'center',
      color: APP_COLORS.danger,
      marginBottom: APP_SPACING.lg,
    },
    inputContainer: {
      gap: APP_SPACING.md,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: APP_COLORS.border,
      borderRadius: Radius.sm,
      paddingHorizontal: APP_SPACING.sm,
      height: APP_SPACING.height44,
    },
    inputIcon: {
      marginRight: APP_SPACING.xs,
    },
    input: {
      flex: 1,
      color: APP_COLORS.textPrimary,
      fontSize: FontSize.md,
    },
    loginButton: {
      marginTop: APP_SPACING.lg,
      paddingVertical: APP_SPACING.sm,
      borderRadius: Radius.sm,
      backgroundColor: APP_COLORS.primary,
      alignItems: 'center',
    },
    disabledButton: {
      backgroundColor: APP_COLORS.primaryDisabled,
      opacity: 0.7,
    },
    buttonText: {
      color: APP_COLORS.white,
      fontWeight: '600',
      fontSize: FontSize.md,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: APP_SPACING.xxxs,
      backgroundColor: APP_COLORS.footer,
    },
    footerText: {
      color: APP_COLORS.white,
      fontSize: 10,
      fontWeight: '500',
      textTransform: 'uppercase',
    },
  });
