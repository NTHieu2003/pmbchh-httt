import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'lucide-react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { APP_COLORS } from '@/theme';

import { appDatePickerStyles as styles } from './AppDatePicker.styles';

export interface AppDatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

const formatDate = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
};

// Generic date-field — tap to open the OS's native date dialog (Android
// always renders DateTimePicker as a modal dialog, so it's only mounted
// while `isOpen`). Reusable anywhere a "Từ ngày"/"Đến ngày"-style field is
// needed, same spirit as AppSelect being the reusable search/select input.
const AppDatePicker: React.FC<AppDatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Chọn ngày',
  minimumDate,
  maximumDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setIsOpen(false);
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.wrap}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.input} onPress={() => setIsOpen(true)}>
        {value ? (
          <Text style={styles.valueText}>{formatDate(value)}</Text>
        ) : (
          <Text style={styles.placeholderText}>{placeholder}</Text>
        )}
        <Calendar size={16} color={APP_COLORS.chatIconMuted} />
      </TouchableOpacity>

      {isOpen && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export default AppDatePicker;
