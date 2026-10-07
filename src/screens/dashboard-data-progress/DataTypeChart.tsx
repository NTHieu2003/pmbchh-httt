import React, { useMemo } from 'react';

import { HorizontalBarChart } from '@/components/HorizontalBarChart';

import { dataTypeChartStyles as styles } from './DataTypeChart.styles';

import type { DataTypeStat } from './buildStatsStatic';

export interface DataTypeChartProps {
  stats: DataTypeStat[];
  isSample?: boolean;
}

// "Loại dữ liệu đã được xây dựng" — document counts per type.
const DataTypeChart: React.FC<DataTypeChartProps> = ({ stats, isSample }) => {
  const items = useMemo(
    () => stats.map((s) => ({ key: s.code, label: s.label, value: s.count })),
    [stats]
  );

  return (
    <HorizontalBarChart
      title="Loại dữ liệu đã được xây dựng"
      items={items}
      unit="văn bản"
      isSample={isSample}
      style={styles.card}
    />
  );
};

export default DataTypeChart;
