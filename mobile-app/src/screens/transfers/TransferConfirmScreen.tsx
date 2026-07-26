import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BiometricPrompt } from '../../components/security/BiometricPrompt';
import { transactionService } from '../../services/transaction/transactionService';
import { idempotencyKeyService } from '../../services/transaction/idempotencyKeyService';
import { useBiometric } from '../../hooks/useBiometric';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const TransferConfirmScreen = () => {
  const [status, setStatus] = React.useState<string | null>(null);
  const { authenticate } = useBiometric();

  const handleConfirm = async () => {
    const passed = await authenticate('Confirm transfer of $250.00');
    if (passed) {
      const idempotencyKey = idempotencyKeyService.getOrCreateKey();
      try {
        await transactionService.transferInternal({
          sourceAccountNumber: 'ACCT-100200',
          destinationAccountNumber: 'ACCT-300400',
          amount: 250.0,
          idempotencyKey,
        });
        setStatus('TRANSFER COMPLETED SUCCESSFULLY!');
        idempotencyKeyService.resetKey();
      } catch {
        setStatus('TRANSFER FAILED.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biometric Step-Up Confirmation</Text>
      {status ? (
        <Text style={styles.statusText}>{status}</Text>
      ) : (
        <BiometricPrompt onAuthenticate={handleConfirm} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  statusText: {
    color: colors.success,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
