import React from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { topListCardStyles as styles } from './TopListCard.styles';

import type { ApiDashboardUserItem } from '@/types';

export interface TopListColumn {
  key: string;
  label: string;
  flex: number;
  align?: 'left' | 'center';
  render: (item: ApiDashboardUserItem) => string;
}

export interface TopListCardProps {
  title: string;
  emptyText: string;
  columns: TopListColumn[];
  fullList: ApiDashboardUserItem[];
  displayList: ApiDashboardUserItem[];
}

// Generic "Top 5" ranked table card — backs both "Top 5 đơn vị" and
// "Top 5 người dùng" on pmbc_web's dashboard-user screen (`.du-bottom-row`
// first two cards), same columns-as-data shape so the two only differ by
// their `columns` + title text. Mobile always shows the top 5 only — no
// expand-to-full-list toggle.
const TopListCard: React.FC<TopListCardProps> = ({
  title,
  emptyText,
  columns,
  fullList,
  displayList,
}) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>

    {fullList.length === 0 ? (
      <Text style={styles.emptyText}>{emptyText}</Text>
    ) : (
      <>
        <View style={styles.headerRow}>
          {columns.map((col) => (
            <Text
              key={col.key}
              style={[styles.headerCell, { flex: col.flex }]}
              numberOfLines={1}
            >
              {col.label}
            </Text>
          ))}
        </View>

        {/* Card now fills the screen's remaining height (see `bottomRow`
            in DashboardUserStatsScreen.styles.ts), so the row list scrolls
            internally instead of growing the page. */}
        <ScrollView style={styles.listScroll}>
          {displayList.map((item, index) => (
            <View key={`${item.sttExport}-${index}`} style={styles.row}>
              {columns.map((col) => (
                <Text
                  key={col.key}
                  style={[
                    styles.cell,
                    { flex: col.flex },
                    col.align === 'left' && styles.cellLeft,
                    col.key === 'rank' && styles.rankBadge,
                  ]}
                  numberOfLines={1}
                >
                  {col.render(item)}
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>
      </>
    )}
  </View>
);

export default TopListCard;
