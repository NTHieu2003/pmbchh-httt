import React, { useMemo } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { horizontalBarChartStyles as styles } from './HorizontalBarChart.styles';

export interface HorizontalBarChartItem {
  key: string;
  label: string;
  value: number;
}

export interface HorizontalBarChartProps {
  title: string;
  items: HorizontalBarChartItem[];
  // Unit shown in the "Tổng cộng N <unit>" subtitle, e.g. "văn bản".
  unit: string;
  // Shows a "Dữ liệu mẫu" chip next to the title while data is static.
  isSample?: boolean;
  emptyText?: string;
  // Width of the category-label column — widen for long labels.
  labelWidth?: number;
  // Card sizing in its parent row (flexBasis/minWidth etc.).
  style?: StyleProp<ViewStyle>;
}

const formatNumber = (n: number) => n.toLocaleString('vi-VN');

// Card with a horizontal bar chart (magnitude by category) — one hue,
// sorted descending, every bar labeled with its value + share, so no
// legend or tooltip is needed. Plain Views, no SVG: each bar is a
// width-percent fill inside a fixed track, rounded only at the data end.
const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  title,
  items,
  unit,
  isSample,
  emptyText = 'Chưa có dữ liệu.',
  labelWidth = 110,
  style,
}) => {
  const { sorted, total, max } = useMemo(() => {
    const s = [...items].sort((a, b) => b.value - a.value);
    return {
      sorted: s,
      total: s.reduce((sum, item) => sum + item.value, 0),
      max: s[0]?.value ?? 0,
    };
  }, [items]);

  return (
    <View style={[styles.section, style]}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {isSample && (
          <View style={styles.sampleChip}>
            <Text style={styles.sampleChipText}>Dữ liệu mẫu</Text>
          </View>
        )}
      </View>
      <Text style={styles.subtitle}>
        Tổng cộng {formatNumber(total)} {unit}
      </Text>

      {sorted.length === 0 ? (
        <Text style={styles.emptyText}>{emptyText}</Text>
      ) : (
        <View style={styles.chart}>
          {sorted.map((item) => {
            const widthPercent = max > 0 ? (item.value / max) * 100 : 0;
            const share = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
            return (
              <View key={item.key} style={styles.row}>
                <Text style={[styles.label, { width: labelWidth }]} numberOfLines={1}>
                  {item.label}
                </Text>
                <View style={styles.track}>
                  <View style={[styles.bar, { width: `${widthPercent}%` }]} />
                </View>
                <Text style={styles.value}>
                  {formatNumber(item.value)}
                  <Text style={styles.share}>{`  ${share}%`}</Text>
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default HorizontalBarChart;
