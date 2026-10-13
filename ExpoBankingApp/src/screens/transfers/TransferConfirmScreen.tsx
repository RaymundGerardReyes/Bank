import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button } from '../../components/common/Button';
import { BiometricPrompt } from '../../components/security/BiometricPrompt';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAccounts } from '../../hooks/useAccounts';
import { useBiometric } from '../../hooks/useBiometric';
import { idempotencyKeyService } from '../../services/transaction/idempotencyKeyService';
import { transactionService } from '../../services/transaction/transactionService';
import { accountApi } from '../../state/api/accountApi';
import { transactionApi } from '../../state/api/transactionApi';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const TransferConfirmScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { accounts } = useAccounts();

  const [status, setStatus] = React.useState<'PENDING' | 'LOADING' | 'SUCCESS' | 'ERROR'>('PENDING');
  const [errorType, setErrorType] = React.useState<'PERMANENT' | 'NETWORK' | 'TRANSIENT'>('PERMANENT');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [receipt, setReceipt] = React.useState<any>(null);
  const { authenticate } = useBiometric();
  const { sourceAccountNumber, destinationAccountNumber, amount, currency, description, idempotencyKey } = route.params || {};

  const sourceAccount = accounts?.find((account) => account.accountNumber === sourceAccountNumber);
  const effectiveCurrency = currency || sourceAccount?.currency || 'PHP';

  const cleanSource = (sourceAccountNumber || '').replace(/\s/g, '');
  const cleanDest = (destinationAccountNumber || '').replace(/\s/g, '');

  const handleConfirm = async () => {
    // Pre-flight check: Never allow masked identifiers to reach transaction submission
    if (cleanDest.includes('*') || cleanDest.includes('•') || cleanSource.includes('*') || cleanSource.includes('•')) {
      setStatus('ERROR');
      setErrorType('PERMANENT');
      setErrorMessage('Masked account numbers cannot be used for transfers. Please go back and provide the full unmasked account number.');
      return;
    }

    if (!cleanSource || !cleanDest) {
      setStatus('ERROR');
      setErrorType('PERMANENT');
      setErrorMessage('Both source and destination account numbers are required.');
      return;
    }

    const passed = await authenticate(`Authorize transfer of ${formatCurrency(amount, effectiveCurrency)}`);
    if (passed) {
      setStatus('LOADING');
      try {
        const txData = await transactionService.transferInternal({
          sourceAccountNumber: cleanSource,
          destinationAccountNumber: cleanDest,
          amount,
          description,
          idempotencyKey,
        });

        // Verify authoritative transfer completion before marking success
        if (
          txData &&
          (txData.status === 'COMPLETED' || txData.status === 'PENDING') &&
          Boolean(txData.transactionReference)
        ) {
          dispatch(accountApi.util.invalidateTags(['Accounts']));
          dispatch(transactionApi.util.invalidateTags(['Transactions']));

          setReceipt(txData);
          setStatus('SUCCESS');
          idempotencyKeyService.resetKey();
        } else {
          setStatus('ERROR');
          setErrorType('PERMANENT');
          setErrorMessage(
            txData?.status === 'FAILED'
              ? 'Transfer was declined or failed to complete.'
              : 'Transfer was not completed by the banking server.'
          );
        }
      } catch (error: any) {
        setStatus('ERROR');
        const errStatus = error?.response?.status;
        const errCode = error?.response?.data?.errorCode;
        const cloudflareError = error?.response?.data?.cloudflare_error;
        let specificMsg = error?.response?.data?.message || error?.response?.data?.detail;

        if (errCode === 'CROSS_CURRENCY_POSTING_NOT_AVAILABLE' || errCode === 'CROSS_CURRENCY_NOT_SUPPORTED') {
          specificMsg = 'Cross-currency transfers are currently unavailable. Both accounts must hold the same native currency.';
          setErrorType('PERMANENT');
        } else if (errCode === 'INVALID_REQUEST' && (specificMsg?.toLowerCase().includes('masked') || specificMsg?.includes('*') || specificMsg?.includes('•'))) {
          specificMsg = 'Masked account numbers cannot be used for transfers. Please enter the complete unmasked account number.';
          setErrorType('PERMANENT');
        } else if (errStatus === 404 && specificMsg?.includes('Destination account')) {
          specificMsg = 'Destination account does not exist. Please verify the recipient account number and ensure full unmasked digits are used.';
          setErrorType('PERMANENT');
        } else if (errStatus === 403) {
          specificMsg = specificMsg || 'Access denied: You are not authorized to debit this source account.';
          setErrorType('PERMANENT');
        } else if (errStatus === 400) {
          specificMsg = specificMsg || 'Invalid transfer request.';
          setErrorType('PERMANENT');
        } else if (!error?.response && error?.request) {
          specificMsg = 'Network timeout or interrupted connection. The server may still be processing your transfer. Please check your transaction history before attempting to resend.';
          setErrorType('NETWORK');
        } else if (!specificMsg && (errStatus === 502 || errStatus === 503 || errStatus === 504 || cloudflareError)) {
          specificMsg = 'Banking service is temporarily connecting or initializing. Please wait a moment and try again.';
          setErrorType('TRANSIENT');
        } else {
          specificMsg = error?.message || 'Transaction declined by server.';
          setErrorType('PERMANENT');
        }
        setErrorMessage(specificMsg);
      }
    }
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      {status === 'PENDING' && (
        <View style={styles.centerContent}>
          <Text style={styles.title}>Final Authorization</Text>
          <BiometricPrompt title="Verify Identity" onAuthenticate={handleConfirm} />
        </View>
      )}

      {status === 'LOADING' && (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Encrypting & processing ledger entry...</Text>
        </View>
      )}

      {status === 'SUCCESS' && receipt && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successHeader}>
            <View style={styles.successIconBg}>
              <Ionicons name="checkmark" size={32} color={colors.textInverse} />
            </View>
            <Text style={styles.successTitle}>Transfer Successful</Text>
            <Text style={styles.successAmount}>{formatCurrency(receipt.amount, receipt.currency || effectiveCurrency)}</Text>
            <Text style={styles.successDate}>{formatDate(receipt.createdAt || receipt.timestamp)}</Text>
          </View>

          <View style={styles.receiptCard}>
            <View style={styles.row}>
              <Text style={styles.label}>Reference</Text>
              <Text style={styles.valueMono}>{receipt.transactionReference}</Text>
            </View>
            <View style={styles.dashedDivider} />
            <View style={styles.row}>
              <Text style={styles.label}>From Account</Text>
              <Text style={styles.value}>{receipt.sourceAccountNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>To Account</Text>
              <Text style={styles.value}>{receipt.destinationAccountNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Currency</Text>
              <Text style={styles.value}>{receipt.currency || effectiveCurrency}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              title="Return to Dashboard"
              onPress={() => navigation.navigate('MainTabs', { screen: 'Dashboard' })}
            />
          </View>
        </ScrollView>
      )}

      {status === 'ERROR' && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.errorContainer}>
            <View style={styles.errorIconBg}>
              <Ionicons name="alert-circle" size={36} color={colors.textInverse} />
            </View>
            <Text style={styles.errorTitle}>
              {errorType === 'NETWORK' ? 'Connection Interrupted' : 'Transfer Failed'}
            </Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>

            <View style={styles.footer}>
              {errorType === 'TRANSIENT' ? (
                <>
                  <Button
                    title="Retry Transfer"
                    onPress={handleConfirm}
                    style={{ width: '100%', marginTop: spacing.xl }}
                  />
                  <Button
                    title="Edit Transfer Details"
                    onPress={() => navigation.goBack()}
                    variant="secondary"
                    style={{ width: '100%', marginTop: spacing.sm }}
                  />
                </>
              ) : errorType === 'NETWORK' ? (
                <>
                  <Button
                    title="Check Transaction History"
                    onPress={() => navigation.navigate('TransactionHistory', { accountNumber: cleanSource })}
                    style={{ width: '100%', marginTop: spacing.xl }}
                  />
                  <Button
                    title="Return to Dashboard"
                    onPress={() => navigation.navigate('MainTabs', { screen: 'Dashboard' })}
                    variant="secondary"
                    style={{ width: '100%', marginTop: spacing.sm }}
                  />
                </>
              ) : (
                <>
                  <Button
                    title="Edit Transfer Details"
                    onPress={() => navigation.goBack()}
                    style={{ width: '100%', marginTop: spacing.xl }}
                  />
                  <Button
                    title="Return to Dashboard"
                    onPress={() => navigation.navigate('MainTabs', { screen: 'Dashboard' })}
                    variant="secondary"
                    style={{ width: '100%', marginTop: spacing.sm }}
                  />
                </>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.xl,
    fontWeight: typography.fontWeight.heavy,
    marginBottom: spacing.xxl,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  successContainer: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  successHeader: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  successIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  successIcon: {
    color: colors.textInverse,
    fontSize: 32,
    fontWeight: 'bold',
  },
  successTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.xl,
    fontWeight: typography.fontWeight.heavy,
  },
  successAmount: {
    color: colors.primary,
    fontSize: typography.fontSize.hero,
    lineHeight: typography.lineHeight.hero,
    fontWeight: typography.fontWeight.heavy,
    letterSpacing: -1,
    marginTop: spacing.xs,
  },
  successDate: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.xs,
  },
  receiptCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.xl,
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
  },
  value: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  valueMono: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'monospace',
  },
  dashedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: colors.divider,
    borderStyle: 'dashed',
    marginVertical: spacing.md,
  },
  errorContainer: {
    flex: 1,
    width: '100%',
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  errorIcon: {
    color: colors.textInverse,
    fontSize: 32,
    fontWeight: 'bold',
  },
  errorTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.xl,
    fontWeight: typography.fontWeight.heavy,
  },
  errorMessage: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  footer: {
    width: '100%',
    paddingTop: spacing.lg,
  },
});