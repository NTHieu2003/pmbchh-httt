import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

import { APP_COLORS } from '@/theme';

import FormCard from './FormCard';
import { NumberField } from './FormField';
import { atmosphericFormCardStyles as styles } from './AtmosphericFormCard.styles';

import type { Insolation } from '../simulation';

export interface AtmosphericFormCardProps {
  windSpeed: number;
  onChangeWindSpeed: (value: number) => void;
  calculatedStability: string;
  windDirTo: number;
  onChangeWindDirTo: (value: number) => void;
  isDaytime: boolean;
  onChangeIsDaytime: (value: boolean) => void;
  insolation: Insolation;
  onChangeInsolation: (value: Insolation) => void;
  cloudCoverPct: number;
  onChangeCloudCoverPct: (value: number) => void;
  ambientTemp: number;
  onChangeAmbientTemp: (value: number) => void;
}

const INSOLATION_OPTIONS: { key: Insolation; label: string }[] = [
  { key: 'manh', label: 'Mạnh' },
  { key: 'vua', label: 'Vừa' },
  { key: 'nhe', label: 'Nhẹ' },
];

// Web only offers two fixed cloud-cover buckets, not a free number.
const CLOUD_COVER_OPTIONS: { value: number; label: string }[] = [
  { value: 30, label: 'Ít mây (<50%)' },
  { value: 70, label: 'Nhiều mây (>50%)' },
];

// Card "2 ĐIỀU KIỆN KHÍ QUYỂN".
const AtmosphericFormCard: React.FC<AtmosphericFormCardProps> = ({
  windSpeed,
  onChangeWindSpeed,
  calculatedStability,
  windDirTo,
  onChangeWindDirTo,
  isDaytime,
  onChangeIsDaytime,
  insolation,
  onChangeInsolation,
  cloudCoverPct,
  onChangeCloudCoverPct,
  ambientTemp,
  onChangeAmbientTemp,
}) => (
  <FormCard number={2} title="ĐIỀU KIỆN KHÍ QUYỂN">
    <View style={styles.windRow}>
      <View style={styles.windInputWrap}>
        <NumberField
          label="Tốc độ gió (m/s, tại 10m)"
          value={windSpeed}
          onChangeValue={onChangeWindSpeed}
        />
      </View>
      <View style={styles.stabilityBadge}>
        <Text style={styles.stabilityBadgeText}>{calculatedStability}</Text>
      </View>
    </View>

    <NumberField
      label="Hướng gió thổi tới (° la bàn, 0=Bắc, 90=Đông...)"
      value={windDirTo}
      onChangeValue={onChangeWindDirTo}
      hint="Lớp ổn định Pasquill — tự tính từ gió + bức xạ/mây. Hướng gió định hướng vùng trên bản đồ."
    />

    <NumberField
      label="Nhiệt độ môi trường (K)"
      value={ambientTemp}
      onChangeValue={onChangeAmbientTemp}
      hint={
        'Dùng chung cho các kịch bản #1 Direct, #2 Vũng, #3 Bồn lỏng rò rỉ, #5 Đường ống ' +
        '(tự tính lại áp suất hơi theo nhiệt độ này bằng Clausius-Clapeyron). Riêng #4 Bồn quá nhiệt có ô nhiệt độ RIÊNG.'
      }
    />

    <View style={styles.toggleRow}>
      <Switch
        value={isDaytime}
        onValueChange={onChangeIsDaytime}
        trackColor={{ true: APP_COLORS.chatBrandRed, false: APP_COLORS.chatBorder }}
        thumbColor={APP_COLORS.white}
      />
      <Text style={styles.toggleLabel}>Ban ngày</Text>
    </View>

    {isDaytime ? (
      <View>
        <Text style={styles.pillGroupLabel}>Bức xạ mặt trời</Text>
        <View style={styles.pillRow}>
          {INSOLATION_OPTIONS.map((opt) => {
            const isActive = opt.key === insolation;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => onChangeInsolation(opt.key)}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    ) : (
      <View>
        <Text style={styles.pillGroupLabel}>Độ che phủ mây</Text>
        <View style={styles.pillRow}>
          {CLOUD_COVER_OPTIONS.map((opt) => {
            const isActive = opt.value === cloudCoverPct;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => onChangeCloudCoverPct(opt.value)}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    )}
  </FormCard>
);

export default AtmosphericFormCard;
