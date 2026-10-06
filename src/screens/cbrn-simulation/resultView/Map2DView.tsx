import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { LocateFixed, Trash2, X, ZoomIn } from 'lucide-react-native';
import RNFS from 'react-native-fs';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { APP_COLORS } from '@/theme';
import {
  buildResponsePlanDocHtml,
  buildResponsePlanFileName,
  getEvacBearing1,
  getEvacBearing2,
  getIsolationRadius,
} from '../simulation';

import { buildMapHtml } from './buildMapHtml';
import Map2DImpactModal from './Map2DImpactModal';
import Map2DResponseModal from './Map2DResponseModal';
import Map2DToolbar from './Map2DToolbar';
import { map2DViewStyles as styles } from './Map2DView.styles';

import type { SimulationResult } from '../simulation';

export interface Map2DViewProps {
  result: SimulationResult | null;
  resultVersion: number;
  // "Đặt nguồn tại tâm miền" — the only domain-selection action that needs
  // RN-side state (everything else: draw/zoom/clear/auto-fit, stays
  // entirely inside the WebView, see buildMapHtml.ts).
  onSetSourceAtCenter: (lat: number, lon: number) => void;
}

export interface DomainBounds {
  southWest: { lat: number; lng: number };
  northEast: { lat: number; lng: number };
  center: { lat: number; lng: number };
  widthKm: number;
  heightKm: number;
  areaKm2: number;
}

type BridgeMessage =
  | { type: 'domainUpdate'; bounds: DomainBounds | null }
  | { type: 'domainCenter'; lat: number; lon: number }
  | { type: 'mapImage'; dataUrl: string }
  | { type: 'mapImageError'; message: string };

// Leaflet (Esri/OSM tiles) rendered inside a WebView — same library/tiles
// as pmbc_web, since there's no direct RN equivalent of a Leaflet map (see
// `buildMapHtml.ts`). The toolbar and domain/response floating cards are
// native RN views here (not HTML inside the WebView) for proper touch
// targets; RN drives the WebView's own interactive state via
// `injectJavaScript` calls into `window.cbrnMap.*`.
const Map2DView: React.FC<Map2DViewProps> = ({ result, resultVersion, onSetSourceAtCenter }) => {
  const html = useMemo(() => buildMapHtml(result), [result]);
  const webViewRef = useRef<React.ComponentRef<typeof WebView>>(null);

  const [isDomainMode, setIsDomainMode] = useState(false);
  const [domainBounds, setDomainBounds] = useState<DomainBounds | null>(null);
  const [isResponseVisible, setIsResponseVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingDoc, setIsExportingDoc] = useState(false);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

  // The WebView fully reloads on every new run (keyed on `resultVersion`),
  // which wipes its own JS state — reset the RN-side mirror of that state
  // too so stale buttons/cards don't linger.
  useEffect(() => {
    setIsDomainMode(false);
    setDomainBounds(null);
    setIsResponseVisible(false);
  }, [resultVersion]);

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as BridgeMessage;
      if (data.type === 'domainUpdate') {
        setDomainBounds(data.bounds);
        setIsDomainMode(false);
      } else if (data.type === 'domainCenter') {
        onSetSourceAtCenter(data.lat, data.lon);
      } else if (data.type === 'mapImage') {
        saveExportedImage(data.dataUrl);
      } else if (data.type === 'mapImageError') {
        setIsExporting(false);
        Alert.alert('Lỗi', 'Không thể xuất ảnh bản đồ.');
      }
    } catch {
      // Ignore malformed bridge messages.
    }
  };

  const callBridge = (call: string) => {
    webViewRef.current?.injectJavaScript(`window.cbrnMap && window.cbrnMap.${call}; true;`);
  };

  const onToggleDomainMode = () => {
    const next = !isDomainMode;
    setIsDomainMode(next);
    callBridge(`setDomainMode(${next})`);
  };

  const onAutoFitDomain = () => {
    if (!result) return;
    callBridge('autoFitDomain()');
  };

  const onZoomToDomain = () => callBridge('zoomToDomain()');

  const onClearDomain = () => {
    callBridge('clearDomain()');
    setDomainBounds(null);
  };

  const onSetSourceFromDomain = () => {
    if (!domainBounds) return;
    onSetSourceAtCenter(domainBounds.center.lat, domainBounds.center.lng);
  };

  const onToggleResponseVisible = () => {
    if (!result) return;
    const next = !isResponseVisible;
    setIsResponseVisible(next);
    callBridge(`setResponseVisible(${next})`);
  };

  // Capture happens INSIDE the WebView (html2canvas, see buildMapHtml.ts's
  // window.cbrnMap.exportImage) — a RN-side view-shot capture of this
  // component can't see into the WebView's native rendering surface at
  // all, which previously produced an image with the tiles/polygons
  // missing. The result comes back via onMessage's 'mapImage'/
  // 'mapImageError'.
  const onExportImage = () => {
    if (isExporting) return;
    setIsExporting(true);
    callBridge('exportImage()');
  };

  const saveExportedImage = async (dataUrl: string) => {
    try {
      const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
      const dir = RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath;
      const fileName = `Ban_do_mo_phong_${result?.chem.name ?? 'khong_ten'}_${Date.now()}.png`.replace(
        /\s+/g,
        '_'
      );
      await RNFS.writeFile(`${dir}/${fileName}`, base64, 'base64');
      Alert.alert('Xuất ảnh thành công', `Đã lưu "${fileName}" vào thư mục Downloads.`);
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu ảnh bản đồ.');
    } finally {
      setIsExporting(false);
    }
  };

  // "Xuất PA ứng phó" — matches web's exportResponsePlanDocx: the classic
  // HTML-saved-as-.doc trick (Word's legacy HTML import filter opens it
  // fine), no server call or OOXML library needed — plain text, so written
  // directly via RNFS instead of round-tripping through base64.
  const onExportResponsePlan = async () => {
    if (!result || isExportingDoc) return;
    setIsExportingDoc(true);
    try {
      const docHtml = buildResponsePlanDocHtml(result);
      const fileName = buildResponsePlanFileName(result);
      const dir = RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath;
      await RNFS.writeFile(`${dir}/${fileName}`, `﻿${docHtml}`, 'utf8');
      Alert.alert('Xuất văn bản thành công', `Đã lưu "${fileName}" vào thư mục Downloads.`);
    } catch {
      Alert.alert('Lỗi', 'Không thể xuất văn bản phương án ứng phó.');
    } finally {
      setIsExportingDoc(false);
    }
  };

  if (!result) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>
          Chạy mô phỏng trước để hiển thị vùng đe dọa trên bản đồ.
        </Text>
      </View>
    );
  }

  const isoRadius = getIsolationRadius(result);
  const bearing1 = getEvacBearing1(result);
  const bearing2 = getEvacBearing2(result);

  return (
    <View style={styles.container}>
      <Map2DToolbar
        xl={result.xl}
        isDomainMode={isDomainMode}
        onToggleDomainMode={onToggleDomainMode}
        onAutoFitDomain={onAutoFitDomain}
        isExportingImage={isExporting}
        onExportImage={onExportImage}
        onOpenImpactInfo={() => setIsImpactModalOpen(true)}
        isResponseVisible={isResponseVisible}
        onToggleResponseVisible={onToggleResponseVisible}
        onOpenResponseInfo={() => setIsResponseModalOpen(true)}
        isExportingResponsePlan={isExportingDoc}
        onExportResponsePlan={onExportResponsePlan}
        disabled={!result}
      />

      <View style={styles.captureArea}>
        <WebView
          ref={webViewRef}
          key={resultVersion}
          source={{ html }}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          onMessage={onMessage}
        />

        {domainBounds && (
          <View style={styles.domainCard}>
            <View style={styles.domainCardHead}>
              <Text style={styles.domainCardTitle}>Miền mô phỏng</Text>
              <TouchableOpacity onPress={onClearDomain} hitSlop={6}>
                <X size={14} color={APP_COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.domainCardArea}>
              {domainBounds.areaKm2.toFixed(2)} km² ({domainBounds.widthKm.toFixed(2)} ×{' '}
              {domainBounds.heightKm.toFixed(2)} km)
            </Text>
            <Text style={styles.domainCardLine}>
              Tây Nam: [{domainBounds.southWest.lat.toFixed(4)}, {domainBounds.southWest.lng.toFixed(4)}]
            </Text>
            <Text style={styles.domainCardLine}>
              Đông Bắc: [{domainBounds.northEast.lat.toFixed(4)}, {domainBounds.northEast.lng.toFixed(4)}]
            </Text>
            <Text style={styles.domainCardLine}>
              Tâm miền: [{domainBounds.center.lat.toFixed(4)}, {domainBounds.center.lng.toFixed(4)}]
            </Text>
            <View style={styles.domainCardActions}>
              <TouchableOpacity style={styles.domainCardButton} onPress={onSetSourceFromDomain}>
                <LocateFixed size={12} color={APP_COLORS.white} />
                <Text style={styles.domainCardButtonText}>Đặt nguồn tại tâm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.domainCardButton} onPress={onZoomToDomain}>
                <ZoomIn size={12} color={APP_COLORS.white} />
                <Text style={styles.domainCardButtonText}>Khớp miền</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.domainCardButton} onPress={onClearDomain}>
                <Trash2 size={12} color={APP_COLORS.white} />
                <Text style={styles.domainCardButtonText}>Xóa miền</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {isResponseVisible && (
          <View style={styles.responseCard}>
            <View style={styles.domainCardHead}>
              <Text style={styles.responseCardTitle}>THÔNG TIN ỨNG PHÓ HIỆN TRƯỜNG</Text>
              <TouchableOpacity onPress={onToggleResponseVisible} hitSlop={6}>
                <X size={14} color="#ea580c" />
              </TouchableOpacity>
            </View>
            <Text style={styles.responseCardLine}>Vành đai cách ly khẩn: R = {isoRadius} m</Text>
            <Text style={styles.responseCardLine}>
              Hướng sơ tán an toàn: {bearing1}° & {bearing2}°
            </Text>
            <Text style={styles.responseCardLine}>Sở chỉ huy dã chiến: Đầu ngược gió (an toàn)</Text>
            <Text style={styles.responseCardLine}>Y tế & Tiêu độc: Bố trí 2 sườn gió</Text>
            <TouchableOpacity
              style={styles.responseCardButton}
              onPress={() => setIsResponseModalOpen(true)}
            >
              <Text style={styles.responseCardButtonText}>Chi tiết PA</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Map2DImpactModal
        visible={isImpactModalOpen}
        onClose={() => setIsImpactModalOpen(false)}
        result={result}
        domainBounds={domainBounds}
      />
      <Map2DResponseModal
        visible={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        result={result}
        isExportingDoc={isExportingDoc}
        onExportDoc={onExportResponsePlan}
      />
    </View>
  );
};

export default Map2DView;
