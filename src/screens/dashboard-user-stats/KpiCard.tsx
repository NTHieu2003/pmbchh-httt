import React from 'react';
import { Text, View } from 'react-native';

import { APP_COLORS } from '@/theme';

import { formatNumber, growthColor, growthShortText } from './growthFormat';
import { kpiCardStyles as styles } from './KpiCard.styles';

export interface KpiCardProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconBgColor: string;
  title: string;
  value: number;
  growth: number | null;
}

// One KPI tile — matches pmbc_web's `.du-kpi` card (icon circle, title,
// value). Growth is shown inline next to the number as `value (↑X%)`
// rather than as a separate footer line.
const KpiCard: React.FC<KpiCardProps> = ({ icon: Icon, iconBgColor, title, value, growth }) => (
  <View style={styles.card}>
    <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
      <Icon size={22} color={APP_COLORS.white} />
    </View>
    <View style={styles.textWrap}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{formatNumber(value)}</Text>
        <Text style={[styles.growthInline, { color: growthColor(growth, APP_COLORS.chatSubtitle) }]}>
          ({growthShortText(growth)})
        </Text>
      </View>
    </View>
  </View>
);

export default KpiCard;
