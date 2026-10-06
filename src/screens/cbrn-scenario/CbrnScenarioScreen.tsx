import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Download, FileSpreadsheet, FileText, Menu, Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppPopover, type AppPopoverAnchor, type AppPopoverItem } from '@/components/AppPopover';
import { APP_COLORS } from '@/theme';

import { cbrnScenarioScreenStyles as styles } from './CbrnScenarioScreen.styles';
import CbrnScenarioAttachModal from './CbrnScenarioAttachModal';
import CbrnScenarioDetailModal from './CbrnScenarioDetailModal';
import CbrnScenarioListItem from './CbrnScenarioListItem';
import { useCbrnScenario } from './useCbrnScenario.hook';

import type { CbrnScenarioStatusFilter } from './useCbrnScenario.hook';
import type { PmbcKichBanUngPhoCbrnItem } from '@/types';

const STATUS_FILTERS: { value: CbrnScenarioStatusFilter; label: string }[] = [
  { value: null, label: 'Tất cả' },
  { value: 1, label: 'Đang hoạt động' },
  { value: 2, label: 'Không hoạt động' },
];

// H.II.130 — "Xem kịch bản ứng phó sự cố, thảm họa liên quan đến CBRN qua
// giao diện Mobile". Mobile-simplified, read-only version of pmbc_web's
// PmbcKichbanungphocbrnComponent (`quanlykho/pmbc-kichbanungphocbrn`) —
// same flat-list UI pattern as "Lĩnh vực Chatbot", drops create/edit/delete
// (including the "attach-thhl" linking dialog, an edit-only feature). Has
// a search box (`ten_kich_ban_cbrn`) + trạng thái filter pills matching
// web's quick-search/filter row, and a real export API on web, so "Xuất dữ
// liệu" is wired up as a dropdown (Xuất Excel / Xuất PDF, matching web's
// "In Excel"/"In PDF" menu) — saves to Downloads, switching to the
// filtered `exportsearchExcel` endpoint once a search/status filter is
// active.
const CbrnScenarioScreen: React.FC = () => {
  const navigation = useNavigation();
  const [attachTarget, setAttachTarget] =
    useState<PmbcKichBanUngPhoCbrnItem | null>(null);
  const [exportPopoverAnchor, setExportPopoverAnchor] = useState<AppPopoverAnchor | null>(null);
  const {
    items,
    isLoading,
    isRefreshing,
    isError,
    refetch,
    onPullToRefresh,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedItem,
    openDetail,
    closeDetail,
    isExporting,
    onExport,
  } = useCbrnScenario();

  // "Xuất dữ liệu" dropdown — matches web's matMenuTriggerFor menu ("In
  // Excel" / "In PDF", printDL(type)).
  const openExportMenu = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    setExportPopoverAnchor({ x: pageX, y: pageY });
  };
  const exportPopoverItems: AppPopoverItem[] = [
    {
      key: 'excel',
      label: 'Xuất Excel',
      icon: FileSpreadsheet,
      onPress: () => onExport(1),
    },
    {
      key: 'pdf',
      label: 'Xuất PDF',
      icon: FileText,
      onPress: () => onExport(2),
    },
  ];

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
        <Text style={styles.headerTitle}>Kịch bản ứng phó CBRN</Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={openExportMenu}
          disabled={isExporting}
        >
          {isExporting ? (
            <ActivityIndicator size="small" color={APP_COLORS.textPrimary} />
          ) : (
            <Download size={16} color={APP_COLORS.textPrimary} />
          )}
          <Text style={styles.exportButtonText}>
            {isExporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Search size={14} color={APP_COLORS.chatIconMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo tên kịch bản"
          placeholderTextColor={APP_COLORS.chatIconMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.statusFilterRow}>
        {STATUS_FILTERS.map(filter => {
          const isActive = filter.value === statusFilter;
          return (
            <TouchableOpacity
              key={String(filter.value)}
              style={[styles.statusPill, isActive && styles.statusPillActive]}
              onPress={() => setStatusFilter(filter.value)}
            >
              <Text
                style={[
                  styles.statusPillText,
                  isActive && styles.statusPillTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={APP_COLORS.chatBrandRed} />
          <Text style={styles.loadingText}>Đang tải danh sách kịch bản...</Text>
        </View>
      ) : isError ? (
        <View style={styles.loadingBox}>
          <Text style={styles.errorText}>
            Không thể tải danh sách kịch bản.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => String(item.gid)}
          renderItem={({ item }) => (
            <CbrnScenarioListItem
              item={item}
              onPress={openDetail}
              onAttach={setAttachTarget}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onPullToRefresh}
              colors={[APP_COLORS.chatBrandRed]}
              tintColor={APP_COLORS.chatBrandRed}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Chưa có kịch bản ứng phó CBRN nào được cấu hình.
              </Text>
            </View>
          }
        />
      )}

      <CbrnScenarioDetailModal item={selectedItem} onClose={closeDetail} />
      <CbrnScenarioAttachModal
        item={attachTarget}
        onClose={() => setAttachTarget(null)}
        onSaved={refetch}
      />
      <AppPopover
        visible={!!exportPopoverAnchor}
        anchor={exportPopoverAnchor}
        items={exportPopoverItems}
        onClose={() => setExportPopoverAnchor(null)}
      />
    </SafeAreaView>
  );
};

export default CbrnScenarioScreen;
