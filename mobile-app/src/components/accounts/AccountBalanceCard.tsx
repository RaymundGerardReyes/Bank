import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AccountSummary } from '../../models/Account';
import { Card } from '../common/Card';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';

interface AccountBalanceCardProps {
  account: AccountSummary;
  onPress?: () => void;
}

export const AccountBalanceCard = ({ account }: AccountBalanceCardProps) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.type}>{account.accountType} ACCOUNT</Text>
        <Text style={[styles.status, account.status === 'ACTIVE' ? styles.active : styles.frozen]}>
          {account.status}
        </Text>
      </View>
      <Text style={styles.accountNo}>{maskAccountNumber(account.accountNumber)}</Text>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(account.balance, account.currency)}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  type: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  status: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  active: {
    color: colors.success,
  },
  frozen: {
    color: colors.warning,
  },
  accountNo: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
  },
  balanceContainer: {
    marginTop: spacing.xs,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
  },
  balanceAmount: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.xs,
  },
});
