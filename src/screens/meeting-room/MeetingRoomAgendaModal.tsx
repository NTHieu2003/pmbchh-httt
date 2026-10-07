import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ListOrdered } from 'lucide-react-native';

import { AppModal, AppModalButton } from '@/components/AppModal';

import { meetingRoomAgendaModalStyles as styles } from './MeetingRoomAgendaModal.styles';

import type { TaiLieuChuongTrinhHopItem } from '@/types';

export interface MeetingRoomAgendaModalProps {
  visible: boolean;
  onClose: () => void;
  items: TaiLieuChuongTrinhHopItem[];
  currentIndex: number | null;
  onSelect: (index: number) => void;
}

const formatTime = (raw?: string): string => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '—';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// "Chương trình" — mirrors pmbc_mobile's CTH dialog exactly: a Thời gian |
// Nội dung table, items before the current one in bold (already covered),
// the current one highlighted, items after shown in italic (upcoming).
const MeetingRoomAgendaModal: React.FC<MeetingRoomAgendaModalProps> = ({
  visible,
  onClose,
  items,
  currentIndex,
  onSelect,
}) => {
  if (!visible) return null;

  return (
    <AppModal
      visible
      onClose={onClose}
      icon={ListOrdered}
      title="Chương trình họp"
      subtitle={`${items.length} nội dung`}
      size="md"
      // FlatList fills the card — AppModal's own ScrollView is turned off.
      scrollable={false}
      heightRatio={0.75}
      footer={<AppModalButton label="Đóng" onPress={onClose} />}
    >
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.timeCol]}>Thời gian</Text>
        <Text style={[styles.tableHeaderText, styles.contentCol]}>Nội dung</Text>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={items}
        keyExtractor={(item) => String(item.gid)}
        renderItem={({ item, index }) => {
          const isCurrent = index === currentIndex;
          const isCovered = currentIndex != null && index < currentIndex;
          return (
            <TouchableOpacity
              style={[styles.row, isCurrent && styles.rowCurrent]}
              onPress={() => onSelect(index)}
              activeOpacity={0.6}
            >
              <View style={styles.timeCol}>
                <View style={[styles.timePill, isCurrent && styles.timePillCurrent]}>
                  <Text
                    style={[
                      styles.timeText,
                      isCovered && styles.textCovered,
                      isCurrent && styles.textCurrent,
                    ]}
                  >
                    {formatTime(item.thoigiantu)} - {formatTime(item.thoigianden)}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.contentCol,
                  styles.contentText,
                  isCovered && styles.textCovered,
                  isCurrent && styles.textCurrent,
                  !isCovered && !isCurrent && styles.textUpcoming,
                ]}
              >
                {item.tentailieu}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có chương trình họp.</Text>}
      />
    </AppModal>
  );
};

export default MeetingRoomAgendaModal;
