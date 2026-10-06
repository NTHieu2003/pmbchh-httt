import React from 'react';
import { ActivityIndicator, Switch, Text, TouchableOpacity, View } from 'react-native';
import { ArrowRight, Clock } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import FormCard from './FormCard';
import { NumberField } from './FormField';
import { scenarioFormCardStyles as styles } from './ScenarioFormCard.styles';
import { SCENARIO_TABS } from '../simulation';

import type { ScenarioKey, ScenarioParams } from '../simulation';

export interface ScenarioFormCardProps {
  currentScenario: ScenarioKey;
  onSelectScenario: (scenario: ScenarioKey) => void;
  params: ScenarioParams;
  onChangeParam: <K extends keyof ScenarioParams>(key: K, value: ScenarioParams[K]) => void;
  liquidWarningMessage: string | null;
  tankHeightWarning: string | null;
  isRunDisabled: boolean;
  isRunning: boolean;
  onRun: () => void;
  onRunRealtime: () => void;
}

// Card "MÔ HÌNH" (panel #4) — scenario tab row + the params relevant to
// whichever scenario is selected (see `simulation/scenarios.ts` for the
// tab list, and `simulation/runSimulation.ts` for how each param maps to
// the physics branch it drives).
const ScenarioFormCard: React.FC<ScenarioFormCardProps> = ({
  currentScenario,
  onSelectScenario,
  params,
  onChangeParam,
  liquidWarningMessage,
  tankHeightWarning,
  isRunDisabled,
  isRunning,
  onRun,
  onRunRealtime,
}) => {
  const activeTab = SCENARIO_TABS.find((t) => t.key === currentScenario);

  return (
    <FormCard number={4} title="MÔ HÌNH">
      <View style={styles.tabRow}>
        {SCENARIO_TABS.map((tab) => {
          const isActive = tab.key === currentScenario;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onSelectScenario(tab.key)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeTab && <Text style={styles.description}>{activeTab.description}</Text>}

      {liquidWarningMessage && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>{liquidWarningMessage}</Text>
        </View>
      )}

      {currentScenario === 'direct' && (
        <>
          <NumberField
            label="Lưu lượng (kg/s)"
            value={params.p_rate}
            onChangeValue={(v) => onChangeParam('p_rate', v)}
          />
          <NumberField
            label="Khối lượng ban đầu (kg)"
            value={params.p_mass}
            onChangeValue={(v) => onChangeParam('p_mass', v)}
          />
        </>
      )}

      {currentScenario === 'puddle' && (
        <NumberField
          label="Diện tích vũng (m²)"
          value={params.p_area}
          onChangeValue={(v) => onChangeParam('p_area', v)}
        />
      )}

      {currentScenario === 'tank_liquid_spreading' && (
        <>
          <NumberField
            label="Diện tích lỗ (m²)"
            value={params.p_Af_liquid}
            onChangeValue={(v) => onChangeParam('p_Af_liquid', v)}
          />
          <NumberField
            label="Bán kính bồn (m)"
            value={params.p_tankRadius}
            onChangeValue={(v) => onChangeParam('p_tankRadius', v)}
          />
          <NumberField
            label="Độ cao lỗ so với đáy (m)"
            value={params.p_holeHeight}
            onChangeValue={(v) => onChangeParam('p_holeHeight', v)}
          />
          <NumberField
            label="Mực lỏng ban đầu (m)"
            value={params.p_liquidHeight}
            onChangeValue={(v) => onChangeParam('p_liquidHeight', v)}
          />
          <NumberField
            label="Chiều cao bồn (m)"
            value={params.p_tankHeight}
            onChangeValue={(v) => onChangeParam('p_tankHeight', v)}
          />
          {tankHeightWarning && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>{tankHeightWarning}</Text>
            </View>
          )}
        </>
      )}

      {currentScenario === 'tank_pressurized' && (
        <>
          <View style={styles.checkboxRow}>
            <Switch
              value={params.p_isNh3Cl2}
              onValueChange={(v) => onChangeParam('p_isNh3Cl2', v)}
              trackColor={{ true: APP_COLORS.chatBrandRed, false: APP_COLORS.chatBorder }}
              thumbColor={APP_COLORS.white}
            />
            <Text style={styles.checkboxLabel}>Là NH3 hoặc Cl2 (áp dụng #5 DIERS)</Text>
          </View>
          <NumberField
            label="Áp suất bồn P_h (Pa)"
            value={params.p_Ph}
            onChangeValue={(v) => onChangeParam('p_Ph', v)}
          />
          <NumberField
            label="Nhiệt độ bên trong bồn (K)"
            value={params.p_T_tank}
            onChangeValue={(v) => onChangeParam('p_T_tank', v)}
          />
          <NumberField
            label="Diện tích lỗ (m²)"
            value={params.p_Af_tank}
            onChangeValue={(v) => onChangeParam('p_Af_tank', v)}
          />
          <NumberField
            label="Lưu lượng thể tích cho DIERS (m³/s)"
            value={params.p_volRate}
            onChangeValue={(v) => onChangeParam('p_volRate', v)}
          />
          <NumberField
            label="Diện tích bồn cho DIERS (m²)"
            value={params.p_tankArea}
            onChangeValue={(v) => onChangeParam('p_tankArea', v)}
          />
        </>
      )}

      {currentScenario === 'pipeline' && (
        <>
          <NumberField
            label="Chiều dài ống (m)"
            value={params.p_pipeLength}
            onChangeValue={(v) => onChangeParam('p_pipeLength', v)}
          />
          <NumberField
            label="Đường kính ống (m)"
            value={params.p_pipeDiameter}
            onChangeValue={(v) => onChangeParam('p_pipeDiameter', v)}
          />
          <NumberField
            label="Đường kính lỗ vỡ (m)"
            value={params.p_holeDiameter}
            onChangeValue={(v) => onChangeParam('p_holeDiameter', v)}
          />
          <NumberField
            label="Áp suất ban đầu P0 (Pa)"
            value={params.p_P0}
            onChangeValue={(v) => onChangeParam('p_P0', v)}
          />
          <NumberField
            label="Gamma (Cp/Cv)"
            value={params.p_gamma_pipe}
            onChangeValue={(v) => onChangeParam('p_gamma_pipe', v)}
          />
        </>
      )}

      <TouchableOpacity
        style={[styles.runButton, isRunDisabled && styles.runButtonDisabled]}
        onPress={onRun}
        disabled={isRunDisabled || isRunning}
      >
        {isRunning ? (
          <ActivityIndicator size="small" color={APP_COLORS.white} />
        ) : (
          <>
            <Text style={styles.runButtonText}>VẼ VÙNG PHÁT TÁN</Text>
            <ArrowRight size={16} color={APP_COLORS.white} />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.realtimeButton, isRunDisabled && styles.runButtonDisabled]}
        onPress={onRunRealtime}
        disabled={isRunDisabled || isRunning}
      >
        <Clock size={16} color={APP_COLORS.primary} />
        <Text style={styles.realtimeButtonText}>CHẠY THỜI GIAN THỰC</Text>
      </TouchableOpacity>
    </FormCard>
  );
};

export default ScenarioFormCard;
