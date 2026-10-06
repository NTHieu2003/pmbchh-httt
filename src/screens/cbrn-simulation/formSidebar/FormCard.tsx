import React from 'react';
import { Text, View } from 'react-native';

import { formCardStyles as styles } from './FormCard.styles';

export interface FormCardProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

// Matches the web reference's numbered card header ("1 HÓA CHẤT", "2 ĐIỀU
// KIỆN KHÍ QUYỂN", ...).
const FormCard: React.FC<FormCardProps> = ({ number, title, children }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{number}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
    <View style={styles.body}>{children}</View>
  </View>
);

export default FormCard;
