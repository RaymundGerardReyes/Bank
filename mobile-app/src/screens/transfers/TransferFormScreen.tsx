import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { idempotencyKeyService } from '../../services/transaction/idempotencyKeyService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const TransferFormScreen = () => {
  const [sourceAcc, setSourceAcc] = React.useState('');
  const [destAcc, setDestAcc] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleProceed = () => {
    // Generate idempotency key for this transfer session
    idempotencyKeyService.getOrCreateKey();
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <Text style={styles.title}>Internal Transfer</Text>
      <Input label="Source Account Number" value={sourceAcc} onChangeText={setSourceAcc} />
      <Input label="Destination Account Number" value={destAcc} onChangeText={setDestAcc} />
      <Input label="Amount ($)" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <Input label="Description (Optional)" value={description} onChangeText={setDescription} />
      <Button title="Review Transfer" onPress={handleProceed} />
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
});
