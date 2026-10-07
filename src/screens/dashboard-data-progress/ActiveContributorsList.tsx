import React from 'react';
import { Text, View } from 'react-native';

import { activeContributorsListStyles as styles } from './ActiveContributorsList.styles';
import { formatNumber } from './statsCompute';

import type { NguoiDungTichCucItem } from '@/types';

export interface ActiveContributorsListProps {
  // Already ranked by the backend (tongDongGop, then soTaoMoi, then most
  // recent activity) — rendered in the order received.
  contributors: NguoiDungTichCucItem[];
}

const RANK_BADGE_STYLE = [styles.rankBadgeGold, styles.rankBadgeSilver, styles.rankBadgeBronze];

// "Người dùng tích cực xây dựng dữ liệu" (/apidashboarduser/
// getNguoiDungTichCuc) — top 3 get the same gold/silver/bronze badges as
// the Top-5 unit grid above.
const ActiveContributorsList: React.FC<ActiveContributorsListProps> = ({ contributors }) => (
  <View style={styles.section}>
    <View style={styles.titleRow}>
      <Text style={styles.title}>Người dùng tích cực xây dựng dữ liệu</Text>
    </View>

    <View style={styles.headerRow}>
      <Text style={[styles.headerText, styles.colRank]}>#</Text>
      <Text style={[styles.headerText, styles.colName]}>Họ và tên</Text>
      <Text style={[styles.headerText, styles.colDept]}>Đơn vị</Text>
      <Text style={[styles.headerText, styles.colCount]}>Tạo mới</Text>
      <Text style={[styles.headerText, styles.colCount]}>Cập nhật</Text>
      <Text style={[styles.headerText, styles.colCount]}>Tổng</Text>
      <Text style={[styles.headerText, styles.colDate]}>Hoạt động gần nhất</Text>
    </View>

    {contributors.length === 0 ? (
      <Text style={styles.emptyText}>Chưa có người dùng nào xây dựng dữ liệu trong kỳ.</Text>
    ) : (
      contributors.map((user, index) => (
        <View key={user.userId ?? user.userName ?? index} style={styles.row}>
          <View style={styles.colRank}>
            <View style={[styles.rankBadge, RANK_BADGE_STYLE[index]]}>
              <Text style={[styles.rankText, index < 3 && styles.rankTextTop]}>
                {user.sttExport ?? index + 1}
              </Text>
            </View>
          </View>
          <Text style={[styles.nameText, styles.colName]} numberOfLines={1}>
            {user.fullName || user.userName || '—'}
          </Text>
          <Text style={[styles.cellText, styles.colDept]} numberOfLines={1}>
            {user.deptName || '—'}
          </Text>
          <Text style={[styles.cellText, styles.colCount]}>{formatNumber(user.soTaoMoi ?? 0)}</Text>
          <Text style={[styles.cellText, styles.colCount]}>{formatNumber(user.soCapNhat ?? 0)}</Text>
          <Text style={[styles.countText, styles.colCount]}>
            {formatNumber(user.tongDongGop ?? 0)}
          </Text>
          <Text style={[styles.cellText, styles.colDate]}>{user.lanCuoiST || '—'}</Text>
        </View>
      ))
    )}
  </View>
);

export default ActiveContributorsList;
