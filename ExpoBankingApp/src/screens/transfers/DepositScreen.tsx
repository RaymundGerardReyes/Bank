import * as React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { transactionService } from '../../services/transaction/transactionService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { generateUUID } from '../../utils/formatters';

export const DepositScreen = () => {
  const [accountNo, setAccountNo] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleDeposit = async () => {
    const parsedAmount = parseFloat(amount);

    if (!accountNo || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid account number and an amount greater than $0.');
      return;
    }

    setLoading(true);
    try {
      // The backend requires an Idempotency-Key for all money movement
      await transactionService.deposit({
        accountNumber: accountNo,
        amount: parsedAmount,
        idempotencyKey: generateUUID(),
      });

      Alert.alert('Success', `Successfully deposited $${parsedAmount.toFixed(2)} into ${accountNo}.`);

      // Reset form on success
      setAccountNo('');
      setAmount('');
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Failed to process deposit. Please try again.';
      Alert.alert('Deposit Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <Text style={styles.title}>Deposit Cash</Text>
      <Text style={styles.subtitle}>Securely deposit funds into your account.</Text>

      <View style={styles.formContainer}>
        <Input
          label="Account Number"
          placeholder="e.g. ACCT-100200"
          value={accountNo}
          onChangeText={setAccountNo}
        />
        <Input
          label="Amount ($)"
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      <Button
        title="Confirm Deposit"
        onPress={handleDeposit}
        loading={loading}
        style={styles.button}
      />
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.dominant, // 60% White
  },
  title: {
    color: colors.accent, // 10% Deep Navy
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.xl,
  },
  formContainer: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.secondary, // 30% Soft Blue
    marginBottom: spacing.xl,
  },
  button: {
    marginTop: 'auto',
  },
});