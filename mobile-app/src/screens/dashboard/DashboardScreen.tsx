import * as React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAccounts } from '../../hooks/useAccounts';
import { AccountBalanceCard } from '../../components/accounts/AccountBalanceCard';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const DashboardScreen = () => {
  const { accounts, isLoading } = useAccounts();

  return (
    <SecureScreenWrapper>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Overview</Text>
        <Text style={styles.subHeader}>Welcome to your banking portal</Text>

        {isLoading ? (
          <Text style={styles.loadingText}>Loading accounts...</Text>
        ) : (
          accounts.map((acc) => <AccountBalanceCard key={acc.accountNumber} account={acc} />)
        )}
      </ScrollView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.lg,
  },
  header: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subHeader: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  loadingText: {
    color: colors.textMuted,
    marginTop: spacing.md,
  },
});
