import { useRoute } from '@react-navigation/native';
import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const TransactionDetailScreen = () => {
  const route = useRoute<any>();
  // Expecting the transaction object to be passed via navigation
  const { transaction } = route.params || {};

  if (!transaction) {
    return (
      <SecureScreenWrapper style={styles.container}>
        <Text style={styles.errorText}>Transaction data unavailable.</Text>
      </SecureScreenWrapper>
    );
  }

  const isCredit = transaction.type === 'DEPOSIT';

  return (
    <SecureScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <View style={[styles.statusBadge, isCredit ? styles.badgeSuccess : styles.badgeNeutral]}>
              <Text style={styles.statusText}>{transaction.status}</Text>
            </View>
            <Text style={styles.amount}>
              {isCredit ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
            </Text>
            <Text style={styles.description}>{transaction.description || transaction.type}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.label}>Date & Time</Text>
            <Text style={styles.value}>{formatDate(transaction.timestamp)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Transaction Type</Text>
            <Text style={styles.value}>{transaction.type.replace('_', ' ')}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Source Account</Text>
            <Text style={styles.value}>{transaction.sourceAccountNumber || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Destination Account</Text>
            <Text style={styles.value}>{transaction.destinationAccountNumber || 'N/A'}</Text>
          </View>

          <View style={styles.dividerDashed} />

          <View style={styles.auditSection}>
            <Text style={styles.auditLabel}>IMMUTABLE LEDGER TRACE</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>System ID</Text>
              <Text style={styles.auditValue}>{transaction.transactionId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Idempotency Key</Text>
              <Text style={styles.auditValue}>{transaction.idempotencyKey}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface, // Soft backdrop to highlight the white receipt card
  },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  receiptCard: {
    backgroundColor: colors.dominant, // 60% pure white
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.secondary, // 30% Soft Blue
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: spacing.borderRadius.full,
    marginBottom: spacing.md,
  },
  badgeSuccess: { backgroundColor: '#ECFCCB' },
  badgeNeutral: { backgroundColor: '#F1F5F9' },
  statusText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  amount: {
    color: colors.accent,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: spacing.lg,
  },
  dividerDashed: {
    height: 1,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
    marginVertical: spacing.lg,
    opacity: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  value: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.lg,
  },
  auditSection: {
    backgroundColor: '#F8FAFC',
    padding: spacing.md,
    borderRadius: spacing.borderRadius.md,
  },
  auditLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  auditValue: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'monospace',
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
});