import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux'; // <-- NEW
import { Button } from '../../components/common/Button';
import { BiometricPrompt } from '../../components/security/BiometricPrompt';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useBiometric } from '../../hooks/useBiometric';
import { idempotencyKeyService } from '../../services/transaction/idempotencyKeyService';
import { transactionService } from '../../services/transaction/transactionService';
import { accountApi } from '../../state/api/accountApi'; // <-- NEW
import { transactionApi } from '../../state/api/transactionApi'; // <-- NEW
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';

export const TransferConfirmScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch(); // <-- NEW

  const [status, setStatus] = React.useState<'PENDING' | 'SUCCESS' | 'ERROR'>('PENDING');
  const [errorMessage, setErrorMessage] = React.useState('');
  const { authenticate } = useBiometric();

  const { sourceAccountNumber, destinationAccountNumber, amount, description, idempotencyKey } = route.params || {};

  const handleConfirm = async () => {
    // 1. Force Biometric Step-Up
    const passed = await authenticate(`Authorize transfer of ${formatCurrency(amount, 'USD')}`);
    if (passed) {
      try {
        // 2. Execute Transfer via API with strict Idempotency Key
        await transactionService.transferInternal({
          sourceAccountNumber,
          destinationAccountNumber,
          amount,
          description,
          idempotencyKey,
        });

        // 3. --> NEW: Invalidate Redux Cache so Dashboard fetches fresh data instantly! <--
        dispatch(accountApi.util.invalidateTags(['Accounts']));
        dispatch(transactionApi.util.invalidateTags(['Transactions']));

        setStatus('SUCCESS');
        // Clear the key so the next transfer generates a fresh one
        idempotencyKeyService.resetKey();
      } catch (error: any) {
        setStatus('ERROR');
        setErrorMessage(error?.response?.data?.message || 'Transaction declined by server.');
      }
    }
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      {status === 'PENDING' && (
        <View style={styles.centerContent}>
          <Text style={styles.title}>Final Authorization</Text>
          <BiometricPrompt
            title="Authorize Transaction"
            onAuthenticate={handleConfirm}
          />
        </View>
      )}
      {status === 'SUCCESS' && (
        <View style={styles.centerContent}>
          <Text style={styles.icon}> </Text>
          <Text style={styles.successTitle}>Transfer Successful</Text>
          <Text style={styles.message}>Your funds have been securely transferred.</Text>
          <Button title="Return to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
        </View>
      )}
      {status === 'ERROR' && (
        <View style={styles.centerContent}>
          <Text style={styles.icon}> </Text>
          <Text style={styles.errorTitle}>Transfer Failed</Text>
          <Text style={styles.message}>{errorMessage}</Text>
          <Button title="Try Again" onPress={() => navigation.goBack()} variant="danger" />
        </View>
      )}
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.dominant,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  successTitle: {
    color: colors.success,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  errorTitle: {
    color: colors.danger,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
});