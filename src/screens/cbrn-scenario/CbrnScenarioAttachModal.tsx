import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Check, Paperclip, X } from 'lucide-react-native';

import { TinhHuongHuanLuyenApi } from '@/api/tinhhuonghuanluyen';
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
      Alert.alert('Thông báo', 'Chọn ít nhất 1 tình huống huấn luyện.');
      return;
    }
    setIsSaving(true);
    TinhHuongHuanLuyenApi.attachKbup(item.gid, Array.from(selectedGids))
      .then((success) => {
        if (!success) throw new Error('attach failed');
        Alert.alert('Thông báo', 'Đính kèm kịch bản ứng phó thành công.');
        onSaved();
        onClose();
      })
      .catch(() => Alert.alert('Lỗi', 'Đính kèm thất bại. Vui lòng thử lại.'))
      .finally(() => setIsSaving(false));
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Paperclip size={18} color={APP_COLORS.white} />
            <Text style={styles.title} numberOfLines={1}>
              Đính kèm kịch bản ứng phó sự cố
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={APP_COLORS.primary} />
            </View>
          ) : (
            <FlatList
              style={styles.list}
              data={situations}
              keyExtractor={(row) => String(row.gid)}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Chưa có tình huống huấn luyện nào.</Text>
              }
              renderItem={({ item: row }) => {
                const isSelected = selectedGids.has(row.gid);
                return (
                  <TouchableOpacity style={styles.row} onPress={() => toggle(row.gid)}>
                    <View style={styles.rowBody}>
                      <Text style={styles.rowTitle} numberOfLines={2}>
                        {row.ten_tinhhuong || '(Chưa có tên)'}
                      </Text>
                      {!!row.mo_ta && (
                        <Text style={styles.rowMeta} numberOfLines={2}>
                          {row.mo_ta}
                        </Text>
                      )}
                      <Text style={styles.rowKbup}>KBUP hiện tại: {row.kbup_ten || '-'}</Text>
                    </View>
                    <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                      {isSelected && <Check size={14} color={APP_COLORS.white} />}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.saveButton} onPress={onSave} disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator size="small" color={APP_COLORS.white} />
              ) : (
                <Text style={styles.saveButtonText}>Lưu</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={isSaving}>
              <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CbrnScenarioAttachModal;
