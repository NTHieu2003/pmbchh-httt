import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize } from '@/utils';

export type AppModalTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

// Icon-chip / dialog-icon colors per tone: `soft` = chip background,
// `strong` = icon + accent. Status tones (success/warning/danger) are
// reserved for state, never decoration.
export const MODAL_TONES: Record<AppModalTone, { soft: string; strong: string }> = {
  primary: { soft: '#e8eefc', strong: APP_COLORS.primary },
  success: { soft: '#dcfce7', strong: '#16a34a' },
  warning: { soft: '#fef3c7', strong: '#d97706' },
  danger: { soft: '#fee2e2', strong: '#dc2626' },
  neutral: { soft: '#f1f5f9', strong: '#475569' },
};

export const MODAL_RADIUS = 20;

export const appModalStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  backdropPressable: {
    flex: 1,
  },
  centerer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.lg,
  },
  card: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: MODAL_RADIUS,
    overflow: 'hidden',
    elevation: 24,
    shadowColor: '#0f172a',
    shadowOpacity: 0.25,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 16 },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.lg,
    paddingTop: APP_SPACING.lg,
    paddingBottom: APP_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#eef0f3',
  },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBox: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  bodyContent: {
    padding: APP_SPACING.lg,
  },
  bodyFill: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    paddingHorizontal: APP_SPACING.lg,
    paddingVertical: APP_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#eef0f3',
    backgroundColor: '#fafbfc',
  },
});
