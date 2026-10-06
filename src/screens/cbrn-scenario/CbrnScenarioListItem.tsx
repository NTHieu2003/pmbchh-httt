import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Link2, Paperclip } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import { cbrnScenarioListItemStyles as styles } from './CbrnScenarioListItem.styles';

import type { PmbcKichBanUngPhoCbrnItem } from '@/types';

export interface CbrnScenarioListItemProps {
  item: PmbcKichBanUngPhoCbrnItem;
  onPress: (item: PmbcKichBanUngPhoCbrnItem) => void;
  // "Đính kèm kịch bản ứng phó" — matches web's per-row action that opens
  // the attach-thhl dialog (CbrnScenarioAttachModal).
  onAttach: (item: PmbcKichBanUngPhoCbrnItem) => void;
}

const formatDate = (raw?: string): string => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

// Same flat-list layout (90/10 split, bottom border, no card) and per-line
// style roles as the "Lĩnh vực Chatbot" screen — left: tên kịch bản + file
// đính kèm (bold, primary) / người tạo - thời gian tạo (muted, small) /
// mô tả (italic, muted, full wrap, never truncated); right: trạng thái
// badge. No edit/delete (H.II.130 is view-only); tapping opens the detail
// modal.
const CbrnScenarioListItem: React.FC<CbrnScenarioListItemProps> = ({ item, onPress, onAttach }) => {
  const isActive = item?.trang_thai === 1;

  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(item)} activeOpacity={0.6}>
      <View style={styles.left}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.ten_kich_ban_cbrn || '(Chưa có tên)'}
          </Text>
          {!!item?.file_dinh_kem && (
            <View style={styles.fileBadge}>
              <Paperclip size={12} color={APP_COLORS.chatIconMuted} />
              <Text style={styles.fileText} numberOfLines={1}>
                {item?.file_dinh_kem}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.meta} numberOfLines={1}>
          {item?.user_createdST || '—'} - {formatDate(item?.time_created)}
        </Text>

        <Text style={styles.moTa}>{item?.mo_ta_kich_ban || 'Không có mô tả'}</Text>
      </View>

      <View style={styles.right}>
        <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusInactive]}>
          <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextInactive]}>
            {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() => onAttach?.(item)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Link2 size={13} color={APP_COLORS.primary} />
          <Text style={styles.attachButtonText}>Đính kèm</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default CbrnScenarioListItem;
