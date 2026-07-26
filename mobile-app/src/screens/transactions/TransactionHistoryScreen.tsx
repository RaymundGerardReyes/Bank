import * as React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { useTransactions } from '../../hooks/useTransactions';
import { TransactionListItem } from '../../components/transactions/TransactionListItem';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const TransactionHistoryScreen = () => {
  const { transactions } = useTransactions('ACCT-100200');

  return (
    <SecureScreenWrapper style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.transactionId || item.id.toString()}
        renderItem={({ item }) => <TransactionListItem transaction={item} />}
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
