import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BarChart3, Clock, Map } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import Map2DView from './Map2DView';
import RealtimeView from './RealtimeView';
import { resultViewStyles as styles } from './ResultView.styles';
import ThreatZoneView from './ThreatZoneView';

import type { ResultTab } from '../useCbrnSimulation.hook';
import type { RtFrame, RtModel, SimulationResult } from '../simulation';

export interface ResultViewProps {
  result: SimulationResult | null;
  resultVersion: number;
  maxHalfwidth: number;
  activeTab: ResultTab;
  onChangeTab: (tab: ResultTab) => void;

  rtModel: RtModel | null;
  rtFrame: RtFrame | null;
  rtTime: number;
  rtPlaying: boolean;
  rtSpeed: number;
  rtSpeedOptions: readonly number[];
  rtCurrentClock: Date;
  onRtTogglePlay: () => void;
  onRtReset: () => void;
  onRtSeek: (t: number) => void;
  onRtChangeSpeed: (speed: number) => void;
  onRtSetStartNow: () => void;

  onSetSourceAtCenter: (lat: number, lon: number) => void;
}

// Matches the web's 3-tab result area: "VÙNG ĐE DỌA" / "BẢN ĐỒ 2D" / "THỜI
// GIAN THỰC".
const ResultView: React.FC<ResultViewProps> = ({
  result,
  resultVersion,
  maxHalfwidth,
  activeTab,
  onChangeTab,
  rtModel,
  rtFrame,
  rtTime,
  rtPlaying,
  rtSpeed,
  rtSpeedOptions,
  rtCurrentClock,
  onRtTogglePlay,
  onRtReset,
  onRtSeek,
  onRtChangeSpeed,
  onRtSetStartNow,
  onSetSourceAtCenter,
}) => (
  <View style={styles.container}>
    <View style={styles.tabRow}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'threat_zone' && styles.tabActive]}
        onPress={() => onChangeTab('threat_zone')}
      >
        <BarChart3
          size={16}
          color={activeTab === 'threat_zone' ? APP_COLORS.chatBrandRed : APP_COLORS.chatIconMuted}
        />
        <Text style={[styles.tabText, activeTab === 'threat_zone' && styles.tabTextActive]}>
          VÙNG ĐE DỌA
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'map_2d' && styles.tabActive]}
        onPress={() => onChangeTab('map_2d')}
      >
        <Map
          size={16}
          color={activeTab === 'map_2d' ? APP_COLORS.chatBrandRed : APP_COLORS.chatIconMuted}
        />
        <Text style={[styles.tabText, activeTab === 'map_2d' && styles.tabTextActive]}>
          BẢN ĐỒ 2D
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'realtime' && styles.tabActive]}
        onPress={() => onChangeTab('realtime')}
      >
        <Clock
          size={16}
          color={activeTab === 'realtime' ? APP_COLORS.chatBrandRed : APP_COLORS.chatIconMuted}
        />
        <Text style={[styles.tabText, activeTab === 'realtime' && styles.tabTextActive]}>
          THỜI GIAN THỰC
        </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.content}>
      {activeTab === 'threat_zone' ? (
        <ThreatZoneView result={result} maxHalfwidth={maxHalfwidth} />
      ) : activeTab === 'map_2d' ? (
        <Map2DView
          result={result}
          resultVersion={resultVersion}
          onSetSourceAtCenter={onSetSourceAtCenter}
        />
      ) : (
        <RealtimeView
          rtModel={rtModel}
          rtFrame={rtFrame}
          rtTime={rtTime}
          rtPlaying={rtPlaying}
          rtSpeed={rtSpeed}
          rtSpeedOptions={rtSpeedOptions}
          rtCurrentClock={rtCurrentClock}
          onTogglePlay={onRtTogglePlay}
          onReset={onRtReset}
          onSeek={onRtSeek}
          onChangeSpeed={onRtChangeSpeed}
          onSetStartNow={onRtSetStartNow}
        />
      )}
    </View>
  </View>
);

export default ResultView;
