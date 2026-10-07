import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import {
  Menu,
  MousePointerClick,
  RefreshCw,
  Search,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppDatePicker } from '@/components/AppDatePicker';
import { AppSelect } from '@/components/AppSelect';
import { HeaderUserMenu } from '@/components/HeaderUserMenu';
import { HorizontalBarChart } from '@/components/HorizontalBarChart';
import { APP_COLORS } from '@/theme';

import { dashboardUserStatsScreenStyles as styles } from './DashboardUserStatsScreen.styles';
import { formatNumber } from './growthFormat';
import KpiCard from './KpiCard';
import TopListCard from './TopListCard';
import { useDashboardUserStats } from './useDashboardUserStats.hook';

import type { TopListColumn } from './TopListCard';
import type { TopChucNangItem } from '@/types';

// `duongDan` is the feature's identity key; `tyLe` is its share of ALL
// feature-attributed actions in the period (not just these 10 rows).
const topChucNangItems = (list: TopChucNangItem[]) =>
  list.map((item, index) => ({
    key: item.duongDan || String(item.sttExport ?? index),
    label: item.tenChucNang || item.duongDan || '—',
    value: item.soThaoTac ?? 0,
    share: item.tyLe,
  }));

const DON_VI_COLUMNS: TopListColumn[] = [
  { key: 'rank', label: '#', flex: 0.6, render: (item) => String(item.sttExport ?? '') },
  { key: 'deptName', label: 'Đơn vị', flex: 2.4, align: 'left', render: (item) => item.deptName || '' },
  { key: 'soNguoiDung', label: 'Số người dùng', flex: 1.4, render: (item) => formatNumber(item.soNguoiDung) },
  { key: 'luotTruyCap', label: 'Lượt truy cập', flex: 1.4, render: (item) => formatNumber(item.luotTruyCap) },
  { key: 'tyLe', label: 'Tỷ lệ', flex: 0.8, render: (item) => `${item.tyLe ?? 0}%` },
];

const NGUOI_DUNG_COLUMNS: TopListColumn[] = [
  { key: 'rank', label: '#', flex: 0.6, render: (item) => String(item.sttExport ?? '') },
  { key: 'fullName', label: 'Họ và tên', flex: 1.8, align: 'left', render: (item) => item.fullName || '' },
  { key: 'deptName', label: 'Đơn vị', flex: 1.6, align: 'left', render: (item) => item.deptName || '' },
  { key: 'luotTruyCap', label: 'Lượt truy cập', flex: 1.2, render: (item) => formatNumber(item.luotTruyCap) },
  { key: 'soThaoTac', label: 'Lượt thao tác', flex: 1.2, render: (item) => formatNumber(item.soThaoTac) },
];

// H.I.126 — "Dashboard theo dõi các chỉ số thống kê lượng người dùng trên
// Mobile". Mobile-simplified version of pmbc_web's DashboardUserComponent:
// keeps the filter bar, 4 of the 5 KPI cards (drops "Người dùng mới") and
// the two Top-5 ranked tables; drops the period line, both charts and the
// Excel/PDF export card (web-only, per explicit scope cut).
const DashboardUserStatsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    isLoading,
    isError,
    kpi,
    lstTheoDonVi,
    lstTheoNguoiDung,
    displayTopDonVi,
    displayTopNguoiDung,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    donViQuery,
    setDonViQuery,
    donViOptions,
    onSelectDonVi,
    onClearDonVi,
    doSearch,
    doRefresh,
    topChucNang,
  } = useDashboardUserStats();

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
        <Text style={styles.headerTitle}>Dashboard người dùng</Text>
        <HeaderUserMenu />
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={APP_COLORS.chatBrandRed} />
        </View>
      ) : isError ? (
        <View style={styles.loadingBox}>
          <Text style={styles.errorText}>Không thể tải dữ liệu thống kê.</Text>
          <TouchableOpacity style={styles.searchButton} onPress={doSearch}>
            <RefreshCw size={16} color={APP_COLORS.white} />
            <Text style={styles.searchButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Scrolls as a whole: filter bar, KPI row, the two Top-5 tables
        // (fixed-height `bottomRow`, each scrolling internally) and the
        // feature-usage chart below them. `handled` keeps taps on the đơn
        // vị AppSelect dropdown working inside the ScrollView.
        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.filterBar}>
            <View style={styles.filterField}>
              <AppDatePicker label="Từ ngày" value={fromDate} onChange={setFromDate} maximumDate={toDate} />
            </View>
            <View style={styles.filterField}>
              <AppDatePicker label="Đến ngày" value={toDate} onChange={setToDate} minimumDate={fromDate} />
            </View>
            <View style={styles.filterDonViField}>
              <Text style={styles.filterDonViLabel}>Đơn vị</Text>
              <AppSelect
                value={donViQuery}
                onChangeText={setDonViQuery}
                onSelect={onSelectDonVi}
                onClear={onClearDonVi}
                options={donViOptions}
                filterLocally
                placeholder="Tất cả đơn vị"
                emptyText="Không tìm thấy đơn vị"
                dropdownMode="overlay"
              />
            </View>
            <View style={styles.filterActions}>
              <TouchableOpacity style={styles.searchButton} onPress={doSearch} disabled={isLoading}>
                <Search size={16} color={APP_COLORS.white} />
                <Text style={styles.searchButtonText}>Tìm kiếm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.refreshButton} onPress={doRefresh} disabled={isLoading}>
                <RefreshCw size={16} color={APP_COLORS.textPrimary} />
                <Text style={styles.refreshButtonText}>Làm mới</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.kpiRow}>
            <KpiCard
              icon={Users}
              iconBgColor="#3B82F6"
              title="Tổng số người dùng"
              value={kpi.totalUsers}
              growth={kpi.totalUsersGrowth}
            />
            <KpiCard
              icon={UserCheck}
              iconBgColor="#22C55E"
              title="Người dùng hoạt động"
              value={kpi.activeUsers}
              growth={kpi.activeUsersGrowth}
            />
            <KpiCard
              icon={TrendingUp}
              iconBgColor="#F59E0B"
              title="Lượt truy cập"
              value={kpi.accessCount}
              growth={kpi.accessCountGrowth}
            />
            <KpiCard
              icon={MousePointerClick}
              iconBgColor="#14B8A6"
              title="Lượt thao tác"
              value={kpi.actionCount}
              growth={kpi.actionCountGrowth}
            />
          </View>

          <View style={styles.bottomRow}>
            <TopListCard
              title="Top 5 đơn vị có nhiều người dùng nhất"
              emptyText="Không có dữ liệu trong kỳ"
              columns={DON_VI_COLUMNS}
              fullList={lstTheoDonVi}
              displayList={displayTopDonVi}
            />

            <TopListCard
              title="Top 5 người dùng hoạt động nhiều nhất"
              emptyText="Không có dữ liệu trong kỳ"
              columns={NGUOI_DUNG_COLUMNS}
              fullList={lstTheoNguoiDung}
              displayList={displayTopNguoiDung}
            />
          </View>

          <HorizontalBarChart
            title="Top 10 chức năng được sử dụng nhiều nhất"
            items={topChucNangItems(topChucNang)}
            unit="lượt thao tác"
            emptyText="Chưa có dữ liệu chức năng trong kỳ."
            labelWidth={220}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default DashboardUserStatsScreen;
