import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { transactionService } from '../../services/transaction/transactionService';
import { generateUUID } from '../../utils/formatters';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const ExternalPaymentScreen = () => {
  const [sourceAcc, setSourceAcc] = React.useState('');
  const [routingNo, setRoutingNo] = React.useState('');
  const [recipientAcc, setRecipientAcc] = React.useState('');
  const [recipientName, setRecipientName] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await transactionService.externalPayment({
        sourceAccountNumber: sourceAcc,
        routingNumber: routingNo,
        recipientAccountNumber: recipientAcc,
        recipientName,
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
      <Text style={styles.title}>External Wire Transfer</Text>
      <Input label="Source Account" value={sourceAcc} onChangeText={setSourceAcc} />
      <Input label="Routing Number" value={routingNo} onChangeText={setRoutingNo} />
      <Input label="Recipient Account Number" value={recipientAcc} onChangeText={setRecipientAcc} />
      <Input label="Recipient Name" value={recipientName} onChangeText={setRecipientName} />
      <Input label="Amount ($)" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <Button title="Send External Wire" onPress={handlePayment} loading={loading} />
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
