import React from 'react';
import { Text, View } from 'react-native';

import { kpiCardStyles as styles } from './KpiCard.styles';

export interface KpiCardProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconBgColor: string;
  title: string;
  value: string;
  footer: string;
}

// One KPI tile — matches web's `.metric-card` (icon box, label, big value,
// footer line). `value`/`footer` are pre-formatted strings since one card
// (đơn vị tích cực nhất) shows a department name, not a number.
const KpiCard: React.FC<KpiCardProps> = ({ icon: Icon, iconBgColor, title, value, footer }) => (
  <View style={styles.card}>
    <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
      <Icon size={22} color="#ffffff" />
    </View>
    <View style={styles.textWrap}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.footer} numberOfLines={1}>
        {footer}
      </Text>
    </View>
  </View>
);

export default KpiCard;
