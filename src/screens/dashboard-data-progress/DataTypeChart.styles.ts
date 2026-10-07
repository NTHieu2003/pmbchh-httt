import { StyleSheet } from 'react-native';

// Shares `bottomRow` with ActiveContributorsList — wraps under it on
// narrow widths.
export const dataTypeChartStyles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: 420,
    minWidth: 360,
  },
});
