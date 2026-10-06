// Palette lifted from project B's login screen so the first screen in C
// looks identical, just re-expressed as named tokens instead of inline hex.
export const APP_COLORS = {
  background: '#eef1f5',
  surface: '#ffffff',
  navy: '#0d1b3d',
  primary: '#3f6ad8',
  primaryDisabled: '#93c5fd',
  accent: '#e8492b',
  danger: '#d7002e',
  textPrimary: '#111827',
  textMuted: '#9ca3af',
  border: '#d1d5db',
  overlayText: '#e5e7eb',
  footer: '#4c4c4c',
  white: '#ffffff',

  // Sampled directly from the desktop "home" (AI chatbot) reference mock,
  // pixel-picked so the mobile Home screen matches it exactly.
  chatBrandRed: '#f9434a',
  chatSubtitle: '#6c6c6c',
  chatBorder: '#e3e3e3',
  chatIconMuted: '#8b8b8b',
  chatSidebarBg: '#f9f9f9',
  chatSidebarSoftBg: '#f7e9e8',
  chatMessageBubble: '#f1f5f9',
  chatAmber: '#e9a23b',
  chatAmberBg: '#fcf4cc',
  chatSuggestionRowBg: '#f9fafc',
} as const;
