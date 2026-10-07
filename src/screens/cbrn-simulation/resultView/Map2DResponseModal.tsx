import React from 'react';
import { Text, View } from 'react-native';
import { FileText, ShieldAlert } from 'lucide-react-native';

import { AppModal, AppModalButton } from '@/components/AppModal';

import { getEvacBearing1, getEvacBearing2, getIsolationRadius } from '../simulation';
import { map2DResponseModalStyles as styles } from './Map2DResponseModal.styles';

import type { SimulationResult } from '../simulation';

export interface Map2DResponseModalProps {
  visible: boolean;
  onClose: () => void;
  result: SimulationResult | null;
  isExportingDoc: boolean;
  onExportDoc: () => void;
}

// Matches pmbc_web's "Quy trình 5 bước ứng phó sự cố hóa chất khẩn cấp"
// (mophongphattan.component.html:924-940) — step text depends on
// isoRadius/evacBearings/oppositeBearing, computed per-result below.
const buildSteps = (isoRadius: number, bearing1: number, bearing2: number, oppositeBearing: number) => [
  {
    title: 'Bước 1 - Cách ly & Cảnh báo',
    body: `Ngay lập tức thiết lập chốt phong tỏa vòng tròn bán kính ${isoRadius}m. Bật còi báo động và thông báo loa phóng thanh sơ tán dân cư.`,
  },
  {
    title: 'Bước 2 - Hướng dẫn sơ tán',
    body: `Chỉ dẫn dân cư và lực lượng cứu hộ sơ tán theo hướng ${bearing1}° hoặc ${bearing2}° (vuông góc với hướng gió thổi). Tuyệt đối cấm chạy xuôi chiều gió.`,
  },
  {
    title: 'Bước 3 - Triển khai Sở chỉ huy & Tiêu độc',
    body: `Lập Sở chỉ huy ở đầu hướng gió ngược (${oppositeBearing}°), triển khai trạm tiêu tẩy và cấp cứu y tế tại 2 bên sườn.`,
  },
  {
    title: 'Bước 4 - Trinh sát & Khống chế nguồn độc',
    body: 'Lực lượng trinh sát phòng hóa trang bị khí tài thở cách ly áp lực dương (SCBA) tiếp cận khóa van hoặc dùng màn nước dập hơi khí.',
  },
  {
    title: 'Bước 5 - Tiêu độc làm sạch môi trường',
    body: 'Sử dụng xe tiêu độc phun chất trung hòa, thu gom chất thải độc hại theo quy định quản lý chất thải nguy hại.',
  },
];

// "Xem PA ứng phó" — matches pmbc_web's response-plan modal
// (openResponseInfoModal/isResponseModalOpen) field-for-field:
// overview grid, the 4-station deployment table (rendered as cards — a
// literal HTML table doesn't fit phone width, but every column/value is
// kept), and the 5-step emergency procedure.
const Map2DResponseModal: React.FC<Map2DResponseModalProps> = ({
  visible,
  onClose,
  result,
  isExportingDoc,
  onExportDoc,
}) => {
  if (!visible || !result) return null;

  const isoRadius = getIsolationRadius(result);
  const bearing1 = getEvacBearing1(result);
  const bearing2 = getEvacBearing2(result);
  const oppositeBearing = Math.round((result.windDirTo + 180) % 360);

  const stations = [
    {
      icon: '🚩',
      title: 'Sở chỉ huy dã chiến',
      position: `Cách nguồn ${(isoRadius * 1.5).toFixed(0)}m đầu hướng gió (ngược gió ${oppositeBearing}°)`,
      task: 'Chỉ huy điều hành ứng phó, kết nối thông tin liên lạc, giám sát khí tượng',
      gear: 'Mặt nạ phòng độc dự phòng, máy đo độc cầm tay',
    },
    {
      icon: '🚿',
      title: 'Trạm tiêu độc cơ động',
      position: `Cánh phải luồng gió, cách nguồn ${(isoRadius * 1.2).toFixed(0)}m`,
      task: 'Tiêu tẩy rửa cho lực lượng tác chiến, phương tiện rút ra từ tâm độc',
      gear: 'Bộ quần áo phòng hóa cấp B, ủng cao su, găng tiêu độc chuyên dụng',
    },
    {
      icon: '🏥',
      title: 'Trạm cấp cứu y tế dã chiến',
      position: `Cánh trái luồng gió, cách nguồn ${(isoRadius * 1.2).toFixed(0)}m`,
      task: 'Tiếp nhận nạn nhân, thở oxy, sơ cấp cứu ngộ độc hóa chất cấp tính',
      gear: 'Mặt nạ phòng hóa cách ly, bộ cấp cứu oxy, thuốc giải độc đặc hiệu',
    },
    {
      icon: '⛔',
      title: 'Chốt phong tỏa vành đai',
      position: `Tại mép vòng tròn bán kính ${isoRadius}m`,
      task: 'Ngăn chặn triệt để người và phương tiện dân sự vào vùng nguy hiểm',
      gear: 'Bộ phòng hóa cấp C, trang bị tuần tra kiểm soát',
    },
  ];

  const steps = buildSteps(isoRadius, bearing1, bearing2, oppositeBearing);

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      icon={ShieldAlert}
      tone="success"
      title="Kế hoạch & biện pháp ứng phó sự cố phát tán độc"
      subtitle={result.chem.name}
      size="md"
      footer={
        <>
          <AppModalButton label="Đóng" onPress={onClose} />
          <AppModalButton
            label="Xuất Word (.doc)"
            variant="primary"
            icon={FileText}
            loading={isExportingDoc}
            onPress={onExportDoc}
          />
        </>
      }
    >
      <View style={styles.overviewGrid}>
        <View style={styles.overviewItem}>
          <Text style={styles.ovLabel}>Hóa chất độc / CAS</Text>
          <Text style={styles.ovValue}>
            {result.chem.name} ({result.chem.cas || 'N/A'})
          </Text>
        </View>
        <View style={styles.overviewItem}>
          <Text style={styles.ovLabel}>Bán kính cô lập ban đầu</Text>
          <Text style={styles.ovValueDanger}>R = {isoRadius} m</Text>
        </View>
        <View style={styles.overviewItem}>
          <Text style={styles.ovLabel}>Hướng gió thổi tới</Text>
          <Text style={styles.ovValue}>
            {result.windDirTo}° ({result.U10} m/s)
          </Text>
        </View>
        <View style={styles.overviewItem}>
          <Text style={styles.ovLabel}>Phương hướng sơ tán tối ưu</Text>
          <Text style={styles.ovValueSuccess}>
            {bearing1}° & {bearing2}°
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Phương án bố trí trạm & vị trí tác chiến trên thực địa
      </Text>
      {stations.map((s) => (
        <View key={s.title} style={styles.stationCard}>
          <Text style={styles.stationTitle}>
            {s.icon} {s.title}
          </Text>
          <Text style={styles.stationField}>
            <Text style={styles.stationFieldLabel}>Tọa độ / Bố trí: </Text>
            {s.position}
          </Text>
          <Text style={styles.stationField}>
            <Text style={styles.stationFieldLabel}>Nhiệm vụ: </Text>
            {s.task}
          </Text>
          <Text style={styles.stationField}>
            <Text style={styles.stationFieldLabel}>Trang bị: </Text>
            {s.gear}
          </Text>
        </View>
      ))}

      <View style={styles.guidanceCard}>
        <Text style={styles.guidanceTitle}>Quy trình 5 bước ứng phó sự cố hóa chất khẩn cấp</Text>
        {steps.map((step) => (
          <Text key={step.title} style={styles.guidanceLine}>
            <Text style={styles.guidanceBold}>{step.title}: </Text>
            {step.body}
          </Text>
        ))}
      </View>
    </AppModal>
  );
};

export default Map2DResponseModal;
