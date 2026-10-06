import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MoreVertical,
  PanelLeftClose,
  Search,
  SquarePen,
  Star,
  Trash2,
} from 'lucide-react-native';
import type { GestureResponderEvent } from 'react-native';

import {
  AppPopover,
  type AppPopoverAnchor,
  type AppPopoverItem,
} from '@/components/AppPopover';
import { APP_COLORS } from '@/theme';

import { SidebarSearchBox } from '../components';
import { formatRelativeTime } from './formatRelativeTime';
import { useLeftSidebar } from './LeftSidebar.hook';
import {
  createLeftSidebarStyles,
  leftSidebarStyles as staticStyles,
} from './LeftSidebar.styles';

import type { ConversationSummary } from '@/types';

export interface LeftSidebarProps {
  onNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
  // Renders a back arrow in the sidebar header when provided — used to
  // return to the Home screen's menu (Chatbot is now a pushed screen, not
  // the app root).
  onBack?: () => void;
  // `useChat`'s `historyVersion` — bumped after every successful
  // conversation save so "GẦN ĐÂY" refetches and shows the just-sent
  // message without the user having to manually reopen the sidebar.
  refreshSignal?: number;
}

// Conversation list sidebar — mirrors pmbc_web's chatbot left drawer
// (logo header, "Cuộc trò chuyện mới", ĐÁNH DẤU SAO / GẦN ĐÂY sections,
// backed by ApiChatBoxService.searchConversations). Tapping a row loads
// that conversation's history (see useChat's `loadConversation`); the
// kebab menu (Ghim / Đánh dấu sao / Xoá) mirrors web's togglePin /
// toggleStar / deleteConversation.
const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onNewConversation,
  onSelectConversation,
  onBack,
  refreshSignal,
}) => {
  const {
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
  } = useLeftSidebar(refreshSignal);
  const styles = createLeftSidebarStyles(isCollapsed);
  const logoSource = require('@/assets/images/logo-bchh-chat.png');

  const [popoverAnchor, setPopoverAnchor] = useState<AppPopoverAnchor | null>(
    null,
  );
  const [popoverTarget, setPopoverTarget] =
    useState<ConversationSummary | null>(null);
  const closePopover = () => {
    setPopoverAnchor(null);
    setPopoverTarget(null);
  };

  const openPopover = (
    event: GestureResponderEvent,
    item: ConversationSummary,
  ) => {
    const { pageX, pageY } = event.nativeEvent;
    setPopoverAnchor({ x: pageX, y: pageY });
    setPopoverTarget(item);
  };

  const handleDelete = (item: ConversationSummary) => {
    Alert.alert(
      'Xoá hội thoại',
      `Xoá hội thoại "${item.title || '(không tiêu đề)'}" khỏi lịch sử?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => deleteConversation(item),
        },
      ],
    );
  };

  const popoverItems: AppPopoverItem[] = popoverTarget
    ? [
        {
          key: 'pin',
          label: popoverTarget.isPinned ? 'Bỏ ghim' : 'Ghim',
          icon: Bookmark,
          color: popoverTarget.isPinned ? APP_COLORS.primary : undefined,
          onPress: () => togglePin(popoverTarget),
        },
        {
          key: 'star',
          label: popoverTarget.isStarred ? 'Bỏ đánh dấu sao' : 'Đánh dấu sao',
          icon: Star,
          color: popoverTarget.isStarred ? '#f59e0b' : undefined,
          onPress: () => toggleStar(popoverTarget),
        },
        {
          key: 'delete',
          label: 'Xoá',
          icon: Trash2,
          destructive: true,
          onPress: () => handleDelete(popoverTarget),
        },
      ]
    : [];

  if (isCollapsed) {
    return (
      <View style={styles.container}>
        <View style={styles.collapsedContent}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={styles.collapsedIconButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ArrowLeft size={18} color={APP_COLORS.textPrimary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={toggleCollapse}
            style={styles.collapsedLogoButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image
              source={logoSource}
              style={styles.collapsedLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNewConversation}
            style={[styles.collapsedIconButton, styles.collapsedNewChatButton]}
          >
            <SquarePen size={18} color={APP_COLORS.white} />
          </TouchableOpacity>

          <View
            style={[styles.collapsedIconButton, styles.collapsedMessageButton]}
          >
            <MessageSquare size={18} color={APP_COLORS.chatBrandRed} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={staticStyles.header}>
        <View style={staticStyles.headerTitleRow}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={staticStyles.headerIconButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ArrowLeft size={18} color={APP_COLORS.textPrimary} />
            </TouchableOpacity>
          )}
          <Image
            source={logoSource}
            style={staticStyles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={staticStyles.headerActions}>
          <TouchableOpacity
            onPress={toggleSearch}
            style={staticStyles.headerIconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Search
              size={16}
              color={
                isSearchOpen
                  ? APP_COLORS.chatBrandRed
                  : APP_COLORS.chatIconMuted
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleCollapse}
            style={staticStyles.headerIconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <PanelLeftClose size={16} color={APP_COLORS.chatIconMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {isSearchOpen && (
        <SidebarSearchBox
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          placeholder="Tìm kiếm hội thoại..."
        />
      )}

      <TouchableOpacity
        style={staticStyles.newConversationButton}
        onPress={onNewConversation}
      >
        <SquarePen size={18} color={APP_COLORS.white} />
        <Text style={staticStyles.newConversationText}>
          Cuộc trò chuyện mới
        </Text>
      </TouchableOpacity>
      <ScrollView
        style={staticStyles.body}
        contentContainerStyle={staticStyles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <ConversationSection
          title="ĐÁNH DẤU SAO"
          isExpanded={isStarredExpanded}
          onToggle={toggleStarredExpanded}
          loading={starredSection.loading}
          items={starredSection.items}
          isStarredSection
          onSelect={onSelectConversation}
          onOpenMenu={openPopover}
        />

        <ConversationSection
          title="GẦN ĐÂY"
          isExpanded={isRecentExpanded}
          onToggle={toggleRecentExpanded}
          loading={recentSection.loading}
          items={recentSection.items}
          onSelect={onSelectConversation}
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

interface ConversationSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  loading: boolean;
  items: ConversationSummary[];
  isStarredSection?: boolean;
  onSelect: (id: string) => void;
  onOpenMenu: (event: GestureResponderEvent, item: ConversationSummary) => void;
}

const ConversationSection: React.FC<ConversationSectionProps> = ({
  title,
  isExpanded,
  onToggle,
  loading,
  items,
  isStarredSection,
  onSelect,
  onOpenMenu,
}) => (
  <View>
    <TouchableOpacity style={staticStyles.sectionHeader} onPress={onToggle}>
      {isExpanded ? (
        <ChevronUp size={14} color={APP_COLORS.textPrimary} />
      ) : (
        <ChevronDown size={14} color={APP_COLORS.textPrimary} />
      )}
      <Text style={staticStyles.sectionTitle}>{title}</Text>
    </TouchableOpacity>

    {isExpanded && (
      <View style={staticStyles.sectionBody}>
        {loading ? (
          <View style={staticStyles.loadingRow}>
            <ActivityIndicator size="small" color={APP_COLORS.chatBrandRed} />
          </View>
        ) : items.length === 0 ? (
          <Text style={staticStyles.emptyText}>Chưa có hội thoại.</Text>
        ) : (
          items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={staticStyles.convRow}
              onPress={() => onSelect(item.id)}
            >
              {item.isPinned && (
                <Bookmark
                  size={12}
                  color={APP_COLORS.primary}
                  style={staticStyles.convRowPinIcon}
                />
              )}
              {isStarredSection && (
                <Star
                  size={12}
                  color="#f59e0b"
                  style={staticStyles.convRowPinIcon}
                />
              )}
              <View style={staticStyles.convRowTextWrap}>
                <Text style={staticStyles.convRowTitle} numberOfLines={1}>
                  {item.title || '(không tiêu đề)'}
                </Text>
                <Text style={staticStyles.convRowTime} numberOfLines={1}>
                  {formatRelativeTime(item.updatedAt)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={event => onOpenMenu(event, item)}
                style={staticStyles.convRowMenuButton}
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

export default LeftSidebar;