import React from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';

import { meetingRoomDocumentsModalStyles as styles } from './MeetingRoomDocumentsModal.styles';
import DownloadFileButton from './DownloadFileButton';

import type { TaiLieuChuongTrinhHopItem } from '@/types';

export interface MeetingRoomDocumentsModalProps {
  visible: boolean;
  onClose: () => void;
  personalDocuments: TaiLieuChuongTrinhHopItem[];
  sharedDocuments: TaiLieuChuongTrinhHopItem[];
}

const formatDate = (raw?: string): string => {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

// Mirrors pmbc_web's STT/NGƯỜI TẠO/TÊN TÀI LIỆU/NỘI DUNG/TÀI LIỆU ĐÍNH
// KÈM/THỜI GIAN table columns exactly (both the cá nhân and chung tables
// use the same shape there).
const renderItem = ({ item, index }: { item: TaiLieuChuongTrinhHopItem; index: number }) => (
  <View style={styles.row}>
    <Text style={styles.index}>{index + 1}.</Text>
    <View style={styles.rowBody}>
      <Text style={styles.name}>{item.tentailieu}</Text>
      {!!item.noidung && <Text style={styles.content}>{item.noidung}</Text>}
      <View style={styles.metaRow}>
        {!!item.nguoitaoST && <Text style={styles.meta}>Người tạo: {item.nguoitaoST}</Text>}
        {!!item.ngaytao && <Text style={styles.meta}>{formatDate(item.ngaytao)}</Text>}
      </View>
      {!!item.filedinhkem && <DownloadFileButton fileName={item.filedinhkem} />}
    </View>
  </View>
);

// "Tài liệu" — mirrors pmbc_mobile's Tài liệu dialog's two columns (tài
// liệu cá nhân / tài liệu chung), each downloadable via DownloadFileButton.
const MeetingRoomDocumentsModal: React.FC<MeetingRoomDocumentsModalProps> = ({
  visible,
  onClose,
  personalDocuments,
  sharedDocuments,
}) => {
  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Tài liệu cuộc họp</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.column}>
              <Text style={styles.columnTitle}>Tài liệu cá nhân</Text>
              <FlatList
                data={personalDocuments}
                keyExtractor={(item) => String(item.gid)}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>Không có tài liệu.</Text>}
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.columnTitle}>Tài liệu chung</Text>
              <FlatList
                data={sharedDocuments}
                keyExtractor={(item) => String(item.gid)}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>Không có tài liệu.</Text>}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default MeetingRoomDocumentsModal;
