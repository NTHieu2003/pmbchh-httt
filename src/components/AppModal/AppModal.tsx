import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { X } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import { appModalStyles as styles, MODAL_TONES, type AppModalTone } from './AppModal.styles';

export type AppModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  // Lucide icon shown in a tinted chip left of the title.
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  tone?: AppModalTone;
  // Extra header content right before the close button (e.g. a badge).
  headerRight?: React.ReactNode;
  hideCloseButton?: boolean;
  // Card width preset — sm 420 / md 600 / lg 820 / xl 1080 (capped at 94%
  // of the window width).
  size?: AppModalSize;
  // Fixed card height as a fraction of the window height (e.g. 0.9) — use
  // for viewers/maps/lists whose body must fill the card (`flex: 1`
  // children). Omit for content-sized dialogs, whose body scrolls past
  // `maxBodyHeight` instead.
  heightRatio?: number;
  // `true` (default): body is a ScrollView capped at a pixel max height.
  // `false`: body is a plain View — the caller handles scrolling (FlatList,
  // WebView, PDF…); pair with `heightRatio` so it has a definite height.
  scrollable?: boolean;
  // Wraps the card in react-native-keyboard-controller's
  // KeyboardAvoidingView — for dialogs with text inputs.
  avoidKeyboard?: boolean;
  // Tap on the dimmed backdrop closes the dialog (default true). Turn off
  // for forms where an accidental tap would lose input.
  dismissOnBackdrop?: boolean;
  footer?: React.ReactNode;
  bodyStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const SIZE_WIDTH: Record<AppModalSize, number> = { sm: 420, md: 600, lg: 820, xl: 1080 };

// Rough header + footer + backdrop padding allowance, so a content-sized
// dialog's scrolling body never pushes the card past the screen.
const CHROME_HEIGHT = 200;

// Shared shell for every dialog in the app. Bakes in the modal rules from
// HANDOFF §6:
//  - exactly ONE GestureHandlerRootView per Modal (RN's <Modal> is a
//    separate native window on Android; gesture-handler gestures like
//    ZoomableImage's pinch only work under a root inside it) — callers
//    must NOT add their own;
//  - the dismiss backdrop is a SIBLING Pressable behind the card, not an
//    ancestor TouchableOpacity, so it never competes with the card's
//    ScrollView pan or a second pinch finger (§6.17, §6.18);
//  - scrolling bodies get a pixel `maxHeight`, never `flex: 1` under a
//    maxHeight-only parent (§6.16).
const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  icon: Icon,
  tone = 'primary',
  headerRight,
  hideCloseButton,
  size = 'md',
  heightRatio,
  scrollable = true,
  avoidKeyboard,
  dismissOnBackdrop = true,
  footer,
  bodyStyle,
  children,
}) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, progress]);

  if (!visible) return null;

  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
  const cardWidth = Math.min(SIZE_WIDTH[size], windowWidth * 0.94);
  const toneColors = MODAL_TONES[tone];

  const cardSizeStyle: ViewStyle = heightRatio
    ? { width: cardWidth, height: windowHeight * heightRatio }
    : { width: cardWidth, maxHeight: windowHeight * 0.9 };
  const maxBodyHeight = windowHeight * 0.9 - CHROME_HEIGHT;

  const hasHeader = !!(title || Icon || headerRight || !hideCloseButton);

  const card = (
    <Animated.View
      style={[
        styles.card,
        cardSizeStyle,
        {
          opacity: progress,
          transform: [
            { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
            { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
          ],
        },
      ]}
    >
      {hasHeader && (
        <View style={styles.header}>
          {Icon && (
            <View style={[styles.iconChip, { backgroundColor: toneColors.soft }]}>
              <Icon size={20} color={toneColors.strong} />
            </View>
          )}
          <View style={styles.titleBox}>
            {typeof title === 'string' ? (
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
            ) : (
              title
            )}
            {typeof subtitle === 'string' ? (
              <Text style={styles.subtitle} numberOfLines={2}>
                {subtitle}
              </Text>
            ) : (
              subtitle
            )}
          </View>
          {headerRight}
          {!hideCloseButton && (
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Đóng"
            >
              <X size={18} color={APP_COLORS.chatSubtitle} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {scrollable ? (
        <ScrollView
          style={heightRatio ? styles.bodyFill : { maxHeight: maxBodyHeight }}
          contentContainerStyle={[styles.bodyContent, bodyStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.bodyFill, bodyStyle]}>{children}</View>
      )}

      {footer && <View style={styles.footer}>{footer}</View>}
    </Animated.View>
  );

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: progress }]}>
          <Pressable
            style={styles.backdropPressable}
            onPress={dismissOnBackdrop ? onClose : undefined}
            accessibilityLabel="Đóng hộp thoại"
          />
        </Animated.View>
        {avoidKeyboard ? (
          <KeyboardAvoidingView behavior="padding" style={styles.centerer} pointerEvents="box-none">
            {card}
          </KeyboardAvoidingView>
        ) : (
          <View style={styles.centerer} pointerEvents="box-none">
            {card}
          </View>
        )}
      </GestureHandlerRootView>
    </Modal>
  );
};

export default AppModal;
