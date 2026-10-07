import React from 'react';
import { Text, View } from 'react-native';
import { BookOpen } from 'lucide-react-native';

import { AppModal, AppModalButton } from '@/components/AppModal';

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
    <AppModal
      visible
      onClose={onClose}
      icon={BookOpen}
      title={item.tenLinhVuc || '(Chưa có tên lĩnh vực)'}
      subtitle="Chi tiết lĩnh vực Chatbot"
      size="md"
      footer={<AppModalButton label="Đóng" onPress={onClose} />}
    >
      <View style={styles.fieldGrid}>
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
            <View style={[styles.statusDot, isActive ? styles.statusDotActive : styles.statusDotInactive]} />
            <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextInactive]}>
              {isActive ? 'Hoạt động' : 'Không hoạt động'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.descriptionBox}>
        <Text style={styles.label}>Mô tả</Text>
        <Text style={styles.value}>{item.moTa || 'Không có mô tả'}</Text>
      </View>
    </AppModal>
  );
};

export default DomainFieldDetailModal;
