import React, { useMemo } from 'react';

import { HorizontalBarChart } from '@/components/HorizontalBarChart';

import { dataTypeChartStyles as styles } from './DataTypeChart.styles';

import type { LoaiDuLieuItem } from '@/types';

export interface DataTypeChartProps {
  dataTypes: LoaiDuLieuItem[];
  // `tongDuLieu` — documents created in the period.
  total: number;
}

// "Loại dữ liệu đã được xây dựng" — documents created in the period per
// loại văn bản (/apidashboarduser/getLoaiDuLieu). The "Chưa phân loại"
// group has no `maLoai` and is shown like any other type.
const DataTypeChart: React.FC<DataTypeChartProps> = ({ dataTypes, total }) => {
  const items = useMemo(
    () =>
      dataTypes.map((item) => ({
        key: item.maLoai != null ? String(item.maLoai) : 'unclassified',
        label: item.tenLoai || 'Chưa phân loại',
        value: item.soDuLieu ?? 0,
        share: item.tyLe,
      })),
    [dataTypes]
  );

  return (
    <HorizontalBarChart
      title="Loại dữ liệu đã được xây dựng"
      items={items}
      total={total}
      unit="văn bản"
      emptyText="Chưa có văn bản nào được tạo trong kỳ."
      style={styles.card}
    />
  );
};

export default DataTypeChart;
