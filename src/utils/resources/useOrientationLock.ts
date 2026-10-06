import { useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';

export const useOrientationLock = () => {
  useEffect(() => {
    Orientation.lockToLandscape();
  }, []);
};
