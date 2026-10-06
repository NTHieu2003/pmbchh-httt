import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const { width, height } = Dimensions.get('window');

// react-native-device-info reports the physical device class (phone vs
// tablet) based on screen size/DPI — bare-RN equivalent of what project A
// gets from expo-device. Evaluated once at module load; combine with
// `useIsTablet()` where a reactive (rotation/split-screen aware) value is
// needed.
const isTabletDevice = DeviceInfo.isTablet();

export const Device = {
  width,
  height,
  isIos: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isTablet: isTabletDevice,
  isSmallDevice: width < 375,
};
