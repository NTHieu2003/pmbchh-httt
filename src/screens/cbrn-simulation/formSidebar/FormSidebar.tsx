import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, PanelLeftClose, Radiation } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { APP_COLORS } from '@/theme';

import AtmosphericFormCard from './AtmosphericFormCard';
import ChemicalFormCard from './ChemicalFormCard';
import {
  createFormSidebarStyles,
  formSidebarStyles as staticStyles,
} from './FormSidebar.styles';
import ScenarioFormCard from './ScenarioFormCard';
import SourceLocationFormCard from './SourceLocationFormCard';

import type { UseCbrnSimulationResult } from '../useCbrnSimulation.hook';

export interface FormSidebarProps extends UseCbrnSimulationResult {
  // Renders a back arrow next to the header icon — same placement as the
  // chatbot's LeftSidebar `onBack`, since this panel now lives on the
  // left too.
  onBack: () => void;
}

// Left-side collapsible panel holding the 4 input form cards — same
// collapse/expand pattern as the chatbot's LeftSidebar (52px collapsed
// strip / expanded panel, back arrow next to the header icon).
const FormSidebar: React.FC<FormSidebarProps> = (props) => {
  const styles = createFormSidebarStyles(!props.isSidebarOpen);

  if (!props.isSidebarOpen) {
    return (
      <View style={styles.container}>
        <View style={styles.collapsedHeader}>
          <TouchableOpacity
            onPress={props.onBack}
            style={styles.collapsedIconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={18} color={APP_COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={props.toggleSidebar}
            style={styles.collapsedIconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Radiation size={18} color={APP_COLORS.chatBrandRed} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={staticStyles.header}>
        <View style={staticStyles.headerTitleRow}>
          <TouchableOpacity
            onPress={props.onBack}
            style={staticStyles.headerIconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={18} color={APP_COLORS.textPrimary} />
          </TouchableOpacity>
          <Radiation size={18} color={APP_COLORS.chatBrandRed} />
          <Text style={staticStyles.headerTitle}>MÔ PHỎNG PHÁT TÁN</Text>
        </View>
        <TouchableOpacity
          onPress={props.toggleSidebar}
          style={staticStyles.headerIconButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <PanelLeftClose size={16} color={APP_COLORS.chatIconMuted} />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        style={staticStyles.scroll}
        contentContainerStyle={staticStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={100}
        extraHeight={70}
        showsVerticalScrollIndicator={false}
      >
        <ChemicalFormCard
          chemQuery={props.chemQuery}
          onChangeChemQuery={props.setChemQuery}
          filteredChems={props.filteredChems}
          isChemSearching={props.isChemSearching}
          selectedChem={props.selectedChem}
          onSelectChemical={props.selectChemical}
        />

        <AtmosphericFormCard
          windSpeed={props.windSpeed}
          onChangeWindSpeed={props.setWindSpeed}
          calculatedStability={props.calculatedStability}
          windDirTo={props.windDirTo}
          onChangeWindDirTo={props.setWindDirTo}
          isDaytime={props.isDaytime}
          onChangeIsDaytime={props.setIsDaytime}
          insolation={props.insolation}
          onChangeInsolation={props.setInsolation}
          cloudCoverPct={props.cloudCoverPct}
          onChangeCloudCoverPct={props.setCloudCoverPct}
          ambientTemp={props.ambientTemp}
          onChangeAmbientTemp={props.setAmbientTemp}
        />

        <SourceLocationFormCard
          sourceLat={props.sourceLat}
          onChangeSourceLat={props.setSourceLat}
          sourceLon={props.sourceLon}
          onChangeSourceLon={props.setSourceLon}
        />

        <ScenarioFormCard
          currentScenario={props.currentScenario}
          onSelectScenario={props.setCurrentScenario}
          params={props.scenarioParams}
          onChangeParam={props.updateScenarioParam}
          liquidWarningMessage={props.liquidWarningMessage}
          tankHeightWarning={props.tankHeightWarning}
          isRunDisabled={props.isRunDisabled}
          isRunning={false}
          onRun={props.run}
          onRunRealtime={props.runRealtime}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default FormSidebar;
