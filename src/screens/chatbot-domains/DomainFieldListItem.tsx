import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { domainFieldListItemStyles as styles } from './DomainFieldListItem.styles';

import type { PmbcQuanLyLinhVucChatbotItem } from '@/types';

export interface DomainFieldListItemProps {
  item: PmbcQuanLyLinhVucChatbotItem;
  onPress: (item: PmbcQuanLyLinhVucChatbotItem) => void;
}

// One row — left (90%): ngành đặc thù / mã-tên lĩnh vực / mô tả (stacked,
// mô tả wraps fully, never truncated); right (10%): trạng thái badge. Rows
// are separated by a bottom border (flat list, not individual cards) per
// explicit mobile UI request — no edit/delete action, tapping just opens
// the detail modal (H.III.131 is view-only).
const DomainFieldListItem: React.FC<DomainFieldListItemProps> = ({ item, onPress }) => {
  const isActive = item.trangThai === 1;

  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(item)} activeOpacity={0.6}>
      <View style={styles.left}>
        <Text style={styles.nganh} numberOfLines={1}>
          {item.nganhDacThuST || '—'}
        </Text>
        <Text style={styles.linhVuc} numberOfLines={1}>
          {item.maLinhVuc || '—'} - {item.tenLinhVuc || '—'}
        </Text>
        <Text style={styles.moTa}>{item.moTa || 'Không có mô tả'}</Text>
      </View>

      <View style={styles.right}>
        <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusInactive]}>
          <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextInactive]}>
            {isActive ? 'Hoạt động' : 'Không hoạt động'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DomainFieldListItem;
