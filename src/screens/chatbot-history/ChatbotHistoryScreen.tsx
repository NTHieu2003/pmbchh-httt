import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { EyeOff, Menu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { appAlert } from '@/components/AppDialog';
import { AppPopover, type AppPopoverAnchor, type AppPopoverItem } from '@/components/AppPopover';
import { HeaderUserMenu } from '@/components/HeaderUserMenu';
import { APP_COLORS } from '@/theme';

import { chatbotHistoryScreenStyles as styles } from './ChatbotHistoryScreen.styles';
import HistoryList from './HistoryList';
import MessageViewer from './MessageViewer';
import { useChatbotHistory } from './useChatbotHistory.hook';

import type { ConversationSummary } from '@/types';

// H.III.132 — "Xem dữ liệu cá nhân tương tác Chatbot với các ngành đặc thù
// trong BCHH qua giao diện Mobile". Same visual language as ChatbotScreen's
// left sidebar (search, ĐÁNH DẤU SAO / GẦN ĐÂY, kebab popover), but this
// screen is reached from the drawer menu (not pushed from Chatbot), so its
// header keeps the hamburger drawer toggle instead of a back arrow, and its
// history panel never collapses — see HistoryList/useChatbotHistory.
const ChatbotHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    isSearchOpen,
    toggleSearch,
    searchKeyword,
    setSearchKeyword,
    isStarredExpanded,
    toggleStarredExpanded,
    starredItems,
    isStarredLoading,
    isRecentExpanded,
    toggleRecentExpanded,
    recentItems,
    isRecentLoading,
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
  } = useChatbotHistory();

  const handleDelete = (item: ConversationSummary) => {
    appAlert(
      'Xoá hội thoại',
      `Xoá hội thoại "${item.title || '(không tiêu đề)'}" khỏi lịch sử?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => deleteConversation(item),
        },
      ]
    );
  };

  // Header's "view hidden conversations" popover — reuses AppPopover (same
  // one the kebab menus use). Stays open across multiple un-hide taps
  // (`closeOnItemPress={false}`) since un-hiding several in a row shouldn't
  // require reopening the list each time; it closes itself once the last
  // hidden item is restored (effect below).
  const [hiddenPopoverAnchor, setHiddenPopoverAnchor] = useState<AppPopoverAnchor | null>(null);
  const openHiddenPopover = (event: { nativeEvent: { pageX: number; pageY: number } }) => {
    if (hiddenItems.length === 0) {
      appAlert('Không có hội thoại bị ẩn', 'Chưa có hội thoại nào bị ẩn.');
      return;
    }
    const { pageX, pageY } = event.nativeEvent;
    setHiddenPopoverAnchor({ x: pageX, y: pageY });
  };
  useEffect(() => {
    if (hiddenPopoverAnchor && hiddenItems.length === 0) {
      setHiddenPopoverAnchor(null);
    }
  }, [hiddenPopoverAnchor, hiddenItems.length]);
  const hiddenPopoverItems: AppPopoverItem[] = hiddenItems.map((item) => ({
    key: item.id,
    label: item.title || '(không tiêu đề)',
    onPress: () => unhideConversation(item),
  }));
  const HIDDEN_POPOVER_WIDTH = 280;
  const HIDDEN_POPOVER_MAX_VISIBLE = 6;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Menu size={22} color={APP_COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử tương tác Chatbot</Text>

        <TouchableOpacity
          onPress={openHiddenPopover}
          style={styles.hideButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <EyeOff size={20} color={APP_COLORS.chatIconMuted} />
        </TouchableOpacity>
        <HeaderUserMenu />
      </View>

      <AppPopover
        visible={!!hiddenPopoverAnchor}
        anchor={hiddenPopoverAnchor}
        items={hiddenPopoverItems}
        onClose={() => setHiddenPopoverAnchor(null)}
        width={HIDDEN_POPOVER_WIDTH}
        maxVisibleItems={HIDDEN_POPOVER_MAX_VISIBLE}
        closeOnItemPress={false}
      />

      <View style={styles.row}>
        <HistoryList
          isSearchOpen={isSearchOpen}
          onToggleSearch={toggleSearch}
          searchKeyword={searchKeyword}
          onChangeSearchKeyword={setSearchKeyword}
          isStarredExpanded={isStarredExpanded}
          onToggleStarredExpanded={toggleStarredExpanded}
          starredItems={starredItems}
          isStarredLoading={isStarredLoading}
          isRecentExpanded={isRecentExpanded}
          onToggleRecentExpanded={toggleRecentExpanded}
          recentItems={recentItems}
          isRecentLoading={isRecentLoading}
          selectedConversationId={selectedConversationId}
          onSelect={selectConversation}
          onTogglePin={togglePin}
          onToggleStar={toggleStar}
          onDelete={handleDelete}
          onHide={hideConversation}
        />

        <MessageViewer
          selectedConversationId={selectedConversationId}
          selectedTitle={selectedTitle}
          messages={messages}
          isLoading={isLoadingMessages}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatbotHistoryScreen;
