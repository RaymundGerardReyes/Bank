import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../common/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface BiometricPromptProps {
  onAuthenticate: () => void;
  title?: string;
}

export const BiometricPrompt = ({
  onAuthenticate,
  title = 'Biometric Step-Up Verification',
}: BiometricPromptProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Confirm biometrics to authorize this money transfer action.</Text>
      <Button title="Authenticate with Fingerprint / Face" onPress={onAuthenticate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius.lg,
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
