import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';

import { unitDetailModalStyles as styles } from './UnitDetailModal.styles';

import type { DepartmentVanBanStats } from './statsCompute';

export interface UnitDetailModalProps {
  unit: DepartmentVanBanStats | null;
  onClose: () => void;
}

const isDocValid = (trangThai?: number, trangThaiST?: string): boolean => {
  if (trangThai === 2) return false;
  return !(trangThaiST || '').toLowerCase().includes('hết');
};

// Floating modal (not full-screen) — same backdrop+card pattern as
// GuideFileViewerModal — listing the văn bản of one đơn vị. Covers both
// web's "Xem chi tiết" (Top 5 grid) and the table row's view action.
const UnitDetailModal: React.FC<UnitDetailModalProps> = ({ unit, onClose }) => {
  if (!unit) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.title} numberOfLines={1}>
                {unit.departmentName} ({unit.departmentCode})
              </Text>
              <Text style={styles.subtitle}>
                Danh sách {unit.total} văn bản pháp quy đã xây dựng · Thứ hạng {unit.rank}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statChip}>
              Tổng số: <Text style={styles.statChipBold}>{unit.total}</Text>
            </Text>
            <Text style={styles.statChip}>
              Luật: <Text style={styles.statChipBold}>{unit.luatCount}</Text>
            </Text>
            <Text style={styles.statChip}>
              Nghị định: <Text style={styles.statChipBold}>{unit.nghiDinhCount}</Text>
            </Text>
            <Text style={styles.statChip}>
              Thông tư: <Text style={styles.statChipBold}>{unit.thongTuCount}</Text>
            </Text>
            <Text style={[styles.statChip, styles.statChipSuccess]}>
              Còn hiệu lực: <Text style={styles.statChipBold}>{unit.conHieuLucCount}</Text>
            </Text>
          </View>

          <ScrollView style={styles.body}>
            {unit.documents.length === 0 ? (
              <Text style={styles.emptyText}>
                Đơn vị này hiện chưa nhập liệu văn bản pháp quy nào vào hệ thống.
              </Text>
            ) : (
              unit.documents.map((doc, index) => (
                <View key={doc.gid ?? index} style={styles.docRow}>
                  <Text style={styles.docIndex}>{index + 1}</Text>
                  <View style={styles.docInfo}>
                    <Text style={styles.docTitle} numberOfLines={2}>
                      {doc.ten_vb || 'Không có tiêu đề'}
                    </Text>
                    <Text style={styles.docMeta} numberOfLines={1}>
                      {doc.so_hieu || '—'} · {doc.gid_loaivbST || '—'} ·{' '}
                      {doc.ngay_banhanh || doc.ngay_tao || '—'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      isDocValid(doc.trang_thai, doc.trang_thaiST) && styles.statusPillValid,
                    ]}
                  >
                    <Text style={styles.statusPillText} numberOfLines={1}>
                      {doc.trang_thaiST || 'Còn hiệu lực'}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UnitDetailModal;
