import React from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';

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
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Chương trình họp</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.timeCol]}>Thời gian</Text>
            <Text style={[styles.tableHeaderText, styles.contentCol]}>Nội dung</Text>
          </View>

          <FlatList
            style={styles.body}
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
                  <Text
                    style={[
                      styles.timeCol,
                      styles.timeText,
                      isCovered && styles.textCovered,
                      isCurrent && styles.textCurrent,
                    ]}
                  >
                    {formatTime(item.thoigiantu)} - {formatTime(item.thoigianden)}
                  </Text>
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

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default MeetingRoomAgendaModal;
