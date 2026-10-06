import React from 'react';
import { Image, StyleSheet, type ImageSourcePropType } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface ZoomableImageProps {
  source: ImageSourcePropType;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;

// Generic pinch-to-zoom + pan + double-tap-to-reset image viewer, built on
// react-native-gesture-handler's Gesture API (already the installed v3) +
// reanimated — no extra dependency needed. Used by MeetingPlanInfoModal's
// "Sơ đồ chỗ ngồi" tab (see SEATING_CHART_IMAGE there for how to swap the
// actual image later), but intentionally generic/reusable elsewhere.
const ZoomableImage: React.FC<ZoomableImageProps> = ({ source }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const reset = () => {
    'worklet';
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedScale.value = 1;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const next = savedScale.value * e.scale;
      scale.value = Math.min(Math.max(next, MIN_SCALE), MAX_SCALE);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value <= MIN_SCALE) reset();
    });

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      if (scale.value <= MIN_SCALE) return;
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > MIN_SCALE) {
        reset();
      } else {
        scale.value = withTiming(2);
        savedScale.value = 2;
      }
    });

  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // No GestureHandlerRootView here — it needs to sit at the Modal's own
  // root (see MeetingPlanInfoModal.tsx), wrapping the legacy
  // TouchableOpacity/onStartShouldSetResponder backdrop-dismiss too.
  // Nesting one only around this image left the pinch's second touch
  // handled by gesture-handler's native layer while the outer backdrop
  // still tracked touches through RN's legacy responder system — on
  // release, that stray touch resolved as a tap and closed the modal.
  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Image source={source} style={styles.image} resizeMode="contain" />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
});

export default ZoomableImage;
