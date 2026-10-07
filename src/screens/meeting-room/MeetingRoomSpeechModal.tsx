import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { MessageSquare, Plus, RotateCcw, Share2, Trash2 } from 'lucide-react-native';

import { AppModal, AppModalButton } from '@/components/AppModal';
import { appAlert } from '@/components/AppDialog';
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
      appAlert('Lỗi', 'Không thể cập nhật trạng thái. Vui lòng thử lại.');
    } finally {
      setPendingActionGid(null);
    }
  };

  const handleDelete = (item: TaiLieuChuongTrinhHopItem) => {
    appAlert('Xóa nội dung phát biểu', 'Bạn có chắc chắn xóa bản ghi được chọn?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          setPendingActionGid(item.gid);
          try {
            await onDelete(item);
          } catch {
            appAlert('Lỗi', 'Không thể xóa. Vui lòng thử lại.');
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
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <View style={styles.rowBody}>
          <Text style={styles.speaker}>{speakerName(item)}</Text>
          <View style={styles.metaRow}>
            {!!item.thoigian && <Text style={styles.meta}>{item.thoigian} phút</Text>}
            <View style={[styles.statusPill, isPublished && styles.statusPillPublished]}>
              <Text style={[styles.statusText, isPublished && styles.statusTextPublished]}>
                {isPublished ? 'Đã công bố' : 'Chưa công bố'}
              </Text>
            </View>
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
      <View style={styles.indexBadge}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.speaker}>{speakerName(item)}</Text>
        {!!item.thoigian && <Text style={styles.meta}>{item.thoigian} phút</Text>}
        {!!item.noidung && <Text style={styles.content}>{item.noidung}</Text>}
        {!!item.filedinhkem && <DownloadFileButton fileName={item.filedinhkem} />}
      </View>
    </View>
  );

  return (
    <AppModal
      visible
      onClose={onClose}
      icon={MessageSquare}
      title="Nội dung bài phát biểu"
      subtitle="Phát biểu cá nhân và nội dung đã công bố"
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
            <Text style={styles.columnTitle}>Nội dung bài phát biểu cá nhân</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsCreateOpen(true)}
              hitSlop={8}
            >
              <Plus size={14} color={APP_COLORS.primary} />
              <Text style={styles.addButtonText}>Thêm</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            style={styles.list}
            data={personalItems}
            keyExtractor={(item) => String(item.gid)}
            renderItem={renderPersonalItem}
            ListEmptyComponent={<Text style={styles.emptyText}>Không có nội dung.</Text>}
          />
        </View>
        <View style={styles.column}>
          <View style={styles.columnHeader}>
            <Text style={styles.columnTitle}>Nội dung bài phát biểu</Text>
          </View>
          <FlatList
            style={styles.list}
            data={publishedItems}
            keyExtractor={(item) => String(item.gid)}
            renderItem={renderPublishedItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Chưa có nội dung phát biểu nào được công bố.</Text>
            }
          />
        </View>
      </View>

      {/* Rendered inside this dialog's tree so its Modal nests in ours
          (iOS can't present two sibling Modals at once). */}
      <MeetingRoomCreateSpeechModal
        visible={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        participants={participants}
        onSubmit={onCreate}
      />
    </AppModal>
  );
};

export default MeetingRoomSpeechModal;
