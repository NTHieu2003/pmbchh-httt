import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  EyeOff,
  MoreVertical,
  Search,
  Star,
  Trash2,
} from 'lucide-react-native';
import type { GestureResponderEvent } from 'react-native';

import { AppPopover, type AppPopoverAnchor, type AppPopoverItem } from '@/components/AppPopover';
import { APP_COLORS } from '@/theme';

import { SidebarSearchBox } from '../chatbot/components';
import { formatRelativeTime } from '../chatbot/leftSidebar/formatRelativeTime';
import { historyListStyles as styles } from './HistoryList.styles';

import type { ConversationSummary } from '@/types';

export interface HistoryListProps {
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  searchKeyword: string;
  onChangeSearchKeyword: (value: string) => void;
  isStarredExpanded: boolean;
  onToggleStarredExpanded: () => void;
  starredItems: ConversationSummary[];
  isStarredLoading: boolean;
  isRecentExpanded: boolean;
  onToggleRecentExpanded: () => void;
  recentItems: ConversationSummary[];
  isRecentLoading: boolean;
  selectedConversationId: string | null;
  onSelect: (item: ConversationSummary) => void;
  onTogglePin: (item: ConversationSummary) => void;
  onToggleStar: (item: ConversationSummary) => void;
  onDelete: (item: ConversationSummary) => void;
  onHide: (item: ConversationSummary) => void;
}

// Left panel of the "Lịch sử tương tác Chatbot" screen — same visual
// language and row actions as ChatbotScreen's LeftSidebar (search, ĐÁNH DẤU
// SAO / GẦN ĐÂY sections, kebab popover), but deliberately NOT that same
// component: this panel never collapses, has no "Cuộc trò chuyện mới"
// button (this screen only views history, doesn't start new chats), and
// its kebab menu has a 4th "Ẩn" action that's local-state-only (no API —
// see `useChatbotHistory.hideConversation`).
const HistoryList: React.FC<HistoryListProps> = ({
  isSearchOpen,
  onToggleSearch,
  searchKeyword,
  onChangeSearchKeyword,
  isStarredExpanded,
  onToggleStarredExpanded,
  starredItems,
  isStarredLoading,
  isRecentExpanded,
  onToggleRecentExpanded,
  recentItems,
  isRecentLoading,
  selectedConversationId,
  onSelect,
  onTogglePin,
  onToggleStar,
  onDelete,
  onHide,
}) => {
  const [popoverAnchor, setPopoverAnchor] = useState<AppPopoverAnchor | null>(null);
  const [popoverTarget, setPopoverTarget] = useState<ConversationSummary | null>(null);
  const closePopover = () => {
    setPopoverAnchor(null);
    setPopoverTarget(null);
  };

  const openPopover = (event: GestureResponderEvent, item: ConversationSummary) => {
    const { pageX, pageY } = event.nativeEvent;
    setPopoverAnchor({ x: pageX, y: pageY });
    setPopoverTarget(item);
  };

  const popoverItems: AppPopoverItem[] = popoverTarget
    ? [
        {
          key: 'pin',
          label: popoverTarget.isPinned ? 'Bỏ ghim' : 'Ghim',
          icon: Bookmark,
          color: popoverTarget.isPinned ? APP_COLORS.primary : undefined,
          onPress: () => onTogglePin(popoverTarget),
        },
        {
          key: 'star',
          label: popoverTarget.isStarred ? 'Bỏ đánh dấu sao' : 'Đánh dấu sao',
          icon: Star,
          color: popoverTarget.isStarred ? '#f59e0b' : undefined,
          onPress: () => onToggleStar(popoverTarget),
        },
        {
          key: 'hide',
          label: 'Ẩn',
          icon: EyeOff,
          onPress: () => onHide(popoverTarget),
        },
        {
          key: 'delete',
          label: 'Xoá',
          icon: Trash2,
          destructive: true,
          onPress: () => onDelete(popoverTarget),
        },
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LỊCH SỬ HỘI THOẠI</Text>
        <TouchableOpacity
          onPress={onToggleSearch}
          style={styles.headerIconButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Search
            size={16}
            color={isSearchOpen ? APP_COLORS.chatBrandRed : APP_COLORS.chatIconMuted}
          />
        </TouchableOpacity>
      </View>

      {isSearchOpen && (
        <SidebarSearchBox
          value={searchKeyword}
          onChangeText={onChangeSearchKeyword}
          placeholder="Tìm kiếm hội thoại..."
        />
      )}

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <HistorySection
          title="ĐÁNH DẤU SAO"
          isExpanded={isStarredExpanded}
          onToggle={onToggleStarredExpanded}
          loading={isStarredLoading}
          items={starredItems}
          isStarredSection
          selectedConversationId={selectedConversationId}
          onSelect={onSelect}
          onOpenMenu={openPopover}
        />

        <HistorySection
          title="GẦN ĐÂY"
          isExpanded={isRecentExpanded}
          onToggle={onToggleRecentExpanded}
          loading={isRecentLoading}
          items={recentItems}
          selectedConversationId={selectedConversationId}
          onSelect={onSelect}
          onOpenMenu={openPopover}
        />
      </ScrollView>

      <AppPopover
        visible={!!popoverTarget}
        anchor={popoverAnchor}
        items={popoverItems}
        onClose={closePopover}
      />
    </View>
  );
};

interface HistorySectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  loading: boolean;
  items: ConversationSummary[];
  isStarredSection?: boolean;
  selectedConversationId: string | null;
  onSelect: (item: ConversationSummary) => void;
  onOpenMenu: (event: GestureResponderEvent, item: ConversationSummary) => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({
  title,
  isExpanded,
  onToggle,
  loading,
  items,
  isStarredSection,
  selectedConversationId,
  onSelect,
  onOpenMenu,
}) => (
  <View>
    <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
      {isExpanded ? (
        <ChevronUp size={14} color={APP_COLORS.textPrimary} />
      ) : (
        <ChevronDown size={14} color={APP_COLORS.textPrimary} />
      )}
      <Text style={styles.sectionTitle}>{title}</Text>
    </TouchableOpacity>

    {isExpanded && (
      <View style={styles.sectionBody}>
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={APP_COLORS.chatBrandRed} />
          </View>
        ) : items.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có hội thoại.</Text>
        ) : (
          items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.convRow,
                item.id === selectedConversationId && styles.convRowActive,
              ]}
              onPress={() => onSelect(item)}
            >
              {item.isPinned && (
                <Bookmark size={12} color={APP_COLORS.primary} style={styles.convRowPinIcon} />
              )}
              {isStarredSection && (
                <Star size={12} color="#f59e0b" style={styles.convRowPinIcon} />
              )}
              <View style={styles.convRowTextWrap}>
                <Text style={styles.convRowTitle} numberOfLines={1}>
                  {item.title || '(không tiêu đề)'}
                </Text>
                <Text style={styles.convRowTime} numberOfLines={1}>
                  {formatRelativeTime(item.updatedAt)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={(event) => onOpenMenu(event, item)}
                style={styles.convRowMenuButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MoreVertical size={16} color={APP_COLORS.chatIconMuted} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </View>
    )}
  </View>
);

export default HistoryList;
