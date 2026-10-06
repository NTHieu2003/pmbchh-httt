import { useCallback, useEffect, useState } from 'react';

import { ChatbotApi } from '@/api/chatbot';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuthStore } from '@/stores';

import type { ConversationSearchFilter, ConversationSummary } from '@/types';

interface SectionState {
  items: ConversationSummary[];
  loading: boolean;
}

const emptySection: SectionState = { items: [], loading: false };

export interface UseLeftSidebarResult {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isSearchOpen: boolean;
  toggleSearch: () => void;
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  isStarredExpanded: boolean;
  toggleStarredExpanded: () => void;
  starredSection: SectionState;
  isRecentExpanded: boolean;
  toggleRecentExpanded: () => void;
  recentSection: SectionState;
  togglePin: (item: ConversationSummary) => void;
  toggleStar: (item: ConversationSummary) => void;
  deleteConversation: (item: ConversationSummary) => void;
}

const SECTION_PAGE_SIZE = 10;

// Mirrors pmbc_web's chatbot.component.ts sidebar-history logic
// (sections.recent/starred + reloadAllSections + searchInput$ debounce +
// togglePin/toggleStar/deleteConversation), scoped to a single page per
// section — no infinite-scroll pagination yet, same as right sidebar not
// needing it for its 10-item list.
//
// `refreshSignal` (optional): bump this from the parent (chat's
// `historyVersion`) whenever a conversation was just persisted server-side
// — added to the reload effect's deps so "GẦN ĐÂY" picks up a brand-new or
// just-updated conversation right after a send, without a manual refresh.
export const useLeftSidebar = (refreshSignal?: number): UseLeftSidebarResult => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      if (prev) setSearchKeyword('');
      return !prev;
    });
  };

  const [isStarredExpanded, setIsStarredExpanded] = useState(false);
  const [isRecentExpanded, setIsRecentExpanded] = useState(true);
  const toggleStarredExpanded = () => setIsStarredExpanded((prev) => !prev);
  const toggleRecentExpanded = () => setIsRecentExpanded((prev) => !prev);

  const [starredSection, setStarredSection] =
    useState<SectionState>(emptySection);
  const [recentSection, setRecentSection] =
    useState<SectionState>(emptySection);

  const userId = useAuthStore((state) => state.userId);

  const loadSection = useCallback(
    (filter: ConversationSearchFilter, keyword: string, uid: number) => {
      const setSection =
        filter === 'starred' ? setStarredSection : setRecentSection;
      setSection((prev) => ({ ...prev, loading: true }));
      ChatbotApi.searchConversations(uid, {
        key: keyword.trim() || undefined,
        filter,
        page: 0,
        size: SECTION_PAGE_SIZE,
      })
        .then((res) => setSection({ items: res.items, loading: false }))
        .catch(() => setSection({ items: [], loading: false }));
    },
    []
  );

  // 300ms debounce matches web's `searchInput$.pipe(debounceTime(300))`.
  const debouncedSearchKeyword = useDebounce(searchKeyword, 300);

  useEffect(() => {
    if (!userId) {
      setStarredSection(emptySection);
      setRecentSection(emptySection);
      return;
    }
    loadSection('starred', debouncedSearchKeyword, userId);
    loadSection('recent', debouncedSearchKeyword, userId);
  }, [userId, debouncedSearchKeyword, loadSection, refreshSignal]);

  const reloadAllSections = useCallback(() => {
    if (!userId) return;
    loadSection('starred', debouncedSearchKeyword, userId);
    loadSection('recent', debouncedSearchKeyword, userId);
  }, [userId, debouncedSearchKeyword, loadSection]);

  // Matches web's togglePin/toggleStar: optimistic flip, reload both
  // sections on success (item jumps between pinned/starred/recent),
  // revert-by-reload on failure.
  const togglePin = useCallback(
    (item: ConversationSummary) => {
      if (!userId) return;
      const newVal = !item.isPinned;
      ChatbotApi.pinConversation(item.id, userId, newVal)
        .then(() => reloadAllSections())
        .catch(() => reloadAllSections());
    },
    [userId, reloadAllSections]
  );

  const toggleStar = useCallback(
    (item: ConversationSummary) => {
      if (!userId) return;
      const newVal = !item.isStarred;
      ChatbotApi.starConversation(item.id, userId, newVal)
        .then(() => reloadAllSections())
        .catch(() => reloadAllSections());
    },
    [userId, reloadAllSections]
  );

  const deleteConversation = useCallback(
    (item: ConversationSummary) => {
      if (!userId) return;
      // Optimistic removal from both sections, matches web.
      setStarredSection((prev) => ({
        ...prev,
        items: prev.items.filter((c) => c.id !== item.id),
      }));
      setRecentSection((prev) => ({
        ...prev,
        items: prev.items.filter((c) => c.id !== item.id),
      }));
      ChatbotApi.deleteConversation(item.id, userId).catch(() => reloadAllSections());
    },
    [userId, reloadAllSections]
  );

  return {
    isCollapsed,
    toggleCollapse,
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
  };
};
