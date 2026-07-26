import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { transactionService } from '../../services/transaction/transactionService';
import { generateUUID } from '../../utils/formatters';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const DepositScreen = () => {
  const [accountNo, setAccountNo] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleDeposit = async () => {
    setLoading(true);
    try {
      await transactionService.deposit({
        accountNumber: accountNo,
        amount: parseFloat(amount),
        idempotencyKey: generateUUID(),
      });
    } catch {
      // Handle deposit error
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit Cash</Text>
      <Input label="Account Number" value={accountNo} onChangeText={setAccountNo} />
      <Input label="Amount ($)" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <Button title="Confirm Deposit" onPress={handleDeposit} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
});
