import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAccounts } from '../../hooks/useAccounts';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency } from '../../utils/formatters';

export const TransferReviewScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { sourceAccountNumber, destinationAccountNumber, amount, currency, description, idempotencyKey } = route.params || {};
  const { accounts } = useAccounts();

  const sourceAccount = accounts?.find((account) => account.accountNumber === sourceAccountNumber);
  const destAccount = accounts?.find((account) => account.accountNumber === destinationAccountNumber);
  const effectiveCurrency = currency || sourceAccount?.currency || 'PHP';

  const isMaskedInput = Boolean(
    sourceAccountNumber?.includes('*') || sourceAccountNumber?.includes('•') ||
    destinationAccountNumber?.includes('*') || destinationAccountNumber?.includes('•')
  );

  const isCrossCurrencyMismatch = Boolean(
    destAccount && destAccount.currency && sourceAccount && sourceAccount.currency &&
    destAccount.currency !== sourceAccount.currency
  );

  let validationError = '';
  if (isMaskedInput) {
    validationError = 'Masked account numbers cannot be used for transfers. Please return to edit details.';
  } else if (isCrossCurrencyMismatch) {
    validationError = `Cross-currency transfer from ${effectiveCurrency} to ${destAccount?.currency} is currently disabled. Both accounts must hold ${effectiveCurrency}.`;
  }

  // Formats account numbers cleanly in 4-character chunks for readable presentation
  const displaySource = sourceAccountNumber?.match(/.{1,4}/g)?.join(' ') || sourceAccountNumber;
  const displayDest = destinationAccountNumber?.match(/.{1,4}/g)?.join(' ') || destinationAccountNumber;

  return (
    <SecureScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Review Transfer</Text>
        <Text style={styles.subtitle}>Verify details before biometric authorization.</Text>
      </View>

      {validationError ? (
        <View style={styles.bannerContainer}>
          <ErrorBanner message={validationError} />
        </View>
      ) : null}

      <View style={styles.receiptCard}>
        <View style={styles.row}>
          <Text style={styles.label}>From Account</Text>
          <Text style={styles.value}>{displaySource}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>To Account</Text>
          <Text style={styles.value}>{displayDest}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Currency</Text>
          <Text style={styles.value}>{effectiveCurrency}</Text>
        </View>
        {description ? (
          <View style={styles.row}>
            <Text style={styles.label}>Memo</Text>
            <Text style={styles.value}>{description}</Text>
          </View>
        ) : null}

        <View style={styles.dashedDivider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{formatCurrency(amount, effectiveCurrency)}</Text>
        </View>
      </View>

      <Text style={styles.idempotencyText}>Trace Ref: {idempotencyKey?.split('-')[0]}</Text>

      <View style={styles.footer}>
        {validationError ? (
          <Button
            title="Edit Transfer Details"
            onPress={() => navigation.goBack()}
          />
        ) : (
          <Button
            title="Authorize with Passkey"
            onPress={() =>
              navigation.navigate('TransferConfirm', {
                ...route.params,
                currency: effectiveCurrency,
              })
            }
          />
        )}
      </View>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
    fontWeight: typography.fontWeight.heavy,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.medium,
    marginTop: 4,
  },
  bannerContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  receiptCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  dashedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: colors.divider,
    borderStyle: 'dashed',
    marginVertical: spacing.lg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.heavy,
  },
  totalValue: {
    color: colors.primary,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
    letterSpacing: -1,
  },
  idempotencyText: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: spacing.xl,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderColor: colors.divider,
  },
});