import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

import { APP_COLORS } from '@/theme';

import { threatZoneViewStyles as styles } from './ThreatZoneView.styles';

import type { SimulationResult } from '../simulation';

export interface ThreatZoneViewProps {
  result: SimulationResult | null;
  maxHalfwidth: number;
}
const W = 900,
  H = 340,
  PAD_L = 78,
  PAD_R = 40,
  PAD_T = 30,
  PAD_B = 44;
// Rendered pixel height of the SVG (viewBox stays 900x340 — this just
// controls the zoom level via SVG's default "meet" scaling). Bumped up from
// 220 so tick labels/numbers are actually legible instead of tiny.
const SVG_RENDER_HEIGHT = 420;

const ThreatZoneView: React.FC<ThreatZoneViewProps> = ({
  result,
  maxHalfwidth,
}) => {
  if (!result) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>
          Vui lòng chọn hóa chất và nhấn nút{' '}
          <Text style={styles.emptyTextBold}>&quot;VẼ VÙNG PHÁT TÁN&quot;</Text>{' '}
          ở cột bên trái để chạy tính toán.
        </Text>
      </View>
    );
  }

  const { levels, xl, model, Ric, Qpeak, decisionPath } = result;
  const hasContour = levels.some((lvl) => lvl.contour.length > 0) && xl > 0;

  const maxHw = Math.max(maxHalfwidth, 1);
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const sx = xl > 0 ? plotW / xl : 0;
  const sy = plotH / 2 / (maxHw * 1.15);
  const cx = (x: number) => PAD_L + x * sx;
  const cy = (hw: number, sign: number) => PAD_T + plotH / 2 - sign * hw * sy;

  // One Path per AEGL-1/2/3 level (or the single LOC level as a fallback —
  // see `finishSimulation`'s `hasAegl` branch), widest-first so narrower,
  // more-dangerous levels draw on top.
  const levelPaths = [...levels]
    .sort((a, b) => b.xl - a.xl)
    .map((lvl) => {
      if (!lvl.contour.length || lvl.xl <= 0) return null;
      const upper = lvl.contour.map((p) => [cx(p.x), cy(p.halfwidth, 1)]);
      const lower = lvl.contour
        .map((p) => [cx(p.x), cy(p.halfwidth, -1)])
        .slice()
        .reverse();
      const d =
        'M ' +
        upper.map((p) => p.join(',')).join(' L ') +
        ' L ' +
        lower.map((p) => p.join(',')).join(' L ') +
        ' Z';
      return { ...lvl, d };
    })
    .filter((v): v is NonNullable<typeof v> => v != null);

  // Dots mark the outermost (widest-reaching) level's sampled contour
  // points — same role the single-contour version served.
  const outermostContour = levels.reduce<(typeof levels)[number] | null>(
    (best, lvl) => (!best || lvl.xl > best.xl ? lvl : best),
    null
  )?.contour ?? [];

  const xTicks = [0, 1, 2, 3, 4].map(i => ({
    gx: PAD_L + (plotW * i) / 4,
    label: `${Math.round((xl * i) / 4)}m`,
  }));
  const yTicks = [-2, -1, 0, 1, 2].map(i => {
    const hwVal = maxHw * 1.15 * (i / 2);
    return {
      gy: PAD_T + plotH / 2 - hwVal * sy,
      label: `${Math.round(hwVal)}m`,
      i,
    };
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.badgeRow}>
        <View
          style={[
            styles.modelBadge,
            model === 'heavy_gas'
              ? styles.modelBadgeHeavy
              : styles.modelBadgeGauss,
          ]}
        >
          <Text style={styles.modelBadgeText}>
            {model === 'heavy_gas' ? 'KHÍ NẶNG (DEGADIS)' : 'GAUSS'}
          </Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Ric*</Text>
          <Text style={styles.metricValue}>{Ric.toFixed(2)}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Q đỉnh (kg/s)</Text>
          <Text style={styles.metricValue}>{Qpeak.toFixed(3)}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Khoảng cách LOC (m)</Text>
          <Text style={styles.metricValue}>{Math.round(xl)}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Bề rộng lớn nhất (m)</Text>
          <Text style={styles.metricValue}>{Math.round(maxHalfwidth * 2)}</Text>
        </View>
      </View>

      {levels.length > 1 && (
        <View style={styles.legendRow}>
          {levels.map((lvl) => (
            <View key={lvl.key} style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: lvl.stroke }]} />
              <Text style={styles.legendText}>
                {lvl.label}
                {lvl.loc_ppm != null ? ` (${lvl.loc_ppm.toLocaleString('en-US')} ppm)` : ''}
              </Text>
            </View>
          ))}
        </View>
      )}

      {hasContour ? (
        <View style={styles.svgWrap}>
          <Svg width="100%" height={SVG_RENDER_HEIGHT} viewBox={`0 0 ${W} ${H}`}>
            {xTicks.map(t => (
              <React.Fragment key={`x-${t.gx}`}>
                <Line
                  x1={t.gx}
                  x2={t.gx}
                  y1={PAD_T}
                  y2={PAD_T + plotH}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                />
                <SvgText
                  x={t.gx}
                  y={PAD_T + plotH + 24}
                  fontSize={14}
                  fill="#64748b"
                  textAnchor="middle"
                >
                  {t.label}
                </SvgText>
              </React.Fragment>
            ))}

            {yTicks.map(t => (
              <React.Fragment key={`y-${t.gy}`}>
                {t.i !== 0 && (
                  <Line
                    x1={PAD_L}
                    x2={PAD_L + plotW}
                    y1={t.gy}
                    y2={t.gy}
                    stroke="#cbd5e1"
                    strokeWidth={1}
                  />
                )}
                <SvgText
                  x={PAD_L - 12}
                  y={t.gy + 5}
                  fontSize={14}
                  fill="#64748b"
                  textAnchor="end"
                >
                  {t.label}
                </SvgText>
              </React.Fragment>
            ))}

            <Line
              x1={PAD_L}
              x2={PAD_L}
              y1={PAD_T}
              y2={PAD_T + plotH}
              stroke="#475569"
              strokeWidth={1.5}
            />

            {levelPaths.map((lvl) => (
              <Path
                key={lvl.key}
                d={lvl.d}
                fill={lvl.fill}
                fillOpacity={lvl.fillOpacity}
                stroke={lvl.stroke}
                strokeWidth={2.5}
              />
            ))}

            {outermostContour.map((p, i) => (
              <React.Fragment key={`dot-${i}`}>
                <Circle
                  cx={cx(p.x)}
                  cy={cy(p.halfwidth, 1)}
                  r={4}
                  fill="#0d9488"
                />
                <Circle
                  cx={cx(p.x)}
                  cy={cy(p.halfwidth, -1)}
                  r={4}
                  fill="#0d9488"
                />
              </React.Fragment>
            ))}

            <Circle
              cx={PAD_L}
              cy={PAD_T + plotH / 2}
              r={6}
              fill={APP_COLORS.chatAmber}
            />
          </Svg>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Không tính được vùng đe dọa với thông số hiện tại (nồng độ LOC không
            đạt tới).
          </Text>
        </View>
      )}

      <View style={styles.decisionLogBox}>
        {decisionPath.map((line, i) => (
          <Text key={i} style={styles.decisionLogLine}>
            {line}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default ThreatZoneView;
