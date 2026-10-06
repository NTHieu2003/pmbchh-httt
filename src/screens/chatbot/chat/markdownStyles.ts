import { APP_COLORS } from '@/theme';
import { FontSize, Radius } from '@/utils';

// Style map for `react-native-markdown-display` — keys match its block/inline
// node types (see its README). Mirrors pmbc_web's `.markdown-content` look
// closely enough for the assistant bubble; the elaborate citation-pill HTML
// injection from web's `chatContentConvert` is NOT replicated here — plain
// markdown links (`[[1]](url)`) just render as normal tappable links.
export const chatMarkdownStyles = {
  body: {
    fontSize: FontSize.md,
    lineHeight: 22,
    color: APP_COLORS.textPrimary,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },
  heading1: {
    fontSize: FontSize.xl,
    fontWeight: '700' as const,
    marginTop: 8,
    marginBottom: 6,
  },
  heading2: {
    fontSize: FontSize.lg,
    fontWeight: '700' as const,
    marginTop: 8,
    marginBottom: 6,
  },
  heading3: {
    fontSize: FontSize.md,
    fontWeight: '700' as const,
    marginTop: 6,
    marginBottom: 4,
  },
  strong: {
    fontWeight: '700' as const,
  },
  em: {
    fontStyle: 'italic' as const,
  },
  link: {
    color: APP_COLORS.primary,
    textDecorationLine: 'underline' as const,
  },
  bullet_list: {
    marginBottom: 6,
  },
  ordered_list: {
    marginBottom: 6,
  },
  list_item: {
    marginBottom: 2,
  },
  code_inline: {
    fontFamily: 'monospace',
    backgroundColor: APP_COLORS.chatSidebarBg,
    borderRadius: Radius.sm,
    paddingHorizontal: 4,
  },
  code_block: {
    fontFamily: 'monospace',
    backgroundColor: APP_COLORS.chatSidebarBg,
    borderRadius: Radius.md,
    padding: 8,
  },
  fence: {
    fontFamily: 'monospace',
    backgroundColor: APP_COLORS.chatSidebarBg,
    borderRadius: Radius.md,
    padding: 8,
  },
  blockquote: {
    backgroundColor: APP_COLORS.chatSidebarBg,
    borderLeftWidth: 3,
    borderLeftColor: APP_COLORS.chatBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  hr: {
    backgroundColor: APP_COLORS.chatBorder,
    height: 1,
  },
  table: {
    borderWidth: 1,
    borderColor: APP_COLORS.chatBorder,
    borderRadius: Radius.sm,
  },
  th: {
    fontWeight: '700' as const,
    padding: 6,
  },
  td: {
    padding: 6,
  },
};
