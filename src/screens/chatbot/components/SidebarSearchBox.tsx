import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Search, X } from 'lucide-react-native';

import { APP_COLORS } from '@/theme';

import { sidebarSearchBoxStyles as styles } from './SidebarSearchBox.styles';

export interface SidebarSearchBoxProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}

// Shared by RightSidebar ("Ngành đặc thù") and LeftSidebar (conversations)
// so both search rows stay pixel-identical instead of drifting apart.
const SidebarSearchBox: React.FC<SidebarSearchBoxProps> = ({
  value,
  onChangeText,
  placeholder,
}) => (
  <View style={styles.searchBox}>
    <Search size={14} color={APP_COLORS.chatIconMuted} />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={APP_COLORS.chatIconMuted}
      style={styles.searchInput}
      autoFocus
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={() => onChangeText('')}>
        <X size={14} color={APP_COLORS.chatIconMuted} />
      </TouchableOpacity>
    )}
  </View>
);

export default SidebarSearchBox;
