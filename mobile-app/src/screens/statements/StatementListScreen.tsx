import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const StatementListScreen = () => {
  return (
    <SecureScreenWrapper style={styles.container}>
      <Text style={styles.title}>Account Statements</Text>
      <Text style={styles.sub}>Select a monthly statement to view in-app PDF.</Text>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  sub: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
