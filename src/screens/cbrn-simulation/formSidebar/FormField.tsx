import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { APP_COLORS } from '@/theme';

import { formFieldStyles as styles } from './FormField.styles';

export interface FormFieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

// Label-above-input wrapper shared by every field in the 4 form cards.
export const FormField: React.FC<FormFieldProps> = ({ label, hint, children }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    {children}
    {hint ? <Text style={styles.hint}>{hint}</Text> : null}
  </View>
);

export interface NumberFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label: string;
  hint?: string;
  value: number;
  onChangeValue: (value: number) => void;
}

// Free-text-entry numeric field (keeps the raw string while typing so
// "0." / "-" aren't clobbered mid-edit, parses to a number on every
// change like the web `[(ngModel)]` number inputs).
export const NumberField: React.FC<NumberFieldProps> = ({
  label,
  hint,
  value,
  onChangeValue,
  ...inputProps
}) => {
  const [text, setText] = React.useState(String(value));

  React.useEffect(() => {
    setText(String(value));
  }, [value]);

  const handleChangeText = (next: string) => {
    setText(next);
    const parsed = Number(next.replace(',', '.'));
    if (!Number.isNaN(parsed) && next.trim() !== '') {
      onChangeValue(parsed);
    }
  };

  return (
    <FormField label={label} hint={hint}>
      <TextInput
        {...inputProps}
        value={text}
        onChangeText={handleChangeText}
        keyboardType="numeric"
        placeholderTextColor={APP_COLORS.chatIconMuted}
        style={styles.input}
      />
    </FormField>
  );
};
