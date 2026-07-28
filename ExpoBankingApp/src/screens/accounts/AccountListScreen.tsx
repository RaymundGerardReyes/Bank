import * as React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { useAccounts } from '../../hooks/useAccounts';
import { AccountBalanceCard } from '../../components/accounts/AccountBalanceCard';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const AccountListScreen = () => {
  const { accounts } = useAccounts();

  return (
    <SecureScreenWrapper style={styles.container}>
      <Text style={styles.title}>Your Accounts</Text>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.accountNumber}
        renderItem={({ item }) => <AccountBalanceCard account={item} />}
      />
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
    marginBottom: spacing.md,
  },
});
