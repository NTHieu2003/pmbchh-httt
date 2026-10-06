import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Bookmark, CircleCheckBig } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import { domainListItemStyles as styles } from './DomainListItem.styles';

import type { QlChuyenNganhDacThu } from '@/types';

export interface DomainListItemProps {
  item: QlChuyenNganhDacThu;
  isSelected: boolean;
  onPress: (gid: number) => void;
}

// One row in the right-panel "Ngành đặc thù" list — matches pmbc_web's
// `.knowledge-item` (chatbot.component.html, right sidebar section).
const DomainListItem: React.FC<DomainListItemProps> = ({
  item,
  isSelected,
  onPress,
}) => {
  const subtitle = item.viet_tat
    ? item.mo_ta
      ? `${item.viet_tat} - ${item.mo_ta}`
      : item.viet_tat
    : item.mo_ta || 'Dữ liệu ngành đặc thù';

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={() => onPress(item.gid)}
      activeOpacity={0.7}
    >
      <View style={styles.iconBadge}>
        <Bookmark size={16} color={APP_COLORS.chatBrandRed} />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {item.ten || '(Chưa có tên)'}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>

      {isSelected && (
        <CircleCheckBig size={18} color={APP_COLORS.chatBrandRed} />
      )}
    </TouchableOpacity>
  );
};

export default DomainListItem;
