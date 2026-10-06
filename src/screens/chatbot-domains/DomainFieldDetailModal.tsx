import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';

import { domainFieldDetailModalStyles as styles } from './DomainFieldDetailModal.styles';

import type { PmbcQuanLyLinhVucChatbotItem } from '@/types';

export interface DomainFieldDetailModalProps {
  item: PmbcQuanLyLinhVucChatbotItem | null;
  onClose: () => void;
}

const DomainFieldDetailModal: React.FC<DomainFieldDetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const isActive = item.trangThai === 1;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {item.tenLinhVuc || '(Chưa có tên lĩnh vực)'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            <View style={styles.field}>
              <Text style={styles.label}>Ngành đặc thù</Text>
              <Text style={styles.value}>{item.nganhDacThuST || '—'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mã lĩnh vực</Text>
              <Text style={styles.value}>{item.maLinhVuc || '—'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Trạng thái</Text>
              <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusInactive]}>
                <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextInactive]}>
                  {isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mô tả</Text>
              <Text style={styles.value}>{item.moTa || 'Không có mô tả'}</Text>
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

export default DomainFieldDetailModal;
