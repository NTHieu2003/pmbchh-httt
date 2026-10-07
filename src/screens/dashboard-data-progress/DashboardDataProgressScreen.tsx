import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { BarChart3, BookOpen, Building2, Menu, RefreshCw, Trophy } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_COLORS } from '@/theme';
import { HeaderUserMenu } from '@/components/HeaderUserMenu';

import ActiveContributorsList from './ActiveContributorsList';
import { dashboardDataProgressScreenStyles as styles } from './DashboardDataProgressScreen.styles';
import DataTypeChart from './DataTypeChart';
import KpiCard from './KpiCard';
import { formatNumber } from './statsCompute';
import StatsTable from './StatsTable';
import Top5Grid from './Top5Grid';
import UnitDetailModal from './UnitDetailModal';
import { useDashboardDataProgress } from './useDashboardDataProgress.hook';

// H.I.127 — "Dashboard theo dõi tiến độ xây dựng dữ liệu trên Mobile".
// Mobile-simplified version of pmbc_web's ThongKeVanbanphapquyComponent:
// keeps the 4 KPI cards, a flat Top-5 cell grid and the detailed data
// table (search/filter/sort/pagination + modal). Drops the back-link
// header, Excel export, podium/progress-bar leaderboard and the 3-tab
// chart section per explicit scope cut.
const DashboardDataProgressScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    isLoading,
    isError,
    summary,
    top5,
    loadStats,
    searchTerm,
    setSearchTerm,
    activeLevelFilter,
    setActiveLevelFilter,
    showOnlyActive,
    toggleShowOnlyActive,
    sortKey,
    sortDirection,
    toggleSort,
    filteredStats,
    paginatedStats,
    currentPage,
    totalPages,
    pageSize,
    pageSizeOptions,
    setPageSize,
    goPrevPage,
    goNextPage,
    selectedUnit,
    openUnitDetail,
    closeUnitDetail,
    dataTypeStats,
    activeContributors,
    isSampleData,
  } = useDashboardDataProgress();

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
        <Text style={styles.headerTitle}>Tiến độ xây dựng dữ liệu văn bản pháp quy</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadStats} disabled={isLoading}>
          <RefreshCw size={16} color={APP_COLORS.textPrimary} />
          <Text style={styles.refreshButtonText}>Làm mới</Text>
        </TouchableOpacity>
        <HeaderUserMenu />
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={APP_COLORS.chatBrandRed} />
          <Text style={styles.loadingText}>Đang tổng hợp tiến độ xây dựng văn bản...</Text>
        </View>
      ) : isError ? (
        <View style={styles.loadingBox}>
          <Text style={styles.errorText}>Không thể tải dữ liệu thống kê.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadStats}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          enableAutomaticScroll
          extraScrollHeight={100}
          extraHeight={90}
        >
          <View style={styles.kpiRow}>
            <KpiCard
              icon={BookOpen}
              iconBgColor="#2563eb"
              title="Tổng số văn bản đã xây dựng"
              value={formatNumber(summary.totalVanBan)}
              footer={`Trên toàn bộ ${summary.totalUnits} đơn vị BCHH`}
            />
            <KpiCard
              icon={Building2}
              iconBgColor="#16a34a"
              title="Tỷ lệ đơn vị tham gia nhập liệu"
              value={`${summary.coverageRate}%`}
              footer={`${summary.activeUnits} / ${summary.totalUnits} đơn vị đã có dữ liệu`}
            />
            <KpiCard
              icon={Trophy}
              iconBgColor="#d97706"
              title="Đơn vị tích cực nhất (Top 1)"
              value={summary.topUnit?.departmentName || '—'}
              footer={`🏆 ${summary.highestCount} văn bản (${summary.topUnit?.percent || 0}%)`}
            />
            <KpiCard
              icon={BarChart3}
              iconBgColor="#7c3aed"
              title="Số VB trung bình / đơn vị"
              value={summary.avgVanBanPerUnit}
              footer={`${summary.veryActiveCount} đơn vị đạt mức rất tích cực (≥15 VB)`}
            />
          </View>

          <Top5Grid units={top5} onPressUnit={openUnitDetail} />

          <StatsTable
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeLevelFilter={activeLevelFilter}
            setActiveLevelFilter={setActiveLevelFilter}
            showOnlyActive={showOnlyActive}
            toggleShowOnlyActive={toggleShowOnlyActive}
            sortKey={sortKey}
            sortDirection={sortDirection}
            toggleSort={toggleSort}
            filteredStats={filteredStats}
            paginatedStats={paginatedStats}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            setPageSize={setPageSize}
            goPrevPage={goPrevPage}
            goNextPage={goNextPage}
            openUnitDetail={openUnitDetail}
          />

          <View style={styles.bottomRow}>
            <DataTypeChart stats={dataTypeStats} isSample={isSampleData} />
            <ActiveContributorsList contributors={activeContributors} isSample={isSampleData} />
          </View>
        </KeyboardAwareScrollView>
      )}

      <UnitDetailModal unit={selectedUnit} onClose={closeUnitDetail} />
    </SafeAreaView>
  );
};

export default DashboardDataProgressScreen;
