import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const DeviceManagementScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trusted Mobile Devices</Text>
      <Text style={styles.device}>Active Device: Android SM-G998B (This Device)</Text>
      <Text style={styles.status}>Integrity: PASS (Unrooted, Certificate Pinned)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  device: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  status: {
    color: colors.success,
    fontSize: 14,
    marginTop: 4,
  },
});
