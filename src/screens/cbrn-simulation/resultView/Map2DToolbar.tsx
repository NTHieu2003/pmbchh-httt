import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Crop, Eye, EyeOff, FileText, Focus, ImageDown, Info, Shield } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import { map2DToolbarStyles as styles } from './Map2DToolbar.styles';

export interface Map2DToolbarProps {
  xl: number | null;
  isDomainMode: boolean;
  onToggleDomainMode: () => void;
  onAutoFitDomain: () => void;
  isExportingImage: boolean;
  onExportImage: () => void;
  onOpenImpactInfo: () => void;
  isResponseVisible: boolean;
  onToggleResponseVisible: () => void;
  onOpenResponseInfo: () => void;
  isExportingResponsePlan: boolean;
  onExportResponsePlan: () => void;
  disabled: boolean;
}

// "THANH CÔNG CỤ XỬ LÝ & TRÍCH XUẤT KẾT QUẢ MÔ PHỎNG" — matches pmbc_web's
// map toolbar row (mophongphattan.component.html:471-555), trimmed to the
// map-scoped use cases (domain selection, image export, impact info,
// response-plan overlay/info — DOCX export/print/fullscreen/data-dump are
// separate, out-of-scope features, see plan.md). Rendered as its own
// horizontal-scroll strip ABOVE the map (not overlaid on it) so buttons get
// proper touch targets instead of competing with map pan/zoom gestures.
const Map2DToolbar: React.FC<Map2DToolbarProps> = ({
  xl,
  isDomainMode,
  onToggleDomainMode,
  onAutoFitDomain,
  isExportingImage,
  onExportImage,
  onOpenImpactInfo,
  isResponseVisible,
  onToggleResponseVisible,
  onOpenResponseInfo,
  isExportingResponsePlan,
  onExportResponsePlan,
  disabled,
}) => (
  <View style={styles.container}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {xl != null && (
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Cự ly: {Math.round(xl)}m</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, isDomainMode && styles.buttonActive]}
        onPress={onToggleDomainMode}
      >
        <Crop size={14} color={isDomainMode ? APP_COLORS.white : APP_COLORS.textPrimary} />
        <Text style={[styles.buttonText, isDomainMode && styles.buttonTextActive]}>
          {isDomainMode ? 'Đang khoanh...' : 'Khoanh vùng miền'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onAutoFitDomain} disabled={disabled}>
        <Focus size={14} color={APP_COLORS.textPrimary} />
        <Text style={styles.buttonText}>Khoanh theo vùng ảnh hưởng</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onExportImage} disabled={disabled || isExportingImage}>
        {isExportingImage ? (
          <ActivityIndicator size="small" color={APP_COLORS.textPrimary} />
        ) : (
          <ImageDown size={14} color={APP_COLORS.textPrimary} />
        )}
        <Text style={styles.buttonText}>Xuất ảnh bản đồ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onOpenImpactInfo} disabled={disabled}>
        <Info size={14} color={APP_COLORS.textPrimary} />
        <Text style={styles.buttonText}>Xem vùng ảnh hưởng</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isResponseVisible && styles.buttonActive]}
        onPress={onToggleResponseVisible}
        disabled={disabled}
      >
        {isResponseVisible ? (
          <EyeOff size={14} color={APP_COLORS.white} />
        ) : (
          <Eye size={14} color={APP_COLORS.textPrimary} />
        )}
        <Text style={[styles.buttonText, isResponseVisible && styles.buttonTextActive]}>
          {isResponseVisible ? 'Ẩn ứng phó' : 'Hiện ứng phó'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onOpenResponseInfo} disabled={disabled}>
        <Shield size={14} color={APP_COLORS.textPrimary} />
        <Text style={styles.buttonText}>Xem PA ứng phó</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onExportResponsePlan}
        disabled={disabled || isExportingResponsePlan}
      >
        {isExportingResponsePlan ? (
          <ActivityIndicator size="small" color={APP_COLORS.textPrimary} />
        ) : (
          <FileText size={14} color={APP_COLORS.textPrimary} />
        )}
        <Text style={styles.buttonText}>Xuất PA ứng phó</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

export default Map2DToolbar;
