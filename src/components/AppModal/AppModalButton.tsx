import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';

import { appModalButtonStyles as styles } from './AppModalButton.styles';

export type AppModalButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

export interface AppModalButtonProps {
  label: string;
  onPress: () => void;
  variant?: AppModalButtonVariant;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  loading?: boolean;
  disabled?: boolean;
  // Stretch to fill the footer row (e.g. AppDialog's equal-width buttons).
  block?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TEXT_COLOR: Record<AppModalButtonVariant, string> = {
  primary: '#ffffff',
  danger: '#ffffff',
  success: '#ffffff',
  secondary: '#1f2937',
};

// Footer action button used by AppModal dialogs and AppDialog.
const AppModalButton: React.FC<AppModalButtonProps> = ({
  label,
  onPress,
  variant = 'secondary',
  icon: Icon,
  loading,
  disabled,
  block,
  style,
}) => {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        styles[variant],
        block && styles.block,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={TEXT_COLOR[variant]} />
      ) : (
        Icon && <Icon size={16} color={TEXT_COLOR[variant]} />
      )}
      <Text style={[styles.label, { color: TEXT_COLOR[variant] }]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default AppModalButton;
