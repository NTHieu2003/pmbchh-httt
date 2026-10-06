import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, type ViewStyle } from 'react-native';
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Square,
  X,
} from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import FilterChips from './FilterChips';
import { ACTIVE_LEVEL_LABEL, formatDateDisplay } from './statsCompute';
import { statsTableStyles as styles } from './StatsTable.styles';

import type { ActiveLevel, DepartmentVanBanStats } from './statsCompute';
import type { SortDirection, SortKey, UseDashboardDataProgressResult } from './useDashboardDataProgress.hook';

export type StatsTableProps = Pick<
  UseDashboardDataProgressResult,
  | 'searchTerm'
  | 'setSearchTerm'
  | 'activeLevelFilter'
  | 'setActiveLevelFilter'
  | 'showOnlyActive'
  | 'toggleShowOnlyActive'
  | 'sortKey'
  | 'sortDirection'
  | 'toggleSort'
  | 'filteredStats'
  | 'paginatedStats'
  | 'currentPage'
  | 'totalPages'
  | 'pageSize'
  | 'pageSizeOptions'
  | 'setPageSize'
  | 'goPrevPage'
  | 'goNextPage'
  | 'openUnitDetail'
>;

interface Column {
  key: string;
  label: string;
  width: number;
  align?: 'left' | 'center' | 'right';
  sortKey?: SortKey;
}

// Widened so header labels and data (department codes especially — some
// run 15-20+ chars) never get ellipsis-truncated; the table already
// scrolls horizontally, so there's no ceiling pressure to keep columns
// narrow.
const COLUMNS: Column[] = [
  { key: 'rank', label: 'Hạng', width: 64, align: 'center', sortKey: 'rank' },
  { key: 'code', label: 'Mã đơn vị', width: 260, align: 'center' },
  { key: 'name', label: 'Tên đơn vị', width: 320, align: 'left', sortKey: 'departmentName' },
  { key: 'total', label: 'Tổng số VB', width: 140, align: 'right', sortKey: 'total' },
  { key: 'luat', label: 'Luật', width: 72, align: 'right' },
  { key: 'nghiDinh', label: 'Nghị định', width: 100, align: 'right' },
  { key: 'thongTu', label: 'Thông tư', width: 100, align: 'right' },
  { key: 'quyetDinh', label: 'Quyết định', width: 110, align: 'right' },
  { key: 'other', label: 'Khác', width: 72, align: 'right' },
  { key: 'conHieuLuc', label: 'Còn hiệu lực', width: 120, align: 'right' },
  { key: 'percent', label: 'Tỷ lệ (%)', width: 100, align: 'right', sortKey: 'percent' },
  { key: 'level', label: 'Đánh giá tiến độ', width: 170, align: 'center' },
  { key: 'updated', label: 'Cập nhật cuối', width: 130, align: 'center' },
  { key: 'action', label: 'Thao tác', width: 80, align: 'center' },
];

// Matches web's `.rank-tag` — gold/silver/bronze for rank 1-3, neutral otherwise.
const rankTagStyle = (rank: number): ViewStyle => {
  if (rank === 1) return styles.rankTagGold;
  if (rank === 2) return styles.rankTagSilver;
  if (rank === 3) return styles.rankTagBronze;
  return styles.rankTagDefault;
};

const LEVEL_BADGE_STYLE: Record<ActiveLevel, ViewStyle> = {
  very_active: styles.level_very_active,
  active: styles.level_active,
  normal: styles.level_normal,
  low: styles.level_low,
};

const sortIcon = (col: Column, sortKey: SortKey, sortDirection: SortDirection) => {
  if (!col.sortKey) return '';
  if (col.sortKey !== sortKey) return ' ↕';
  return sortDirection === 'asc' ? ' ▲' : ' ▼';
};

const renderCell = (col: Column, item: DepartmentVanBanStats): string => {
  switch (col.key) {
    case 'rank':
      return String(item.rank);
    case 'code':
      return item.departmentCode;
    case 'name':
      return item.departmentName;
    case 'total':
      return String(item.total);
    case 'luat':
      return String(item.luatCount);
    case 'nghiDinh':
      return String(item.nghiDinhCount);
    case 'thongTu':
      return String(item.thongTuCount);
    case 'quyetDinh':
      return String(item.quyetDinhCount);
    case 'other':
      return String(item.otherCount);
    case 'conHieuLuc':
      return String(item.conHieuLucCount);
    case 'percent':
      return `${item.percent}%`;
    case 'updated':
      return formatDateDisplay(item.lastUpdated);
    default:
      return '';
  }
};

// Detailed data table — matches web's "BẢNG THỐNG KÊ CHI TIẾT" section:
// search + mức-độ filter + "chỉ hiện đơn vị có dữ liệu" checkbox, sortable
// columns, pagination. Horizontally scrollable since there are 14 columns.
const StatsTable: React.FC<StatsTableProps> = ({
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
  openUnitDetail,
}) => (
  <View style={styles.section}>
    <Text style={styles.title}>📑 Bảng thống kê chi tiết số lượng văn bản theo từng đơn vị</Text>

    <View style={styles.toolbar}>
      <View style={styles.searchBox}>
        <Search size={16} color={APP_COLORS.chatIconMuted} />
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Tìm theo tên đơn vị hoặc mã đơn vị..."
          placeholderTextColor={APP_COLORS.chatIconMuted}
          style={styles.searchInput}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')} hitSlop={8}>
            <X size={16} color={APP_COLORS.chatIconMuted} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.checkboxRow} onPress={toggleShowOnlyActive}>
        {showOnlyActive ? (
          <CheckSquare size={18} color={APP_COLORS.primary} />
        ) : (
          <Square size={18} color={APP_COLORS.chatIconMuted} />
        )}
        <Text style={styles.checkboxLabel}>Chỉ hiển thị đơn vị có dữ liệu</Text>
      </TouchableOpacity>
    </View>

    <FilterChips value={activeLevelFilter} onChange={setActiveLevelFilter} />

    <Text style={styles.counter}>
      Hiển thị <Text style={styles.counterBold}>{paginatedStats.length}</Text> / {filteredStats.length} đơn vị
    </Text>

    <ScrollView horizontal showsHorizontalScrollIndicator style={styles.tableScroll}>
      <View>
        <View style={styles.headerRow}>
          {COLUMNS.map((col) => (
            <TouchableOpacity
              key={col.key}
              style={[styles.headerCell, { width: col.width }]}
              disabled={!col.sortKey}
              onPress={() => col.sortKey && toggleSort(col.sortKey)}
            >
              <Text
                style={[
                  styles.headerCellText,
                  col.align === 'left' && styles.textLeft,
                  col.align === 'right' && styles.textRight,
                ]}
              >
                {col.label}
                {sortIcon(col, sortKey, sortDirection)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {paginatedStats.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>Không tìm thấy đơn vị nào phù hợp với điều kiện tìm kiếm.</Text>
          </View>
        ) : (
          paginatedStats.map((item) => (
            <View
              key={item.departmentCode}
              style={[
                styles.row,
                item.rank <= 3 && styles.highlightRow,
                item.total === 0 && styles.zeroRow,
              ]}
            >
              {COLUMNS.map((col) => {
                if (col.key === 'rank') {
                  return (
                    <View key={col.key} style={[styles.cellWrap, { width: col.width }]}>
                      <View style={[styles.rankTag, rankTagStyle(item.rank)]}>
                        <Text
                          style={[
                            styles.rankTagText,
                            item.rank <= 3 && styles.rankTagTextOnColor,
                          ]}
                        >
                          {item.rank}
                        </Text>
                      </View>
                    </View>
                  );
                }
                if (col.key === 'name') {
                  return (
                    <TouchableOpacity
                      key={col.key}
                      style={{ width: col.width }}
                      onPress={() => openUnitDetail(item)}
                    >
                      <Text style={[styles.cellText, styles.textLeft, styles.linkText]}>
                        {item.departmentName}
                      </Text>
                    </TouchableOpacity>
                  );
                }
                if (col.key === 'level') {
                  return (
                    <View key={col.key} style={[styles.cellWrap, { width: col.width }]}>
                      <View style={[styles.levelBadge, LEVEL_BADGE_STYLE[item.activeLevel]]}>
                        <Text style={styles.levelBadgeText}>{ACTIVE_LEVEL_LABEL[item.activeLevel]}</Text>
                      </View>
                    </View>
                  );
                }
                if (col.key === 'action') {
                  return (
                    <TouchableOpacity
                      key={col.key}
                      style={[styles.cellWrap, { width: col.width }]}
                      onPress={() => openUnitDetail(item)}
                    >
                      <Eye size={16} color={APP_COLORS.primary} />
                    </TouchableOpacity>
                  );
                }
                return (
                  <Text
                    key={col.key}
                    style={[
                      styles.cellText,
                      { width: col.width },
                      col.align === 'left' && styles.textLeft,
                      col.align === 'right' && styles.textRight,
                      col.key === 'conHieuLuc' && styles.textSuccess,
                    ]}
                  >
                    {renderCell(col, item)}
                  </Text>
                );
              })}
            </View>
          ))
        )}
      </View>
    </ScrollView>

    {filteredStats.length > 0 && (
      <View style={styles.paginationFooter}>
        <View style={styles.pageSizeRow}>
          <Text style={styles.pageSizeLabel}>Số dòng / trang:</Text>
          {pageSizeOptions.map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.pageSizeChip, pageSize === size && styles.pageSizeChipActive]}
              onPress={() => setPageSize(size)}
            >
              <Text
                style={[styles.pageSizeChipText, pageSize === size && styles.pageSizeChipTextActive]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.pageNav}>
          <TouchableOpacity
            style={styles.pageNavButton}
            onPress={goPrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft
              size={18}
              color={currentPage === 1 ? APP_COLORS.chatIconMuted : APP_COLORS.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.pageInfo}>
            Trang <Text style={styles.counterBold}>{currentPage}</Text> / {totalPages}
          </Text>
          <TouchableOpacity
            style={styles.pageNavButton}
            onPress={goNextPage}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight
              size={18}
              color={currentPage >= totalPages ? APP_COLORS.chatIconMuted : APP_COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>
    )}
  </View>
);

export default StatsTable;
