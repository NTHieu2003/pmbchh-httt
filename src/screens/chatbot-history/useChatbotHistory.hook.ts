import { useCallback, useMemo, useState } from 'react';

import { ChatbotApi } from '@/api/chatbot';
import { useAuthStore } from '@/stores';

import { useLeftSidebar } from '../chatbot/leftSidebar';

import type { ChatListItem, ConversationSummary } from '@/types';

const MSG_PAGE_SIZE = 20;

let localMessageIdCounter = 0;
const nextLocalMessageId = () => `hist-msg-${Date.now()}-${localMessageIdCounter++}`;

export interface UseChatbotHistoryResult {
  isSearchOpen: boolean;
  toggleSearch: () => void;
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  isStarredExpanded: boolean;
  toggleStarredExpanded: () => void;
  starredItems: ConversationSummary[];
  isStarredLoading: boolean;
  isRecentExpanded: boolean;
  toggleRecentExpanded: () => void;
  recentItems: ConversationSummary[];
  isRecentLoading: boolean;
  togglePin: (item: ConversationSummary) => void;
  toggleStar: (item: ConversationSummary) => void;
  deleteConversation: (item: ConversationSummary) => void;
  // "Ẩn" action — persists via POST /chatbot/conversations/status
  // ({ id, status: false }). `starredItems`/`recentItems` only include
  // status===true rows; `hiddenItems` (status===false) backs the header's
  // "view hidden" popover; `unhideConversation` restores one at a time
  // (status: true).
  hideConversation: (item: ConversationSummary) => void;
  unhideConversation: (item: ConversationSummary) => void;
  hiddenItems: ConversationSummary[];

  selectedConversationId: string | null;
  selectedTitle: string;
  messages: ChatListItem[];
  isLoadingMessages: boolean;
  selectConversation: (item: ConversationSummary) => void;
}

// Reuses the chatbot screen's own left-sidebar data logic (search, sections,
// pin/star/delete) via `useLeftSidebar` — same backing API, same behavior.
// `searchConversations` returns conversations regardless of `status`, so
// show/hide is purely a client-side split of that same section data by
// `status` (true → visible sections, false → the "view hidden" popover) —
// no separate list-hidden endpoint needed. A local `statusOverrides` map
// gives instant feedback on hide/unhide without waiting on a refetch.
export const useChatbotHistory = (): UseChatbotHistoryResult => {
  const {
    isSearchOpen,
    toggleSearch,
    searchKeyword,
    setSearchKeyword,
    isStarredExpanded,
    toggleStarredExpanded,
    starredSection,
    isRecentExpanded,
    toggleRecentExpanded,
    recentSection,
    togglePin,
    toggleStar,
    deleteConversation,
  } = useLeftSidebar();

  const userId = useAuthStore((state) => state.userId);

  const [statusOverrides, setStatusOverrides] = useState<Record<string, boolean>>({});
  const isVisible = useCallback(
    (item: ConversationSummary) => statusOverrides[item.id] ?? item.status !== false,
    [statusOverrides]
  );

  const hideConversation = useCallback((item: ConversationSummary) => {
    ChatbotApi.updateConversationStatus(item.id, false).catch(() => {});
    setStatusOverrides((prev) => ({ ...prev, [item.id]: false }));
  }, []);

  const unhideConversation = useCallback((item: ConversationSummary) => {
    ChatbotApi.updateConversationStatus(item.id, true).catch(() => {});
    setStatusOverrides((prev) => ({ ...prev, [item.id]: true }));
  }, []);

  const starredItems = useMemo(
    () => starredSection.items.filter(isVisible),
    [starredSection.items, isVisible]
  );
  const recentItems = useMemo(
    () => recentSection.items.filter(isVisible),
    [recentSection.items, isVisible]
  );

  // Union of both sections (a conversation can appear in both), deduped by
  // id, filtered down to the hidden ones — the source for the header's
  // "view hidden" popover.
  const hiddenItems = useMemo(() => {
    const byId = new Map<string, ConversationSummary>();
    for (const item of [...starredSection.items, ...recentSection.items]) {
      if (!isVisible(item)) byId.set(item.id, item);
    }
    return Array.from(byId.values());
  }, [starredSection.items, recentSection.items, isVisible]);

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [messages, setMessages] = useState<ChatListItem[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const selectConversation = useCallback(
    (item: ConversationSummary) => {
      if (!userId) return;
      setSelectedConversationId(item.id);
      setSelectedTitle(item.title || '(không tiêu đề)');
      setIsLoadingMessages(true);
      setMessages([]);

      ChatbotApi.getMessagesPage(item.id, userId, -1, MSG_PAGE_SIZE)
        .then((page) => {
          setSelectedTitle(page.title || item.title || '(không tiêu đề)');
          setMessages(
            (page.messages ?? []).filter(Boolean).map((m) => ({
              id: m?.id || nextLocalMessageId(),
              message: { role: m?.role ?? 'assistant', content: m?.content ?? '' },
            }))
          );
        })
        .catch(() => setMessages([]))
        .finally(() => setIsLoadingMessages(false));
    },
    [userId]
  );

  return {
    isSearchOpen,
    toggleSearch,
    searchKeyword,
    setSearchKeyword,
    isStarredExpanded,
    toggleStarredExpanded,
    starredItems,
    isStarredLoading: starredSection.loading,
    isRecentExpanded,
    toggleRecentExpanded,
    recentItems,
    isRecentLoading: recentSection.loading,
    togglePin,
    toggleStar,
    deleteConversation,
    hideConversation,
    unhideConversation,
    hiddenItems,
    selectedConversationId,
    selectedTitle,
    messages,
    isLoadingMessages,
    selectConversation,
  };
};
