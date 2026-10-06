import React, { useState } from 'react';
import { Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';

import { meetingRoomInfoModalStyles as styles } from './MeetingRoomInfoModal.styles';

import type { KhtochuchopItem, ThanhPhanThamGiaItem } from '@/types';

export interface MeetingRoomInfoModalProps {
  visible: boolean;
  onClose: () => void;
  khtochuchop: KhtochuchopItem | null;
  meetingLocation?: string;
  chuTri: ThanhPhanThamGiaItem | null;
}

type InfoTab = 'thongtin' | 'sodocho';

const formatDateTime = (raw?: string): string => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

// "Thông tin" — mirrors pmbc_mobile's Thông tin dialog header block (tiêu
// đề, thời gian, địa điểm, chủ trì). The agenda/participant two-column list
// that dialog also showed is already always-visible on the main screen
// here, so it isn't duplicated in this modal.
const MeetingRoomInfoModal: React.FC<MeetingRoomInfoModalProps> = ({
  visible,
  onClose,
  khtochuchop,
  meetingLocation,
  chuTri,
}) => {
  const [activeTab, setActiveTab] = useState<InfoTab>('thongtin');

  if (!visible) return null;

  const chuTriLine = chuTri
    ? `Đ/c ${[chuTri.capbacST, chuTri.thanhvienST, chuTri.chucvu].filter(Boolean).join(' - ')}`
    : '—';

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {khtochuchop?.khp_tieude || '(Chưa có tiêu đề)'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'thongtin' && styles.tabActive]}
              onPress={() => setActiveTab('thongtin')}
            >
              <Text style={[styles.tabText, activeTab === 'thongtin' && styles.tabTextActive]}>
                Thông tin
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'sodocho' && styles.tabActive]}
              onPress={() => setActiveTab('sodocho')}
            >
              <Text style={[styles.tabText, activeTab === 'sodocho' && styles.tabTextActive]}>
                Sơ đồ chỗ ngồi
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'thongtin' ? (
            <ScrollView style={[styles.body, { maxHeight: Dimensions.get('window').height * 0.55 }]}>
              <View style={styles.field}>
                <Text style={styles.label}>Thời gian</Text>
                <Text style={styles.value}>
                  {formatDateTime(khtochuchop?.khp_thoigiantu)} đến{' '}
                  {formatDateTime(khtochuchop?.khp_thoigianden)}
                </Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Địa điểm</Text>
                <Text style={styles.value}>{meetingLocation || '—'}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Chủ trì</Text>
                <Text style={styles.value}>{chuTriLine}</Text>
              </View>

              {!!khtochuchop?.khp_trolyST && (
                <View style={styles.field}>
                  <Text style={styles.label}>Trợ lý</Text>
                  <Text style={styles.value}>{khtochuchop.khp_trolyST}</Text>
                </View>
              )}

              {!!khtochuchop?.khp_loaicuochopST && (
                <View style={styles.field}>
                  <Text style={styles.label}>Loại cuộc họp</Text>
                  <Text style={styles.value}>{khtochuchop.khp_loaicuochopST}</Text>
                </View>
              )}
            </ScrollView>
          ) : (
            // Sơ đồ chỗ ngồi — intentionally left blank for now.
            <View style={[styles.body, styles.seatingChartBox]} />
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default MeetingRoomInfoModal;
