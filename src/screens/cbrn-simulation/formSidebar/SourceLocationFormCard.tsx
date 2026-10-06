import React from 'react';

import FormCard from './FormCard';
import { NumberField } from './FormField';

export interface SourceLocationFormCardProps {
  sourceLat: number;
  onChangeSourceLat: (value: number) => void;
  sourceLon: number;
  onChangeSourceLon: (value: number) => void;
}

// Card "3 VỊ TRÍ NGUỒN (ĐỂ VẼ BẢN ĐỒ)".
const SourceLocationFormCard: React.FC<SourceLocationFormCardProps> = ({
  sourceLat,
  onChangeSourceLat,
  sourceLon,
  onChangeSourceLon,
}) => (
  <FormCard number={3} title="VỊ TRÍ NGUỒN (ĐỂ VẼ BẢN ĐỒ)">
    <NumberField label="Vĩ độ (lat)" value={sourceLat} onChangeValue={onChangeSourceLat} />
    <NumberField
      label="Kinh độ (lon)"
      value={sourceLon}
      onChangeValue={onChangeSourceLon}
      hint="Mặc định: Hà Nội (21.0285, 105.8542). Nhập tọa độ thực tế của điểm nguồn sự cố."
    />
  </FormCard>
);

export default SourceLocationFormCard;
