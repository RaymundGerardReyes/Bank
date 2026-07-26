import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction, TransactionType } from '../../models/Transaction';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface TransactionListItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionListItem = ({ transaction, onPress }: TransactionListItemProps) => {
  const isCredit = transaction.type === TransactionType.DEPOSIT;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <Text style={styles.type}>{transaction.type.replace('_', ' ')}</Text>
        <Text style={styles.description}>{transaction.description || 'Banking Transaction'}</Text>
        <Text style={styles.date}>{formatDate(transaction.timestamp)}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, isCredit ? styles.credit : styles.debit]}>
          {isCredit ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
        </Text>
        <Text style={styles.status}>{transaction.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  left: {
    flex: 1,
  },
  type: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 4,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  credit: {
    color: colors.success,
  },
  debit: {
    color: colors.textPrimary,
  },
  status: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 4,
  },
});
