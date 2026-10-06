import React from 'react';
import { Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { APP_COLORS } from '@/theme';

import { appPopoverStyles as styles } from './AppPopover.styles';

export interface AppPopoverItem {
  key: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  color?: string;
  destructive?: boolean;
  onPress: () => void;
}

export interface AppPopoverAnchor {
  x: number;
  y: number;
}

export interface AppPopoverProps {
  visible: boolean;
  anchor: AppPopoverAnchor | null;
  items: AppPopoverItem[];
  onClose: () => void;
  // Menu width in px — default 180, kept for small action menus (kebab).
  width?: number;
  // Caps how many rows are visible before the list scrolls — default
  // undefined (no cap, every item renders, no scroll — original behavior).
  // Pass this for longer/dynamic lists (e.g. "view hidden items").
  maxVisibleItems?: number;
  // Whether tapping a row closes the popover — default true (kebab-menu
  // behavior: pick one action, done). Pass false for a multi-action list
  // where the popover should stay open across several taps (e.g. "view
  // hidden items", un-hiding several in a row).
  closeOnItemPress?: boolean;
}

const MENU_WIDTH = 180;
const ROW_HEIGHT = 44;
const EDGE_MARGIN = 8;

// Generic context-menu popover — opens right at the tap point (pass the
// tap's `pageX`/`pageY` as `anchor`), clamped to stay on-screen. Used by
// the chatbot left sidebar's conversation kebab menu; reusable anywhere
// else a "tap for a small action menu at this point" pattern is needed —
// `width`/`maxVisibleItems` make it scale up to longer lists too (e.g. the
// chatbot history screen's "view hidden conversations" popover).
const AppPopover: React.FC<AppPopoverProps> = ({
  visible,
  anchor,
  items,
  onClose,
  width,
  maxVisibleItems,
  closeOnItemPress = true,
}) => {
  if (!visible || !anchor) return null;

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const menuWidth = width ?? MENU_WIDTH;
  const visibleRowCount = maxVisibleItems
    ? Math.min(items.length, maxVisibleItems)
    : items.length;
  const menuHeight = visibleRowCount * ROW_HEIGHT + 16;

  let left = anchor.x - menuWidth;
  if (left < EDGE_MARGIN) left = EDGE_MARGIN;
  if (left + menuWidth > screenWidth - EDGE_MARGIN) {
    left = screenWidth - EDGE_MARGIN - menuWidth;
  }

  let top = anchor.y;
  if (top + menuHeight > screenHeight - EDGE_MARGIN) {
    top = screenHeight - EDGE_MARGIN - menuHeight;
  }

  const handleItemPress = (item: AppPopoverItem) => {
    if (closeOnItemPress) onClose();
    item.onPress();
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={[styles.menu, { left, top, width: menuWidth, maxHeight: menuHeight }]}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={items.length > visibleRowCount}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.item, index > 0 && styles.itemDivider]}
                onPress={() => handleItemPress(item)}
              >
                {item.icon && (
                  <item.icon
                    size={16}
                    color={item.color ?? (item.destructive ? APP_COLORS.danger : APP_COLORS.textPrimary)}
                  />
                )}
                <Text
                  style={[
                    styles.itemLabel,
                    { color: item.color ?? (item.destructive ? APP_COLORS.danger : APP_COLORS.textPrimary) },
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default AppPopover;
