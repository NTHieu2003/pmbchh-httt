import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { filterChipsStyles as styles } from './FilterChips.styles';

import type { ActiveLevelFilter } from './useDashboardDataProgress.hook';

const OPTIONS: { value: ActiveLevelFilter; label: string }[] = [
  { value: 'ALL', label: 'Tất cả mức độ' },
  { value: 'very_active', label: '★ Rất tích cực' },
  { value: 'active', label: 'Tích cực' },
  { value: 'normal', label: 'Đạt yêu cầu' },
  { value: 'low', label: 'Chưa có VB' },
];

export interface FilterChipsProps {
  value: ActiveLevelFilter;
  onChange: (value: ActiveLevelFilter) => void;
}

// Fixed 5-choice selector for "Mức độ tích cực" — web uses a <select>,
// mobile uses a horizontal chip row instead (AppSelect is a search/typeahead
// widget, not a fit for a small fixed enum like this).
const FilterChips: React.FC<FilterChipsProps> = ({ value, onChange }) => (
  <View style={styles.row}>
    {OPTIONS.map((opt) => (
      <TouchableOpacity
        key={opt.value}
        style={[styles.chip, value === opt.value && styles.chipActive]}
        onPress={() => onChange(opt.value)}
      >
        <Text style={[styles.chipText, value === opt.value && styles.chipTextActive]}>
          {opt.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default FilterChips;
