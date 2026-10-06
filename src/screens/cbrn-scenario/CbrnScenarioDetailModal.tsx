import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';

import { cbrnScenarioDetailModalStyles as styles } from './CbrnScenarioDetailModal.styles';
import DownloadFileButton from '../meeting-room/DownloadFileButton';

import type { PmbcKichBanUngPhoCbrnItem } from '@/types';

export interface CbrnScenarioDetailModalProps {
  item: PmbcKichBanUngPhoCbrnItem | null;
  onClose: () => void;
}

const formatDate = (raw?: string): string => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const CbrnScenarioDetailModal: React.FC<CbrnScenarioDetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const isActive = item.trang_thai === 1;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {item.ten_kich_ban_cbrn || '(Chưa có tên)'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            <View style={styles.field}>
              <Text style={styles.label}>Trạng thái</Text>
              <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusInactive]}>
                <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextInactive]}>
                  {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                </Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mô tả</Text>
              <Text style={styles.value}>{item.mo_ta_kich_ban || 'Không có mô tả'}</Text>
            </View>

            {!!item.file_dinh_kem && (
              <View style={styles.field}>
                <Text style={styles.label}>File đính kèm</Text>
                <View style={styles.attachmentRow}>
                  <DownloadFileButton fileName={item.file_dinh_kem} />
                </View>
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>Thời gian tạo</Text>
              <Text style={styles.value}>{formatDate(item.time_created)}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Người tạo</Text>
              <Text style={styles.value}>{item.user_createdST || '—'}</Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CbrnScenarioDetailModal;
