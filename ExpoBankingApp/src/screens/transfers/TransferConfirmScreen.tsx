import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button } from '../../components/common/Button';
import { BiometricPrompt } from '../../components/security/BiometricPrompt';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useBiometric } from '../../hooks/useBiometric';
import { idempotencyKeyService } from '../../services/transaction/idempotencyKeyService';
import { transactionService } from '../../services/transaction/transactionService';
import { accountApi } from '../../state/api/accountApi';
import { transactionApi } from '../../state/api/transactionApi';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const TransferConfirmScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const [status, setStatus] = React.useState<'PENDING' | 'LOADING' | 'SUCCESS' | 'ERROR'>('PENDING');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [receipt, setReceipt] = React.useState<any>(null);
  const { authenticate } = useBiometric();
  const { sourceAccountNumber, destinationAccountNumber, amount, description, idempotencyKey } = route.params || {};

  const handleConfirm = async () => {
    const passed = await authenticate(`Authorize transfer of ${formatCurrency(amount, 'USD')}`);
    if (passed) {
      setStatus('LOADING');
      try {
        const txData = await transactionService.transferInternal({
          sourceAccountNumber,
          destinationAccountNumber,
          amount,
          description,
          idempotencyKey,
        });

        dispatch(accountApi.util.invalidateTags(['Accounts']));
        dispatch(transactionApi.util.invalidateTags(['Transactions']));

        setReceipt(txData);
        setStatus('SUCCESS');
        idempotencyKeyService.resetKey();
      } catch (error: any) {
        setStatus('ERROR');
        // 🔥 FIX: Deeply extract the Spring Boot JSON error payload to bypass Axios generic messages
        const msg = error?.response?.data?.message || error?.message || 'Transaction declined by server.';
        setErrorMessage(msg);
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
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Encrypting & processing ledger entry...</Text>
        </View>
      )}

      {status === 'SUCCESS' && receipt && (
        <View style={styles.successContainer}>
          <View style={styles.successHeader}>
            <View style={styles.successIconBg}><Text style={styles.successIcon}>✓</Text></View>
            <Text style={styles.successTitle}>Transfer Successful</Text>
            <Text style={styles.successAmount}>{formatCurrency(receipt.amount, 'USD')}</Text>
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
          </View>

          <View style={styles.footer}>
            <Button title="Return to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
          </View>
        </View>
      )}

      {status === 'ERROR' && (
        <View style={styles.errorContainer}>
          <View style={styles.errorIconBg}><Text style={styles.errorIcon}>!</Text></View>
          <Text style={styles.errorTitle}>Transfer Failed</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>

          <View style={styles.footer}>
            <Button title="Try Again" onPress={() => navigation.goBack()} variant="danger" />
          </View>
        </View>
      )}
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dominant },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  title: { color: colors.accent, fontSize: 24, fontWeight: '900', marginBottom: spacing.xl },
  loadingText: { color: colors.accent, fontSize: 16, fontWeight: '700', marginTop: spacing.lg },

  // Success UI
  successContainer: { flex: 1, paddingTop: 80 },
  successHeader: { alignItems: 'center', marginBottom: spacing.xl },
  successIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ECFCCB', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  successIcon: { fontSize: 40, color: colors.success },
  successTitle: { color: colors.accent, fontSize: 24, fontWeight: '900' },
  successAmount: { color: colors.success, fontSize: 48, fontWeight: '900', letterSpacing: -1, marginVertical: spacing.xs },
  successDate: { color: colors.textSecondary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },

  receiptCard: { marginHorizontal: spacing.lg, backgroundColor: colors.surface, padding: spacing.xl, borderRadius: spacing.borderRadius.lg, borderWidth: 1, borderColor: `${colors.secondary}40` },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  label: { color: colors.textSecondary, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { color: colors.accent, fontSize: 14, fontWeight: '800' },
  valueMono: { color: colors.accent, fontSize: 13, fontWeight: '800', fontFamily: 'monospace' },
  dashedDivider: { height: 1, borderWidth: 1, borderColor: colors.secondary, borderStyle: 'dashed', marginVertical: spacing.md, opacity: 0.4 },

  // Error UI
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  errorIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md, borderWidth: 1, borderColor: '#FECACA' },
  errorIcon: { fontSize: 40, color: colors.danger, fontWeight: '900' },
  errorTitle: { color: colors.danger, fontSize: 24, fontWeight: '900', marginBottom: spacing.sm },
  errorMessage: { color: colors.textSecondary, fontSize: 15, textAlign: 'center', fontWeight: '600' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, backgroundColor: colors.dominant, borderTopWidth: 1, borderColor: `${colors.secondary}30` },
});