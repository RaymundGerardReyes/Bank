import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const BiometricSetupScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enable Biometric Login</Text>
      <Text style={styles.subtitle}>Use fingerprint or face recognition for fast and secure access.</Text>
      <Button title="Enable Biometrics" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.lg,
  },
});
