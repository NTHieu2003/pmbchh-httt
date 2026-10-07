import React from 'react';
import { Text, View } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';

import { AppModal, AppModalButton } from '@/components/AppModal';

import { formatArea, getLevelDescription } from '../simulation';
import { map2DImpactModalStyles as styles } from './Map2DImpactModal.styles';

import type { DomainBounds } from './Map2DView';
import type { SimulationResult } from '../simulation';

export interface Map2DImpactModalProps {
  visible: boolean;
  onClose: () => void;
  result: SimulationResult | null;
  domainBounds: DomainBounds | null;
}

const GUIDANCE_LINES = (result: SimulationResult) => {
  const isolationM = Math.max(100, Math.round(result.xl * 0.15));
  const bearing1 = Math.round((result.windDirTo + 90) % 360);
  const bearing2 = Math.round((result.windDirTo + 270) % 360);
  return [
    {
      title: 'Khoanh vùng cách ly ban đầu',
      body: `Thiết lập vành đai cô lập cách nguồn phát tán tối thiểu ${isolationM} mét theo mọi hướng. Tuyệt đối không cho người không có nhiệm vụ tiếp cận khu vực.`,
    },
    {
      title: 'Phương hướng sơ tán dân cư & lực lượng',
      body: `Sơ tán khẩn cấp theo hướng VUÔNG GÓC VỚI HƯỚNG GIÓ THỔI (hướng ${bearing1}° hoặc ${bearing2}°), tuyệt đối không di chuyển xuôi theo hướng gió thổi (${result.windDirTo}°).`,
    },
    {
      title: 'Trang bị phòng vệ cá nhân',
      body: 'Toàn bộ lực lượng tham gia tác chiến/cứu nạn phải mang mặt nạ phòng hóa quân sự hoặc khí tài thở cách ly áp lực dương (SCBA) và trang phục phòng hóa toàn thân.',
    },
    {
      title: 'Hành động chuyên môn',
      body: 'Sử dụng xe tiêu tẩy Binh chủng Hóa học phun sương màn nước chặn hướng mây hơi độc, sử dụng chất tiêu độc trung hòa phù hợp.',
    },
  ];
};

// "Xem vùng ảnh hưởng" — matches pmbc_web's impact-info modal
// (openImpactInfoModal/isImpactInfoModalOpen) field-for-field: the overview
// grid, the per-level threat table, and the tactical/evacuation guidance.
const Map2DImpactModal: React.FC<Map2DImpactModalProps> = ({
  visible,
  onClose,
  result,
  domainBounds,
}) => {
  if (!visible || !result) return null;

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      icon={ShieldAlert}
      tone="danger"
      title="Thông tin vùng ảnh hưởng phát tán hóa chất độc"
      subtitle={result.chem.name}
      size="md"
      footer={<AppModalButton label="Đóng" onPress={onClose} />}
    >
      <View style={styles.overviewGrid}>
        <View style={styles.overviewItem}>
          <Text style={styles.ovLabel}>Hóa chất độc hại</Text>
          <Text style={styles.ovValue}>{result.chem.name}</Text>
        </View>
        <View style={styles.overviewItem}>
          <Text style={styles.ovLabel}>Số hiệu CAS / Khối lượng mol</Text>
          <Text style={styles.ovValue}>
            {result.chem.cas || 'N/A'} ({result.chem.mw} g/mol)
          </Text>
        </View>
        <View style={styles.overviewItem}>
          <Text style={styles.ovLabel}>Mô hình khí động</Text>
          <Text style={styles.ovValue}>
            {result.model === 'heavy_gas' ? 'Khí nặng (DEGADIS)' : 'Gauss (Khí trung tính)'}
          </Text>
        </View>
        <View style={styles.overviewItem}>
          <Text style={styles.ovLabel}>Vận tốc gió / Hướng thổi</Text>
          <Text style={styles.ovValue}>
            {result.U10} m/s (tới {result.windDirTo}°)
          </Text>
        </View>
        <View style={styles.overviewItem}>
          <Text style={styles.ovLabel}>Cự ly nguy hiểm xa nhất</Text>
          <Text style={styles.ovValueDanger}>{Math.round(result.xl)} m</Text>
        </View>
        <View style={styles.overviewItem}>
          <Text style={styles.ovLabel}>Bề rộng đám mây lớn nhất</Text>
          <Text style={styles.ovValue}>{Math.round(2 * result.maxHalfwidth)} m</Text>
        </View>
        <View style={styles.overviewItem}>
          <Text style={styles.ovLabel}>Tổng diện tích bao phủ</Text>
          <Text style={styles.ovValue}>{formatArea(result.maxArea)}</Text>
        </View>
        <View style={styles.overviewItem}>
          <Text style={styles.ovLabel}>Miền mô phỏng khoanh</Text>
          <Text style={styles.ovValueInfo}>
            {domainBounds ? `${domainBounds.areaKm2.toFixed(2)} km²` : 'Chưa khoanh'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Chi tiết các ngưỡng phân cấp vùng nguy hiểm</Text>
      {result.levels.map((lvl) => (
        <View key={lvl.key} style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={[styles.levelSwatch, { backgroundColor: lvl.stroke }]} />
            <Text style={styles.levelLabel}>{lvl.label}</Text>
          </View>
          <Text style={styles.levelField}>
            <Text style={styles.levelFieldLabel}>Ngưỡng: </Text>
            {lvl.loc_ppm != null
              ? `${lvl.loc_ppm} ppm`
              : `${(lvl.LOC_kg_m3 * 1_000_000).toFixed(2)} mg/m³`}
          </Text>
          <Text style={styles.levelField}>
            <Text style={styles.levelFieldLabel}>Cự ly xa nhất: </Text>
            {lvl.xl > 0 ? `${Math.round(lvl.xl)} m` : 'Không đạt tới'}
          </Text>
          <Text style={styles.levelField}>
            <Text style={styles.levelFieldLabel}>Diện tích bao phủ: </Text>
            {lvl.xl > 0 ? formatArea(lvl.area) : '—'}
          </Text>
          <Text style={styles.levelDescription}>{getLevelDescription(lvl.key)}</Text>
        </View>
      ))}

      <View style={styles.guidanceCard}>
        <Text style={styles.guidanceTitle}>
          Khuyến cáo ứng phó tác chiến & biện pháp sơ tán khẩn cấp
        </Text>
        {GUIDANCE_LINES(result).map((line) => (
          <Text key={line.title} style={styles.guidanceLine}>
            <Text style={styles.guidanceBold}>{line.title}: </Text>
            {line.body}
          </Text>
        ))}
      </View>
    </AppModal>
  );
};

export default Map2DImpactModal;
