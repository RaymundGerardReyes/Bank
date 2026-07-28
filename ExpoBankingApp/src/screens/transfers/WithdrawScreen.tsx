import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { transactionService } from '../../services/transaction/transactionService';
import { generateUUID } from '../../utils/formatters';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const WithdrawScreen = () => {
  const [accountNo, setAccountNo] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      await transactionService.withdraw({
        accountNumber: accountNo,
        amount: parseFloat(amount),
        idempotencyKey: generateUUID(),
      });
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdraw Cash</Text>
      <Input label="Account Number" value={accountNo} onChangeText={setAccountNo} />
      <Input label="Amount ($)" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <Button title="Confirm Withdrawal" onPress={handleWithdraw} loading={loading} />
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
