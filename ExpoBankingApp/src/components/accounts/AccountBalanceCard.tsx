import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AccountSummary } from '../../models/Account';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';
import { Card } from '../common/Card';

interface AccountBalanceCardProps {
  account: AccountSummary;
  onPress?: () => void;
  onTransfer?: (accountNumber: string) => void;
  onViewStatements?: (accountNumber: string) => void;
  onViewLedger?: (accountNumber: string) => void; // NEW: Direct link to the transaction history
}

export const AccountBalanceCard = ({
  account,
  onPress,
  onTransfer,
  onViewStatements,
  onViewLedger
}: AccountBalanceCardProps) => {

  // Local state to toggle secure visibility of the account number
  const [isNumberRevealed, setIsNumberRevealed] = React.useState(false);

  // Backend policy rule: only active accounts can initiate money movement
  const isActionable = account.status === 'ACTIVE';

  const toggleNumberVisibility = () => {
    setIsNumberRevealed(!isNumberRevealed);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!onPress}
    >
      <Card style={styles.card}>
        {/* Header: Account Type & Status Badge */}
        <View style={styles.header}>
          <Text style={styles.type}>{account.accountType} ACCOUNT</Text>
          <View style={[
            styles.statusBadge,
            account.status === 'ACTIVE' ? styles.badgeActive : styles.badgeFrozen
          ]}>
            <Text style={[
              styles.statusText,
              account.status === 'ACTIVE' ? styles.textActive : styles.textFrozen
            ]}>
              {account.status}
            </Text>
          </View>
        </View>

        {/* Body: Secure Account Number Toggle */}
        <View style={styles.accountNumberContainer}>
          <Text style={styles.accountNo}>
            {isNumberRevealed
              ? account.accountNumber
              : maskAccountNumber(account.accountNumber)}
          </Text>
          <TouchableOpacity
            style={styles.revealButton}
            onPress={toggleNumberVisibility}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.revealText}>
              {isNumberRevealed ? '👁️ Hide' : '👁️‍🗨️ Reveal'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Body: Secure Balance & Limit Context */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={[
            styles.balanceAmount,
            !isActionable && styles.balanceAmountDimmed
          ]}>
            {formatCurrency(account.balance, account.currency)}
          </Text>
          <Text style={styles.limitHint}>
            Includes pending holds. Subject to daily withdrawal limits.
          </Text>
        </View>

        {/* Footer: Contextual Quick Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onViewLedger && onViewLedger(account.accountNumber)}
          >
            <Text style={styles.actionText}>📊 History</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.actionButton, !isActionable && styles.actionButtonDisabled]}
            disabled={!isActionable}
            onPress={() => onTransfer && onTransfer(account.accountNumber)}
          >
            <Text style={[styles.actionText, !isActionable && styles.actionTextDisabled]}>
              ↗️ Transfer
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onViewStatements && onViewStatements(account.accountNumber)}
          >
            <Text style={styles.actionText}>📄 Stmts</Text>
          </TouchableOpacity>
        </View>

        {/* Security Warning for Non-Active Accounts */}
        {!isActionable && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              Transfers disabled. Account is currently {account.status.toLowerCase()}.
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dominant, // 60% White
    borderColor: colors.secondary,    // 30% Soft Blue
    borderWidth: 1.5,
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  type: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 1,
  },
  badgeActive: {
    backgroundColor: '#ECFCCB',
    borderColor: colors.success,
  },
  badgeFrozen: {
    backgroundColor: '#FEF2F2',
    borderColor: colors.danger,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textActive: {
    color: colors.success,
  },
  textFrozen: {
    color: colors.danger,
  },
  accountNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  accountNo: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  revealButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  revealText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  balanceContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  balanceAmount: {
    color: colors.accent, // 10% Deep Navy
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  balanceAmountDimmed: {
    color: colors.textMuted,
  },
  limitHint: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1.5,
    borderTopColor: colors.surface,
    backgroundColor: '#F8FAFC',
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  actionTextDisabled: {
    color: colors.textMuted,
  },
  divider: {
    width: 1.5,
    backgroundColor: colors.surface,
  },
  warningContainer: {
    backgroundColor: '#FEF2F2',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
  },
  warningText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});