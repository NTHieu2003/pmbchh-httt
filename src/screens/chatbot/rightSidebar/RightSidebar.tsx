import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BookOpen, PanelRightClose, Search } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import { SidebarSearchBox } from '../components';
import DomainList from './DomainList';
import { useRightSidebar } from './RightSidebar.hook';
import { createRightSidebarStyles, rightSidebarStyles as staticStyles } from './RightSidebar.styles';

// "NGÀNH ĐẶC THÙ" panel — mirrors pmbc_web's `<aside class="chatgpt-sidebar-right">`
// (chatbot.component.html) 1:1: header, search toggle, "Đã chọn: x/y" +
// Tất cả/Bỏ chọn actions, then the scrollable domain list.
const RightSidebar: React.FC = () => {
  const {
    filteredDomainList,
    totalCount,
    selectedCount,
    isLoading,
    isError,
    isCollapsed,
    toggleCollapse,
    isSearchOpen,
    toggleSearch,
    searchKeyword,
    setSearchKeyword,
    isDomainSelected,
    toggleDomain,
    selectAllDomains,
    deselectAllDomains,
  } = useRightSidebar();

  const styles = createRightSidebarStyles(isCollapsed);

  if (isCollapsed) {
    return (
      <View style={styles.container}>
        <View style={styles.collapsedHeader}>
          <TouchableOpacity
            onPress={toggleCollapse}
            style={styles.collapsedIconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <BookOpen size={18} color={APP_COLORS.chatBrandRed} />
          </TouchableOpacity>
        </View>

      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={staticStyles.header}>
        <View style={staticStyles.headerTitleRow}>
          <BookOpen size={18} color={APP_COLORS.chatBrandRed} />
          <Text style={staticStyles.headerTitle}>NGÀNH ĐẶC THÙ</Text>
        </View>
        <View style={staticStyles.headerActions}>
          <TouchableOpacity
            onPress={toggleSearch}
            style={staticStyles.headerIconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Search
              size={16}
              color={isSearchOpen ? APP_COLORS.chatBrandRed : APP_COLORS.chatIconMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleCollapse}
            style={staticStyles.headerIconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <PanelRightClose size={16} color={APP_COLORS.chatIconMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {isSearchOpen && (
        <SidebarSearchBox
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          placeholder="Tìm kiếm ngành..."
        />
      )}

      <View style={staticStyles.selectionBar}>
        <Text style={staticStyles.selectionText}>
          Đã chọn: <Text style={staticStyles.selectionCount}>{selectedCount}</Text> /{' '}
          {totalCount}
        </Text>
        <View style={staticStyles.selectionActions}>
          <TouchableOpacity onPress={selectAllDomains}>
            <Text style={staticStyles.selectionActionText}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deselectAllDomains}>
            <Text style={staticStyles.selectionActionText}>Bỏ chọn</Text>
          </TouchableOpacity>
        </View>
      </View>

      <DomainList
        items={filteredDomainList}
        isLoading={isLoading}
        isError={isError}
        isDomainSelected={isDomainSelected}
        onToggleDomain={toggleDomain}
      />
    </View>
  );
};

export default RightSidebar;
