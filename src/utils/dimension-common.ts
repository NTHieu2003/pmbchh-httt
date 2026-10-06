import { Dimensions } from 'react-native';

export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const WINDOW_WIDTH = Dimensions.get('window').width;

export const SCREEN_HEIGHT = Dimensions.get('screen').height;
export const SCREEN_WIDTH = Dimensions.get('screen').width;

// Breakpoint used across the app to switch phone <-> tablet layouts.
// Matches the common iPad-mini / Android 7" tablet width in portrait.
export const TABLET_BREAKPOINT = 768;
