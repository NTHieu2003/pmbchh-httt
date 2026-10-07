import React from 'react';
import { Text, View } from 'react-native';

import { activeContributorsListStyles as styles } from './ActiveContributorsList.styles';
import { formatNumber } from './statsCompute';

import type { ActiveContributor } from './buildStatsStatic';

export interface ActiveContributorsListProps {
  contributors: ActiveContributor[];
  // Shows a "Dữ liệu mẫu" chip next to the title while the data is static.
  isSample?: boolean;
}

const RANK_BADGE_STYLE = [styles.rankBadgeGold, styles.rankBadgeSilver, styles.rankBadgeBronze];

// yyyy-mm-dd → dd/mm/yyyy (same display format as the rest of the app).
const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
};

// Ranked by number of documents built, highest first — top 3 get the same
// gold/silver/bronze badges as the Top-5 unit grid above.
const ActiveContributorsList: React.FC<ActiveContributorsListProps> = ({
  contributors,
  isSample,
}) => {
  const sorted = [...contributors].sort((a, b) => b.documentCount - a.documentCount);

  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Người dùng tích cực xây dựng dữ liệu</Text>
        {isSample && (
          <View style={styles.sampleChip}>
            <Text style={styles.sampleChipText}>Dữ liệu mẫu</Text>
          </View>
        )}
      </View>

      <View style={styles.headerRow}>
        <Text style={[styles.headerText, styles.colRank]}>#</Text>
        <Text style={[styles.headerText, styles.colName]}>Họ và tên</Text>
        <Text style={[styles.headerText, styles.colDept]}>Đơn vị</Text>
        <Text style={[styles.headerText, styles.colCount]}>Số VB</Text>
        <Text style={[styles.headerText, styles.colDate]}>Cập nhật gần nhất</Text>
      </View>

      {sorted.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có người dùng nào xây dựng dữ liệu.</Text>
      ) : (
        sorted.map((user, index) => (
          <View key={user.userId} style={styles.row}>
            <View style={styles.colRank}>
              <View style={[styles.rankBadge, RANK_BADGE_STYLE[index]]}>
                <Text style={[styles.rankText, index < 3 && styles.rankTextTop]}>{index + 1}</Text>
              </View>
            </View>
            <Text style={[styles.nameText, styles.colName]} numberOfLines={1}>
              {user.fullName}
            </Text>
            <Text style={[styles.cellText, styles.colDept]} numberOfLines={1}>
              {user.departmentName}
            </Text>
            <Text style={[styles.countText, styles.colCount]}>
              {formatNumber(user.documentCount)}
            </Text>
            <Text style={[styles.cellText, styles.colDate]}>
              {formatDate(user.lastContributionAt)}
            </Text>
          </View>
        ))
      )}
    </View>
  );
};

export default ActiveContributorsList;
