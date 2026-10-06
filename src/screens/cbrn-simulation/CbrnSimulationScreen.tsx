import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cbrnSimulationScreenStyles as styles } from './CbrnSimulationScreen.styles';
import { FormSidebar } from './formSidebar';
import { ResultView } from './resultView';
import { useCbrnSimulation } from './useCbrnSimulation.hook';

// H.II.128/129 — "Mô phỏng phát tán và lan truyền hóa học, phóng xạ trên
// bản đồ qua giao diện Mobile" + "Trích xuất, xử lý kết quả mô phỏng...".
// Same layout pattern as ChatbotScreen: no drawer hamburger here — the back
// arrow lives inside the form sidebar's own header instead (left side,
// next to its icon, matching ChatbotScreen's LeftSidebar `onBack`).
// Physics/API/logic ported from pmbc_web's mophongphattan feature — see
// `simulation/` for the ported math.
const CbrnSimulationScreen: React.FC = () => {
  const navigation = useNavigation();
  const sim = useCbrnSimulation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <FormSidebar {...sim} onBack={() => navigation.goBack()} />
        <ResultView
          result={sim.result}
          resultVersion={sim.resultVersion}
          maxHalfwidth={sim.maxHalfwidth}
          activeTab={sim.activeResultTab}
          onChangeTab={sim.setActiveResultTab}
          rtModel={sim.rtModel}
          rtFrame={sim.rtFrame}
          rtTime={sim.rtTime}
          rtPlaying={sim.rtPlaying}
          rtSpeed={sim.rtSpeed}
          rtSpeedOptions={sim.rtSpeedOptions}
          rtCurrentClock={sim.rtCurrentClock}
          onRtTogglePlay={sim.rtTogglePlay}
          onRtReset={sim.rtReset}
          onRtSeek={sim.rtSeek}
          onRtChangeSpeed={sim.setRtSpeed}
          onRtSetStartNow={sim.rtSetStartNow}
          onSetSourceAtCenter={sim.setSourceAtDomainCenter}
        />
      </View>
    </SafeAreaView>
  );
};

export default CbrnSimulationScreen;
