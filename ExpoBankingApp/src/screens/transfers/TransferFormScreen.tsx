import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { idempotencyKeyService } from '../../services/transaction/idempotencyKeyService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const TransferFormScreen = () => {
  const navigation = useNavigation<any>();

  const [sourceAcc, setSourceAcc] = React.useState('');
  const [destAcc, setDestAcc] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleProceed = () => {
    const parsedAmount = parseFloat(amount);

    // Basic Client-Side Validation
    if (!sourceAcc || !destAcc || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Validation Error', 'Please enter valid account numbers and an amount greater than $0.');
      return;
    }

    // Generate idempotency key for this specific transfer session
    const idempotencyKey = idempotencyKeyService.getOrCreateKey();

    // Navigate to Review Screen, passing the form state
    navigation.navigate('TransferReview', {
      sourceAccountNumber: sourceAcc,
      destinationAccountNumber: destAcc,
      amount: parsedAmount,
      description,
      idempotencyKey,
    });
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <Text style={styles.title}>Internal Transfer</Text>
      <Text style={styles.subtitle}>Move funds instantly between your accounts.</Text>

      <View style={styles.formContainer}>
        <Input
          label="From Account Number"
          placeholder="e.g. ACCT-100200"
          value={sourceAcc}
          onChangeText={setSourceAcc}
        />
        <Input
          label="To Account Number"
          placeholder="e.g. ACCT-300400"
          value={destAcc}
          onChangeText={setDestAcc}
        />
        <Input
          label="Amount ($)"
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Input
          label="Memo / Description (Optional)"
          placeholder="e.g. Rent share"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <Button title="Review Transfer" onPress={handleProceed} style={styles.button} />
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