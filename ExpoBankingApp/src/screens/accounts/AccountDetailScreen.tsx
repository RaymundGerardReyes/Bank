import * as React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const AccountDetailScreen = () => {
  return (
    <SecureScreenWrapper style={styles.container}>
      <Text style={styles.title}>Account Details</Text>
      <Text style={styles.info}>Detailed ledger transactions and limits for this account.</Text>
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
    marginBottom: spacing.xs,
  },
  info: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
