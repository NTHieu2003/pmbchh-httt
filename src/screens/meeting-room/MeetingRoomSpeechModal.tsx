import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Plus, RotateCcw, Share2, Trash2, X } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import { meetingRoomSpeechModalStyles as styles } from './MeetingRoomSpeechModal.styles';
import DownloadFileButton from './DownloadFileButton';
import MeetingRoomCreateSpeechModal from './MeetingRoomCreateSpeechModal';

import type { TaiLieuChuongTrinhHopItem, ThanhPhanThamGiaItem } from '@/types';

export interface MeetingRoomSpeechModalProps {
  visible: boolean;
  onClose: () => void;
  personalItems: TaiLieuChuongTrinhHopItem[];
  publishedItems: TaiLieuChuongTrinhHopItem[];
  participants: ThanhPhanThamGiaItem[];
  onCreate: (input: {
    nguoithamgia: number;
    thoigian: number;
    noidung: string;
    filedinhkem?: string;
  }) => Promise<void>;
  onToggleStatus: (item: TaiLieuChuongTrinhHopItem) => Promise<void>;
  onDelete: (item: TaiLieuChuongTrinhHopItem) => Promise<void>;
}

// Mirrors pmbc_web's "NGƯỜI PHÁT BIỂU" cell: Đ/c + tên người tham gia nếu
// có, fallback về người tham gia khác, rồi về thành phần thứ 3.
const speakerName = (item: TaiLieuChuongTrinhHopItem): string => {
  if (item.userIdNguoiTGST) return `Đ/c ${item.userIdNguoiTGST}`;
  if (item.nguoithamgiakhacST) return `Đ/c ${item.nguoithamgiakhacST}`;
  return item.thanhphanthu3 || '—';
};

// "Phát biểu" — mirrors pmbc_web's noidungphatbieu-phonghop: 2 tables, "Nội
// dung bài phát biểu cá nhân" (của chính mình, mọi trạng thái, có nút "+"
// thêm mới + action chia sẻ/thu hồi/xóa) / "Nội dung bài phát biểu" (đã
// công bố, trangthai === 1, chỉ xem + tải).
const MeetingRoomSpeechModal: React.FC<MeetingRoomSpeechModalProps> = ({
  visible,
  onClose,
  personalItems,
  publishedItems,
  participants,
  onCreate,
  onToggleStatus,
  onDelete,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [pendingActionGid, setPendingActionGid] = useState<number | null>(null);

  if (!visible) return null;

  const handleToggle = async (item: TaiLieuChuongTrinhHopItem) => {
    setPendingActionGid(item.gid);
    try {
      await onToggleStatus(item);
    } catch {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái. Vui lòng thử lại.');
    } finally {
      setPendingActionGid(null);
    }
  };

  const handleDelete = (item: TaiLieuChuongTrinhHopItem) => {
    Alert.alert('Xóa nội dung phát biểu', 'Bạn có chắc chắn xóa bản ghi được chọn?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          setPendingActionGid(item.gid);
          try {
            await onDelete(item);
          } catch {
            Alert.alert('Lỗi', 'Không thể xóa. Vui lòng thử lại.');
          } finally {
            setPendingActionGid(null);
          }
        },
      },
    ]);
  };

  const renderPersonalItem = ({ item, index }: { item: TaiLieuChuongTrinhHopItem; index: number }) => {
    const isPending = pendingActionGid === item.gid;
    const isPublished = item.trangthai === 1;
    return (
      <View style={styles.row}>
        <Text style={styles.index}>{index + 1}.</Text>
        <View style={styles.rowBody}>
          <Text style={styles.speaker}>{speakerName(item)}</Text>
          <View style={styles.metaRow}>
            {!!item.thoigian && <Text style={styles.meta}>{item.thoigian} phút</Text>}
            <Text style={styles.meta}>{isPublished ? 'Đã công bố' : 'Chưa công bố'}</Text>
          </View>
          {!!item.noidung && <Text style={styles.content}>{item.noidung}</Text>}
          {!!item.filedinhkem && <DownloadFileButton fileName={item.filedinhkem} />}

          <View style={styles.actionsRow}>
            {isPending ? (
              <ActivityIndicator size="small" color={APP_COLORS.primary} />
            ) : (
              <>
                <TouchableOpacity style={styles.actionLink} onPress={() => handleToggle(item)}>
                  {isPublished ? (
                    <RotateCcw size={14} color={APP_COLORS.chatBrandRed} />
                  ) : (
                    <Share2 size={14} color={APP_COLORS.primary} />
                  )}
                  <Text
                    style={[styles.actionLinkText, isPublished && styles.actionLinkTextDanger]}
                  >
                    {isPublished ? 'Thu hồi' : 'Chia sẻ'}
                  </Text>
                </TouchableOpacity>

                {!isPublished && (
                  <TouchableOpacity style={styles.actionLink} onPress={() => handleDelete(item)}>
                    <Trash2 size={14} color={APP_COLORS.chatBrandRed} />
                    <Text style={[styles.actionLinkText, styles.actionLinkTextDanger]}>Xóa</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderPublishedItem = ({ item, index }: { item: TaiLieuChuongTrinhHopItem; index: number }) => (
    <View style={styles.row}>
      <Text style={styles.index}>{index + 1}.</Text>
      <View style={styles.rowBody}>
        <Text style={styles.speaker}>{speakerName(item)}</Text>
        {!!item.thoigian && <Text style={styles.meta}>{item.thoigian} phút</Text>}
        {!!item.noidung && <Text style={styles.content}>{item.noidung}</Text>}
        {!!item.filedinhkem && <DownloadFileButton fileName={item.filedinhkem} />}
      </View>
    </View>
  );

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Nội dung bài phát biểu</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.column}>
              <View style={styles.columnHeader}>
                <Text style={[styles.columnTitle, styles.columnTitleInHeader]}>
                  Nội dung bài phát biểu cá nhân
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setIsCreateOpen(true)}
                  hitSlop={8}
                >
                  <Plus size={16} color={APP_COLORS.primary} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={personalItems}
                keyExtractor={(item) => String(item.gid)}
                renderItem={renderPersonalItem}
                ListEmptyComponent={<Text style={styles.emptyText}>Không có nội dung.</Text>}
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.columnTitle}>Nội dung bài phát biểu</Text>
              <FlatList
                data={publishedItems}
                keyExtractor={(item) => String(item.gid)}
                renderItem={renderPublishedItem}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>Chưa có nội dung phát biểu nào được công bố.</Text>
                }
              />
            </View>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <MeetingRoomCreateSpeechModal
        visible={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        participants={participants}
        onSubmit={onCreate}
      />
    </Modal>
  );
};

export default MeetingRoomSpeechModal;
