import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AccountSummary } from '../../models/Account';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';

interface AccountBalanceCardProps {
  account: AccountSummary;
  onPress?: () => void;
  onTransfer?: (accountNumber: string) => void;
  onViewStatements?: (accountNumber: string) => void;
  onViewLedger?: (accountNumber: string) => void;
}

const statusTone = (status: string) => {
  if (status === 'ACTIVE') return 'success' as const;
  if (status === 'FROZEN') return 'warning' as const;
  return 'danger' as const;
};

export const AccountBalanceCard = ({
  account,
  onPress,
  onTransfer,
  onViewStatements,
  onViewLedger,
}: AccountBalanceCardProps) => {
  const [isNumberRevealed, setIsNumberRevealed] = React.useState(false);
  const isActionable = account.status === 'ACTIVE';
  const accountNumber = isNumberRevealed ? account.accountNumber : maskAccountNumber(account.accountNumber);

  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => pressed && styles.pressed}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.type}>{account.accountType}</Text>
            <Text style={styles.number}>{accountNumber}</Text>
          </View>
          <StatusBadge label={account.status} tone={statusTone(account.status)} />
        </View>

        <View style={styles.balanceBlock}>
          <Text style={styles.balanceLabel}>Available balance</Text>
          <Text style={[styles.balance, !isActionable && styles.balanceDimmed]}>
            {formatCurrency(account.balance, account.currency)}
          </Text>
        </View>

        <View style={styles.metadataRow}>
          <TouchableOpacity
            onPress={() => setIsNumberRevealed((current) => !current)}
            style={styles.subtleAction}
            accessibilityRole="button"
            accessibilityLabel={isNumberRevealed ? 'Hide account number' : 'Reveal account number'}
          >
            <Ionicons name={isNumberRevealed ? 'eye-off-outline' : 'eye-outline'} size={16} color={colors.textSecondary} />
            <Text style={styles.subtleActionText}>{isNumberRevealed ? 'Hide number' : 'Reveal number'}</Text>
          </TouchableOpacity>
          <Text style={styles.limitHint}>Limits apply</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.action}
            onPress={() => onViewLedger?.(account.accountNumber)}
            accessibilityRole="button"
          >
            <Ionicons name="time-outline" size={17} color={colors.primary} />
            <Text style={styles.actionText}>Activity</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.action, !isActionable && styles.actionDisabled]}
            disabled={!isActionable}
            onPress={() => onTransfer?.(account.accountNumber)}
            accessibilityRole="button"
            accessibilityState={{ disabled: !isActionable }}
          >
            <Ionicons name="swap-horizontal-outline" size={17} color={isActionable ? colors.primary : colors.textMuted} />
            <Text style={[styles.actionText, !isActionable && styles.actionTextDisabled]}>Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.action}
            onPress={() => onViewStatements?.(account.accountNumber)}
            accessibilityRole="button"
          >
            <Ionicons name="document-text-outline" size={17} color={colors.primary} />
            <Text style={styles.actionText}>Statements</Text>
          </TouchableOpacity>
        </View>

        {!isActionable ? (
          <View style={styles.warning}>
            <Text style={styles.warningText}>Money movement is paused while this account is {account.status.toLowerCase()}.</Text>
          </View>
        ) : null}
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.92,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.ml,
    paddingTop: spacing.ml,
  },
  type: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontWeight: typography.fontWeight.bold,
  },
  number: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    marginTop: spacing.xs,
  },
  balanceBlock: {
    paddingHorizontal: spacing.ml,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
  },
  balance: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
    fontWeight: typography.fontWeight.heavy,
    marginTop: spacing.xs,
  },
  balanceDimmed: {
    color: colors.textMuted,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.ml,
    paddingBottom: spacing.md,
  },
  subtleAction: {
    minHeight: spacing.touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtleActionText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    marginLeft: spacing.xs,
  },
  limitHint: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  action: {
    flex: 1,
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  actionDisabled: {
    opacity: 0.55,
  },
  actionText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  actionTextDisabled: {
    color: colors.textMuted,
  },
  warning: {
    backgroundColor: colors.warningBg,
    paddingHorizontal: spacing.ml,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  warningText: {
    color: colors.warning,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    textAlign: 'center',
  },
});
