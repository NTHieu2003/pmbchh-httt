import React from 'react';
import { Text, View } from 'react-native';
import { Building2 } from 'lucide-react-native';

import { AppModal, AppModalButton } from '@/components/AppModal';

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

// Floating AppModal listing the văn bản of one đơn vị. Covers both web's
// "Xem chi tiết" (Top 5 grid) and the table row's view action.
const UnitDetailModal: React.FC<UnitDetailModalProps> = ({ unit, onClose }) => {
  if (!unit) return null;

  const stats: { label: string; value: number; success?: boolean }[] = [
    { label: 'Tổng số', value: unit.total },
    { label: 'Luật', value: unit.luatCount },
    { label: 'Nghị định', value: unit.nghiDinhCount },
    { label: 'Thông tư', value: unit.thongTuCount },
    { label: 'Còn hiệu lực', value: unit.conHieuLucCount, success: true },
  ];

  return (
    <AppModal
      visible
      onClose={onClose}
      icon={Building2}
      title={`${unit.departmentName} (${unit.departmentCode})`}
      subtitle={`Danh sách ${unit.total} văn bản pháp quy đã xây dựng · Thứ hạng ${unit.rank}`}
      size="lg"
      footer={<AppModalButton label="Đóng" onPress={onClose} />}
    >
      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={[styles.statCard, stat.success && styles.statCardSuccess]}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={[styles.statValue, stat.success && styles.statValueSuccess]}>
              {stat.value}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.listCard}>
        {unit.documents.length === 0 ? (
          <Text style={styles.emptyText}>
            Đơn vị này hiện chưa nhập liệu văn bản pháp quy nào vào hệ thống.
          </Text>
        ) : (
          unit.documents.map((doc, index) => {
            const valid = isDocValid(doc.trang_thai, doc.trang_thaiST);
            return (
              <View
                key={doc.gid ?? index}
                style={[styles.docRow, index === unit.documents.length - 1 && styles.docRowLast]}
              >
                <View style={styles.docIndex}>
                  <Text style={styles.docIndexText}>{index + 1}</Text>
                </View>
                <View style={styles.docInfo}>
                  <Text style={styles.docTitle} numberOfLines={2}>
                    {doc.ten_vb || 'Không có tiêu đề'}
                  </Text>
                  <Text style={styles.docMeta} numberOfLines={1}>
                    {doc.so_hieu || '—'} · {doc.gid_loaivbST || '—'} ·{' '}
                    {doc.ngay_banhanh || doc.ngay_tao || '—'}
                  </Text>
                </View>
                <View style={[styles.statusPill, valid && styles.statusPillValid]}>
                  <Text
                    style={[styles.statusPillText, valid && styles.statusPillTextValid]}
                    numberOfLines={1}
                  >
                    {doc.trang_thaiST || 'Còn hiệu lực'}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </AppModal>
  );
};

export default UnitDetailModal;
