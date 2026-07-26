import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const TransactionDetailScreen = () => {
  return (
    <SecureScreenWrapper style={styles.container}>
      <Text style={styles.title}>Transaction Details</Text>
      <Text style={styles.detail}>Idempotency Key: IDEM-UUID-991203</Text>
      <Text style={styles.detail}>Audit Status: COMPLETED</Text>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
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
    fontSize: 14,
    marginBottom: spacing.xs,
  },
});
