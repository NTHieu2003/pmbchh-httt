import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

import { TABLET_BREAKPOINT } from '../dimension-common';
import { Device } from './device';

interface ScreenInfo {
  width: number;
  height: number;
  isTablet: boolean;
  isLandscape: boolean;
}

const getScreenInfo = (window: ScaledSize): ScreenInfo => {
  const { width, height } = window;

  return {
    width,
    height,
    // Reactive check: combines the device's physical class
    // (react-native-device-info, same source as `Device.isTablet`) with
    // the current shortest-side width, so split-screen / rotation on a
    // tablet is still detected correctly even if the OS reports it as a
    // "phone" (or vice-versa on a large unfolded foldable).
    isTablet: Device.isTablet || Math.min(width, height) >= TABLET_BREAKPOINT,
    isLandscape: width > height,
  };
};

/**
 * Reactive tablet/orientation detector.
 * Re-evaluates on every Dimensions change (rotation, split-screen, foldables).
 */
export const useIsTablet = (): ScreenInfo => {
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>(() =>
    getScreenInfo(Dimensions.get('window'))
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window }: { window: ScaledSize }) => {
        setScreenInfo(getScreenInfo(window));
      }
    );

    return () => subscription.remove();
  }, []);

  return screenInfo;
};
