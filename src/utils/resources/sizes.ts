import { Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { Device } from './device';

// Base design reference: 375x812 (iPhone X) scaled up to tablet widths.
// Same formula as project A (src/utils/resources/sizes.ts) so components
// ported from A behave consistently, but capped so text/spacing doesn't
// grow unbounded on large tablet screens.
const DW = 375;
const DH = 812;
const { width, height } = Dimensions.get('window');

const vw = width / DW;
const vh = height / DH;

// On tablets the raw width ratio (vw) grows too aggressively for spacing —
// clamp the scale factor so a 10" tablet doesn't get 2x the paddings.
const MAX_SCALE = Device.isTablet ? 1.35 : 1.15;
const clampScale = (value: number) => Math.min(value, MAX_SCALE);

const sizeWidth = (value: number) =>
  value * clampScale(width < height ? vw : vh);
const sizeHeight = (value: number) =>
  value * clampScale(width > height ? vw : vh);

export const deviceWidth = Device.width;
export const deviceHeight = Device.height;

const calculateFontsize = (current: number, max: number) =>
  current <= max ? current : max;

const BASE_FONT_SIZE = 2;
const fontScale = Device.isTablet ? 1.15 : 1;

const font = (rf: number, max: number) =>
  calculateFontsize(RFPercentage(rf) * fontScale, max * fontScale);

export const FontSize = {
  xs: font(BASE_FONT_SIZE + 0.25, 12),
  sm: font(BASE_FONT_SIZE + 0.5, 14),
  md: font(BASE_FONT_SIZE + 0.75, 16),
  lg: font(BASE_FONT_SIZE + 1, 18),
  xl: font(BASE_FONT_SIZE + 1.5, 20),
  displayXS: font(BASE_FONT_SIZE + 1.75, 24),
  displaySM: font(BASE_FONT_SIZE + 2.7, 30),
};

export const LineHeight = {
  xs: FontSize.xs * 1.4,
  sm: FontSize.sm * 1.4,
  md: FontSize.md * 1.4,
  lg: FontSize.lg * 1.4,
  xl: FontSize.xl * 1.4,
};

const Spacing = {
  width4: sizeWidth(4),
  width8: sizeWidth(8),
  width12: sizeWidth(12),
  width14: sizeWidth(14),
  width16: sizeWidth(16),
  width20: sizeWidth(20),
  width24: sizeWidth(24),
  width32: sizeWidth(32),
  width40: sizeWidth(40),
  height4: sizeHeight(4),
  height8: sizeHeight(8),
  height12: sizeHeight(12),
  height16: sizeHeight(16),
  height20: sizeHeight(20),
  height24: sizeHeight(24),
  height32: sizeHeight(32),
  height40: sizeHeight(40),
  height44: sizeHeight(44),
};

export const APP_SPACING = {
  xxxs: 4,
  xxs: 6,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  ...Spacing,
} as const;

export const Radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 20,
};

// Login card / centered-content max width so it doesn't stretch edge to
// edge on a 10-12" tablet.
export const CONTENT_MAX_WIDTH = Device.isTablet ? 960 : 480;
