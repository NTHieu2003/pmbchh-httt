import React from 'react';
import { Text, View } from 'react-native';

import { chemicalInfoCardStyles as styles } from './ChemicalInfoCard.styles';

import type { Chemical } from '../simulation';

export interface ChemicalInfoCardProps {
  chem: Chemical;
}

const K_OFFSET = 273.15;
const REF_TEMP_K = 293.0;

// Matches pmbc_web's "Selected Chemical Info Card" (mophongphattan
// .component.html lines 38-71) field-for-field — shown after picking a
// chemical instead of a plain "Đã chọn: ..." line.
const ChemicalInfoCard: React.FC<ChemicalInfoCardProps> = ({ chem }) => {
  const showVpRefWarning =
    chem.vp_ref_K != null &&
    (chem.vp_ref_K - REF_TEMP_K > 15 || REF_TEMP_K - chem.vp_ref_K > 15);

  return (
    <View style={styles.card}>
      <InfoRow label="CAS" value={chem.cas || '—'} />
      <InfoRow
        label="Khối lượng phân tử"
        value={chem.mw != null ? `${(chem.mw * 1000).toFixed(2)} g/mol` : '?'}
      />
      <InfoRow
        label="Tỷ trọng lỏng"
        value={chem.rho_l != null ? `${chem.rho_l.toFixed(0)} kg/m³` : '?'}
      />
      <InfoRow
        label="Áp suất hơi"
        value={chem.vp_pa != null ? `${chem.vp_pa.toLocaleString('en-US')} Pa` : '?'}
      />
      <InfoRow
        label="Điểm sôi"
        value={chem.bp_K != null ? `${(chem.bp_K - K_OFFSET).toFixed(1)} °C` : '?'}
      />
      <InfoRow
        label={`LOC (${chem.loc_src || '—'})`}
        value={chem.loc_ppm != null ? `${chem.loc_ppm.toLocaleString('en-US')} ppm` : '?'}
        accent
      />
      {showVpRefWarning && (
        <Text style={styles.warningText}>
          ⚠ Áp suất hơi trong CAMEO đo ở {(chem.vp_ref_K! - K_OFFSET).toFixed(0)}°C — có thể lệch
          nhiều so với nhiệt độ kịch bản chọn.
        </Text>
      )}
    </View>
  );
};

const InfoRow: React.FC<{ label: string; value: string; accent?: boolean }> = ({
  label,
  value,
  accent,
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, accent && styles.valueAccent]}>{value}</Text>
  </View>
);

export default ChemicalInfoCard;
