import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Download, FileSpreadsheet, FileText, Menu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppPopover, type AppPopoverAnchor, type AppPopoverItem } from '@/components/AppPopover';
import { APP_COLORS } from '@/theme';

import { chatbotDomainsScreenStyles as styles } from './ChatbotDomainsScreen.styles';
import DomainFieldDetailModal from './DomainFieldDetailModal';
import DomainFieldListItem from './DomainFieldListItem';
import { useChatbotDomains } from './useChatbotDomains.hook';

// H.III.131 — "Xem lĩnh vực cho Chatbot với các ngành đặc thù trong BCHH
// qua giao diện Mobile". Mobile-simplified, read-only version of pmbc_web's
// PmbcQuanlylinhvucchatbotComponent (`quanlykho/pmbc-quanlylinhvucchatbot`):
// web shows this as a table with Thêm mới/Sửa/Xóa; mobile instead shows a
// flat list (rows separated by a bottom border, not individual cards) and
// drops every create/edit/delete action — tapping a row just opens a
// read-only detail modal. Web's own UI never wires up an export button, but
// the backend has a real exportExcel endpoint ready
// (pmbc_quanlylinhvucchatbotRsService), so "Xuất dữ liệu" is wired up here
// the same way as the CBRN scenario screen's export dropdown.
const ChatbotDomainsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [exportPopoverAnchor, setExportPopoverAnchor] = useState<AppPopoverAnchor | null>(null);
  const {
    items,
    isLoading,
    isRefreshing,
    isError,
    refetch,
    onPullToRefresh,
    selectedItem,
    openDetail,
    closeDetail,
    isExporting,
    onExport,
  } = useChatbotDomains();

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
        <Text style={styles.headerTitle}>Lĩnh vực Chatbot</Text>
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

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={APP_COLORS.chatBrandRed} />
          <Text style={styles.loadingText}>Đang tải danh sách lĩnh vực...</Text>
        </View>
      ) : isError ? (
        <View style={styles.loadingBox}>
          <Text style={styles.errorText}>Không thể tải danh sách lĩnh vực.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.gid)}
          renderItem={({ item }) => <DomainFieldListItem item={item} onPress={openDetail} />}
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
              <Text style={styles.emptyText}>Chưa có lĩnh vực nào được cấu hình.</Text>
            </View>
          }
        />
      )}

      <DomainFieldDetailModal item={selectedItem} onClose={closeDetail} />
      <AppPopover
        visible={!!exportPopoverAnchor}
        anchor={exportPopoverAnchor}
        items={exportPopoverItems}
        onClose={() => setExportPopoverAnchor(null)}
      />
    </SafeAreaView>
  );
};

export default ChatbotDomainsScreen;
