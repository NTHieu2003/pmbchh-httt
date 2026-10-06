import { StyleSheet } from 'react-native';

import { APP_COLORS } from '@/theme';
import { APP_SPACING, FontSize, Radius } from '@/utils';

export const unitDetailModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: APP_SPACING.xl,
  },
  card: {
    width: '90%',
    maxWidth: 900,
    height: '82%',
    maxHeight: 640,
    backgroundColor: APP_COLORS.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    backgroundColor: APP_COLORS.navy,
  },
  headerTextWrap: {
    flex: 1,
    marginRight: APP_SPACING.sm,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: APP_COLORS.white,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: APP_COLORS.overlayText,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: APP_SPACING.xs,
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  statChip: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
    backgroundColor: APP_COLORS.chatSidebarBg,
    borderRadius: Radius.sm,
    paddingHorizontal: APP_SPACING.xs,
    paddingVertical: 4,
  },
  statChipBold: {
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  statChipSuccess: {
    backgroundColor: '#dcfce7',
  },
  body: {
    flex: 1,
    paddingHorizontal: APP_SPACING.md,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: APP_COLORS.chatSubtitle,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: APP_SPACING.xl,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SPACING.sm,
    paddingVertical: APP_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.chatBorder,
  },
  docIndex: {
    width: 24,
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
    textAlign: 'center',
  },
  docInfo: {
    flex: 1,
  },
  docTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  docMeta: {
    fontSize: FontSize.xs,
    color: APP_COLORS.chatSubtitle,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: APP_SPACING.xs,
    paddingVertical: 4,
    borderRadius: Radius.xl,
    backgroundColor: '#f1f5f9',
  },
  statusPillValid: {
    backgroundColor: '#dcfce7',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
  closeButton: {
    margin: APP_SPACING.md,
    alignSelf: 'flex-end',
    paddingHorizontal: APP_SPACING.md,
    paddingVertical: APP_SPACING.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
  },
  closeButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: APP_COLORS.textPrimary,
  },
});
