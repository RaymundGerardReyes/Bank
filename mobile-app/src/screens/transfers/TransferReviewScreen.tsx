import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const TransferReviewScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Money Transfer</Text>
      <Text style={styles.detail}>Source: ACCT-100200</Text>
      <Text style={styles.detail}>Destination: ACCT-300400</Text>
      <Text style={styles.detail}>Amount: $250.00</Text>
      <Button title="Proceed to Biometric Confirmation" onPress={() => {}} style={styles.btn} />
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
  detail: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  btn: {
    marginTop: spacing.xl,
  },
});
