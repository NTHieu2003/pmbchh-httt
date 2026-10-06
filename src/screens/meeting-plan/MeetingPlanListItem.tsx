import React from 'react';
import { GestureResponderEvent, Text, TouchableOpacity, View } from 'react-native';
import { MoreVertical } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import { meetingPlanListItemStyles as styles } from './MeetingPlanListItem.styles';

import type { KhtochuchopItem } from '@/types';

export interface MeetingPlanListItemProps {
  item: KhtochuchopItem;
  onOpenMenu: (event: GestureResponderEvent, item: KhtochuchopItem) => void;
}

const formatDateTime = (raw?: string): string => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

// Mirrors pmbc_web's "Thống kê công tác chuẩn bị" list row — tiêu đề/loại
// cuộc họp/thời gian/địa điểm, actions ("Tham gia cuộc họp"/"Xem thông
// tin") moved into a kebab popover instead of web's row dropdown menu.
const MeetingPlanListItem: React.FC<MeetingPlanListItemProps> = ({ item, onOpenMenu }) => (
  <View style={styles.row}>
    <View style={styles.left}>
      <Text style={styles.title} numberOfLines={1}>
        {item.khp_tieude || '(Chưa có tiêu đề)'}
      </Text>
      {!!item.khp_loaicuochopST && (
        <Text style={styles.type} numberOfLines={1}>
          {item.khp_loaicuochopST}
        </Text>
      )}
      <Text style={styles.time} numberOfLines={1}>
        {formatDateTime(item.khp_thoigiantu)} – {formatDateTime(item.khp_thoigianden)}
      </Text>
      {!!item.khp_diadiemST && (
        <Text style={styles.diadiem} numberOfLines={1}>
          {item.khp_diadiemST}
        </Text>
      )}
    </View>

    <View style={styles.right}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={(event) => onOpenMenu(event, item)}
        hitSlop={8}
      >
        <MoreVertical size={20} color={APP_COLORS.chatIconMuted} />
      </TouchableOpacity>
    </View>
  </View>
);

export default MeetingPlanListItem;
