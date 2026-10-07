import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Check, Paperclip } from 'lucide-react-native';

import { TinhHuongHuanLuyenApi } from '@/api/tinhhuonghuanluyen';
import { appAlert } from '@/components/AppDialog';
import { AppModal, AppModalButton } from '@/components/AppModal';
import { APP_COLORS } from '@/theme';

import { cbrnScenarioAttachModalStyles as styles } from './CbrnScenarioAttachModal.styles';

import type { PmbcKichBanUngPhoCbrnItem, TinhHuongHuanLuyenItem } from '@/types';

export interface CbrnScenarioAttachModalProps {
  item: PmbcKichBanUngPhoCbrnItem | null;
  onClose: () => void;
  onSaved: () => void;
}

// "Đính kèm kịch bản ứng phó sự cố" — matches pmbc_web's attach-thhl dialog
// (features/quanlykho/pmbc-kichbanungphocbrn/attach-thhl): a per-row action
// on the scenario list that links/unlinks "Tình huống huấn luyện" (training
// situation) records to this kịch bản via `attachKbup`. Web's table has no
// search box wired up (its `keyword` field is read but never bound to an
// input), so this mirrors that — just the list + checkboxes + Lưu/Hủy bỏ.
const CbrnScenarioAttachModal: React.FC<CbrnScenarioAttachModalProps> = ({
  item,
  onClose,
  onSaved,
}) => {
  const [situations, setSituations] = useState<TinhHuongHuanLuyenItem[]>([]);
  const [selectedGids, setSelectedGids] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!item) return;
    setIsLoading(true);
    TinhHuongHuanLuyenApi.search({ tu_khoa: '', pageIndex: 0, pageSize: 1000 })
      .then((res) => {
        const list = res.lstTinhHuongHuanLuyen ?? [];
        setSituations(list);
        setSelectedGids(
          new Set(list.filter((row) => row.kbupid === item.gid).map((row) => row.gid))
        );
      })
      .catch(() => setSituations([]))
      .finally(() => setIsLoading(false));
  }, [item]);

  if (!item) return null;

  const toggle = (gid: number) => {
    setSelectedGids((prev) => {
      const next = new Set(prev);
      if (next.has(gid)) next.delete(gid);
      else next.add(gid);
      return next;
    });
  };

  const onSave = () => {
    if (selectedGids.size === 0) {
      appAlert('Thông báo', 'Chọn ít nhất 1 tình huống huấn luyện.');
      return;
    }
    setIsSaving(true);
    TinhHuongHuanLuyenApi.attachKbup(item.gid, Array.from(selectedGids))
      .then((success) => {
        if (!success) throw new Error('attach failed');
        appAlert('Thông báo', 'Đính kèm kịch bản ứng phó thành công.');
        onSaved();
        onClose();
      })
      .catch(() => appAlert('Lỗi', 'Đính kèm thất bại. Vui lòng thử lại.'))
      .finally(() => setIsSaving(false));
  };

  // Fixed-height card (the FlatList fills it and scrolls itself); backdrop
  // dismiss is off so a stray tap doesn't drop the checkbox selection.
  return (
    <AppModal
      visible
      onClose={onClose}
      icon={Paperclip}
      title="Đính kèm kịch bản ứng phó sự cố"
      subtitle={item.ten_kich_ban_cbrn || undefined}
      size="md"
      heightRatio={0.8}
      scrollable={false}
      dismissOnBackdrop={false}
      footer={
        <>
          <AppModalButton label="Hủy bỏ" onPress={onClose} disabled={isSaving} />
          <AppModalButton
            label="Lưu"
            variant="primary"
            icon={Check}
            loading={isSaving}
            onPress={onSave}
          />
        </>
      }
    >
      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={APP_COLORS.primary} />
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={situations}
          keyExtractor={(row) => String(row.gid)}
          ListHeaderComponent={
            situations.length > 0 ? (
              <Text style={styles.listHeader}>
                Tình huống huấn luyện · đã chọn {selectedGids.size}/{situations.length}
              </Text>
            ) : undefined
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có tình huống huấn luyện nào.</Text>
          }
          renderItem={({ item: row }) => {
            const isSelected = selectedGids.has(row.gid);
            return (
              <TouchableOpacity
                style={[styles.row, isSelected && styles.rowSelected]}
                activeOpacity={0.7}
                onPress={() => toggle(row.gid)}
              >
                <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                  {isSelected && <Check size={14} color={APP_COLORS.white} />}
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle} numberOfLines={2}>
                    {row.ten_tinhhuong || '(Chưa có tên)'}
                  </Text>
                  {!!row.mo_ta && (
                    <Text style={styles.rowMeta} numberOfLines={2}>
                      {row.mo_ta}
                    </Text>
                  )}
                  <View style={styles.kbupPill}>
                    <Text style={styles.kbupPillText} numberOfLines={1}>
                      KBUP hiện tại: {row.kbup_ten || '-'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </AppModal>
  );
};

export default CbrnScenarioAttachModal;
