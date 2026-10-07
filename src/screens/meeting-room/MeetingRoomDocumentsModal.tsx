import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { FileText } from 'lucide-react-native';

import { AppModal, AppModalButton } from '@/components/AppModal';

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
    <View style={styles.indexBadge}>
      <Text style={styles.indexText}>{index + 1}</Text>
    </View>
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
    <AppModal
      visible
      onClose={onClose}
      icon={FileText}
      title="Tài liệu cuộc họp"
      subtitle="Tài liệu cá nhân và tài liệu chung"
      size="lg"
      // Two side-by-side FlatLists fill the card — AppModal's own
      // ScrollView is turned off.
      scrollable={false}
      heightRatio={0.75}
      footer={<AppModalButton label="Đóng" onPress={onClose} />}
    >
      <View style={styles.body}>
        <View style={styles.column}>
          <View style={styles.columnHeader}>
            <Text style={styles.columnTitle}>Tài liệu cá nhân</Text>
            <View style={styles.countPill}>
              <Text style={styles.countText}>{personalDocuments.length}</Text>
            </View>
          </View>
          <FlatList
            style={styles.list}
            data={personalDocuments}
            keyExtractor={(item) => String(item.gid)}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.emptyText}>Không có tài liệu.</Text>}
          />
        </View>
        <View style={styles.column}>
          <View style={styles.columnHeader}>
            <Text style={styles.columnTitle}>Tài liệu chung</Text>
            <View style={styles.countPill}>
              <Text style={styles.countText}>{sharedDocuments.length}</Text>
            </View>
          </View>
          <FlatList
            style={styles.list}
            data={sharedDocuments}
            keyExtractor={(item) => String(item.gid)}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.emptyText}>Không có tài liệu.</Text>}
          />
        </View>
      </View>
    </AppModal>
  );
};

export default MeetingRoomDocumentsModal;
