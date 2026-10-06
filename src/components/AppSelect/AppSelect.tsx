import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { X } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import { appSelectStyles as styles } from './AppSelect.styles';

export interface AppSelectOption {
  key: string;
  label: string;
  subLabel?: string;
  // Original source object — handed back untouched on `onSelect` so the
  // caller doesn't need a second lookup by key.
  raw?: unknown;
}

export interface AppSelectProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (option: AppSelectOption) => void;
  options: AppSelectOption[];
  placeholder?: string;
  loading?: boolean;
  // Max rows visible before the dropdown scrolls (default 5).
  maxVisibleItems?: number;
  // true = filter `options` locally by `value` (fixed/static menu).
  // false (default) = trust `options` as already-filtered (remote search —
  // the caller owns debouncing/fetching, e.g. via useDebounce + an API call).
  filterLocally?: boolean;
  emptyText?: string;
  editable?: boolean;
  // Called when the clear ("x") button is pressed — shown whenever `value`
  // is non-empty. Defaults to `onChangeText('')` when not provided; pass
  // this explicitly when selecting also sets other state (e.g. a raw
  // selected object) that a plain text clear wouldn't reset.
  onClear?: () => void;
  // 'push' (default) — dropdown is a normal sibling, pushes layout below it
  // down while open. 'overlay' — dropdown floats above sibling content
  // instead (absolutely positioned), keeping the rest of the view fixed —
  // use this in tight rows like a filter bar where pushing would shove
  // neighboring buttons/fields around.
  dropdownMode?: 'push' | 'overlay';
}

const ROW_HEIGHT = 44;

// Generic search/select input with a scrollable dropdown (max
// `maxVisibleItems` rows visible, default 5) — works both as a
// locally-filtered static menu (`filterLocally`) and as a remote-search
// box (caller supplies already-fetched `options` + `loading`, e.g. driven
// by a debounced API call).
const AppSelect: React.FC<AppSelectProps> = ({
  value,
  onChangeText,
  onSelect,
  options,
  placeholder,
  loading = false,
  maxVisibleItems = 5,
  filterLocally = false,
  emptyText = 'Không có kết quả.',
  editable = true,
  onClear,
  dropdownMode = 'push',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Closing the keyboard by any means other than blurring this input
  // (Android back button, swipe-down-to-dismiss gesture) doesn't fire
  // `onBlur`, so the dropdown would otherwise stay open with no keyboard
  // and no way to type/select. Close it in lockstep with the keyboard.
  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidHide', () => setIsOpen(false));
    return () => sub.remove();
  }, []);

  const handleFocus = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsOpen(true);
  };

  // `keyboardDidHide` can close the dropdown (below) without the TextInput
  // ever actually blurring (e.g. swipe-down/back-gesture keyboard dismiss)
  // — so a later `onFocus` never re-fires on an already-"focused" input,
  // leaving typing with no dropdown to show results in. Reopening on every
  // keystroke sidesteps that focus/blur edge case entirely.
  const handleChangeText = (text: string) => {
    setIsOpen(true);
    onChangeText(text);
  };

  const handleBlur = () => {
    // Delay so a tap on a dropdown row (which blurs the input first) still
    // registers before the dropdown unmounts.
    closeTimeout.current = setTimeout(() => setIsOpen(false), 150);
  };

  const handleSelect = (option: AppSelectOption) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsOpen(false);
    onSelect(option);
  };

  const handleClear = () => {
    if (onClear) onClear();
    else onChangeText('');
  };

  const visibleOptions = filterLocally
    ? options.filter((opt) => {
        const q = value.trim().toLowerCase();
        if (!q) return true;
        return (
          opt.label.toLowerCase().includes(q) ||
          (opt.subLabel ?? '').toLowerCase().includes(q)
        );
      })
    : options;

  return (
    <View style={dropdownMode === 'overlay' ? { position: 'relative', zIndex: isOpen ? 20 : 0 } : undefined}>
      <View style={styles.inputWrap}>
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={APP_COLORS.chatIconMuted}
          editable={editable}
          style={[styles.input, value.length > 0 && styles.inputWithClear]}
        />
        {value.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPressIn={handleClear} hitSlop={8}>
            <X size={14} color={APP_COLORS.chatIconMuted} />
          </TouchableOpacity>
        )}
      </View>

      {isOpen && (
        <View
          style={[
            styles.dropdown,
            dropdownMode === 'overlay' && styles.dropdownOverlay,
            { maxHeight: ROW_HEIGHT * maxVisibleItems },
          ]}
        >
          {loading ? (
            <View style={styles.dropdownLoading}>
              <ActivityIndicator size="small" color={APP_COLORS.chatBrandRed} />
            </View>
          ) : visibleOptions.length === 0 ? (
            <Text style={styles.dropdownEmpty}>{emptyText}</Text>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
              {visibleOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={styles.dropdownItem}
                  // `onPress` (not `onPressIn`) — `onPressIn` fires on the
                  // initial touch, before the ScrollView gets a chance to
                  // see the touch turn into a drag, so every scroll attempt
                  // was mis-registered as selecting the row under the
                  // finger. `onPress` only fires on release when the touch
                  // didn't move past the drag threshold, which is what lets
                  // the ScrollView take over for an actual scroll gesture.
                  onPress={() => handleSelect(option)}
                >
                  <Text style={styles.dropdownItemLabel} numberOfLines={1}>
                    {option.label}
                  </Text>
                  {option.subLabel ? (
                    <Text style={styles.dropdownItemSubLabel} numberOfLines={1}>
                      {option.subLabel}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

export default AppSelect;
