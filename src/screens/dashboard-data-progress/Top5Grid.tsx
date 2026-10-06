import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { top5GridStyles as styles } from './Top5Grid.styles';

import type { DepartmentVanBanStats } from './statsCompute';

export interface Top5GridProps {
  units: DepartmentVanBanStats[];
  onPressUnit: (unit: DepartmentVanBanStats) => void;
}

const RANK_BADGE_STYLE = [styles.rankBadgeGold, styles.rankBadgeSilver, styles.rankBadgeBronze];

// Flat grid of cells — web's podium layout + the progress-bar ranking list
// are both dropped per explicit scope cut, kept only as a plain "Top 5"
// cell grid. Rank badge colors (gold/silver/bronze) and the "Xem chi tiết"
// button match web's podium card styling (`.podium-view-btn`, `.gold`).
const Top5Grid: React.FC<Top5GridProps> = ({ units, onPressUnit }) => (
  <View style={styles.section}>
    <Text style={styles.title}>🏆 VINH DANH CÁC ĐƠN VỊ TÍCH CỰC XÂY DỰNG DỮ LIỆU VĂN BẢN</Text>

    {units.length === 0 ? (
      <Text style={styles.emptyText}>Chưa có đơn vị nào xây dựng dữ liệu.</Text>
    ) : (
      <View style={styles.grid}>
        {units.map((unit, index) => (
          <View key={unit.departmentCode} style={styles.cell}>
            <View style={[styles.rankBadge, RANK_BADGE_STYLE[index]]}>
              <Text style={styles.rankBadgeText}>{index + 1}</Text>
            </View>
            <Text style={styles.name} numberOfLines={2}>
              {unit.departmentName}
            </Text>
            <Text style={styles.count}>{unit.total} văn bản</Text>
            <Text style={styles.percent}>{unit.percent}% tổng số</Text>

            <TouchableOpacity
              style={[styles.viewButton, index === 0 && styles.viewButtonGold]}
              onPress={() => onPressUnit(unit)}
            >
              <Text style={[styles.viewButtonText, index === 0 && styles.viewButtonTextGold]}>
                Xem chi tiết
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    )}
  </View>
);

export default Top5Grid;
