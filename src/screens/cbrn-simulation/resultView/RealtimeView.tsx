import React, { useRef, useState } from 'react';
import { PanResponder, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Pause, Play, RotateCcw } from 'lucide-react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { APP_COLORS } from '@/theme';

import { RT_STATUS_LABEL, rtFormatDuration } from '../simulation';
import { realtimeViewStyles as styles } from './RealtimeView.styles';

import type { RtFrame, RtModel } from '../simulation';

export interface RealtimeViewProps {
  rtModel: RtModel | null;
  rtFrame: RtFrame | null;
  rtTime: number;
  rtPlaying: boolean;
  rtSpeed: number;
  rtSpeedOptions: readonly number[];
  rtCurrentClock: Date;
  onTogglePlay: () => void;
  onReset: () => void;
  onSeek: (t: number) => void;
  onChangeSpeed: (speed: number) => void;
  onSetStartNow: () => void;
}

// ---------- Plume diagram (ported from web's rtSx/rtSy/rtSvgPath) ----------
const SVG_W = 900;
const SVG_H = 300;
const SVG_PAD_L = 50;
const SVG_PAD_R = 30;
const SVG_RENDER_HEIGHT = 300;

const formatClock = (d: Date): string => {
  const pad = (v: number) => String(v).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
};

const RealtimeView: React.FC<RealtimeViewProps> = ({
  rtModel,
  rtFrame,
  rtTime,
  rtPlaying,
  rtSpeed,
  rtSpeedOptions,
  rtCurrentClock,
  onTogglePlay,
  onReset,
  onSeek,
  onChangeSpeed,
  onSetStartNow,
}) => {
  const [seekBarWidth, setSeekBarWidth] = useState(0);
  const seekBarWidthRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => seekFromLocalX(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => seekFromLocalX(evt.nativeEvent.locationX),
    })
  ).current;

  const seekFromLocalX = (x: number) => {
    if (!rtModel || seekBarWidthRef.current <= 0) return;
    const frac = Math.max(0, Math.min(1, x / seekBarWidthRef.current));
    onSeek(frac * rtModel.tMax);
  };

  if (!rtModel) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>
          Vui lòng chọn hóa chất và nhấn nút{' '}
          <Text style={styles.emptyTextBold}>&quot;⏱ CHẠY THỜI GIAN THỰC&quot;</Text>{' '}
          ở cột bên trái để xem mô phỏng theo thời gian.
        </Text>
      </View>
    );
  }

  const level = rtFrame?.levels[0] ?? null;
  const hasContour = !!level && level.contour.length > 0;

  const sx = (x: number) => SVG_PAD_L + (x / (rtModel.xlAll || 1)) * (SVG_W - SVG_PAD_L - SVG_PAD_R);
  const sy = (y: number) => SVG_H / 2 - (y / (rtModel.hwMax || 1)) * (SVG_H / 2 - 30);

  let pathData = '';
  if (hasContour && level) {
    const upper = level.contour.map((p) => `${sx(p.x).toFixed(1)},${sy(p.halfwidth).toFixed(1)}`);
    const lower = level.contour
      .slice()
      .reverse()
      .map((p) => `${sx(p.x).toFixed(1)},${sy(-p.halfwidth).toFixed(1)}`);
    pathData = 'M' + upper.concat(lower).join(' L') + ' Z';
  }

  const axisTicks = rtModel.xlAll
    ? [0, 0.25, 0.5, 0.75, 1].map((f) => ({
        x: sx(rtModel.xlAll * f),
        label: `${(rtModel.xlAll * f).toFixed(0)}m`,
      }))
    : [];

  const frontX = sx(rtFrame?.front ?? 0);
  const sourceX = sx(0);

  // ---------- Emission-rate timeline (ported from rtTimelineBars) ----------
  const TL_W = 860;
  const TL_H = 60;
  const bars = rtModel.tMax && rtModel.Qmax
    ? rtModel.steps.map((s) => ({
        x: 20 + (s.tStart / rtModel.tMax) * TL_W,
        w: Math.max(1, ((s.tEnd - s.tStart) / rtModel.tMax) * TL_W - 1),
        h: (s.rate / rtModel.Qmax) * TL_H,
        active: rtTime >= s.tStart && rtTime < s.tEnd,
      }))
    : [];
  const cursorX = 20 + (rtModel.tMax ? (rtTime / rtModel.tMax) * TL_W : 0);
  const releaseEndX = 20 + (rtModel.tMax ? (rtModel.releaseEnd / rtModel.tMax) * TL_W : 0);

  const seekFrac = rtModel.tMax ? rtTime / rtModel.tMax : 0;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>
          {rtFrame ? RT_STATUS_LABEL[rtFrame.status] : ''}
        </Text>
        <Text style={styles.clockText}>{formatClock(rtCurrentClock)}</Text>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.playButton} onPress={onTogglePlay}>
          {rtPlaying ? (
            <Pause size={18} color={APP_COLORS.white} />
          ) : (
            <Play size={18} color={APP_COLORS.white} />
          )}
          <Text style={styles.playButtonText}>{rtPlaying ? 'Tạm dừng' : 'Phát'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <RotateCcw size={16} color={APP_COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.speedChipRow}>
          {rtSpeedOptions.map((speed) => (
            <TouchableOpacity
              key={speed}
              style={[styles.speedChip, rtSpeed === speed && styles.speedChipActive]}
              onPress={() => onChangeSpeed(speed)}
            >
              <Text style={[styles.speedChipText, rtSpeed === speed && styles.speedChipTextActive]}>
                {speed}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View
        style={styles.seekBarTrack}
        onLayout={(e) => {
          seekBarWidthRef.current = e.nativeEvent.layout.width;
          setSeekBarWidth(e.nativeEvent.layout.width);
        }}
        {...panResponder.panHandlers}
      >
        <View style={[styles.seekBarFill, { width: `${seekFrac * 100}%` }]} />
        <View
          style={[
            styles.seekBarThumb,
            { left: Math.max(0, seekFrac * seekBarWidth - 8) },
          ]}
        />
      </View>
      <View style={styles.seekTimeRow}>
        <Text style={styles.seekTimeText}>{rtFormatDuration(rtTime)}</Text>
        <TouchableOpacity onPress={onSetStartNow}>
          <Text style={styles.seekNowLink}>Đặt mốc bắt đầu = hiện tại</Text>
        </TouchableOpacity>
        <Text style={styles.seekTimeText}>{rtFormatDuration(rtModel.tMax)}</Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Lưu lượng hiện tại (kg/s)</Text>
          <Text style={styles.metricValue}>{(rtFrame?.rateNow ?? 0).toFixed(3)}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Khối lượng đã phát (kg)</Text>
          <Text style={styles.metricValue}>{(rtFrame?.massReleased ?? 0).toFixed(1)}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Cự ly vùng đe dọa (m)</Text>
          <Text style={styles.metricValue}>{Math.round(rtFrame?.reach ?? 0)}</Text>
        </View>
      </View>

      <View style={styles.svgWrap}>
        <Svg width="100%" height={SVG_RENDER_HEIGHT} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
          {axisTicks.map((t) => (
            <React.Fragment key={`tick-${t.x}`}>
              <Line x1={t.x} x2={t.x} y1={10} y2={SVG_H - 10} stroke="#cbd5e1" strokeWidth={1} />
              <SvgText x={t.x} y={SVG_H - 4} fontSize={12} fill="#64748b" textAnchor="middle">
                {t.label}
              </SvgText>
            </React.Fragment>
          ))}

          <Line x1={SVG_PAD_L} x2={SVG_W - SVG_PAD_R} y1={SVG_H / 2} y2={SVG_H / 2} stroke="#94a3b8" strokeWidth={1} />

          {pathData ? (
            level && (
              <Path d={pathData} fill={level.fill} fillOpacity={level.fillOpacity} stroke={level.stroke} strokeWidth={2.5} />
            )
          ) : null}

          {/* Front của khối khí (vị trí xa nhất mà gió đã thổi đám mây tới) */}
          <Line x1={frontX} x2={frontX} y1={20} y2={SVG_H - 20} stroke={APP_COLORS.chatBrandRed} strokeWidth={1.5} strokeDasharray="4,3" />

          <Circle cx={sourceX} cy={SVG_H / 2} r={6} fill={APP_COLORS.chatAmber} />
        </Svg>
      </View>

      <View style={styles.timelineWrap}>
        <Text style={styles.timelineTitle}>Lưu lượng phát thải theo thời gian</Text>
        <Svg width="100%" height={100} viewBox={`0 0 ${TL_W + 40} ${TL_H + 20}`}>
          {bars.map((b, i) => (
            <Rect
              key={`bar-${i}`}
              x={b.x}
              y={TL_H - b.h}
              width={b.w}
              height={Math.max(1, b.h)}
              fill={b.active ? APP_COLORS.chatBrandRed : '#93c5fd'}
            />
          ))}
          <Line x1={releaseEndX} x2={releaseEndX} y1={0} y2={TL_H} stroke="#64748b" strokeWidth={1} strokeDasharray="3,3" />
          <Line x1={cursorX} x2={cursorX} y1={0} y2={TL_H} stroke={APP_COLORS.textPrimary} strokeWidth={2} />
        </Svg>
      </View>
    </ScrollView>
  );
};

export default RealtimeView;
