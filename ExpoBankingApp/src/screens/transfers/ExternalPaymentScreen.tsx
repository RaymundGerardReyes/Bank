import * as React from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { transactionService } from '../../services/transaction/transactionService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { generateUUID } from '../../utils/formatters';

export const ExternalPaymentScreen = () => {
  const [sourceAcc, setSourceAcc] = React.useState('');
  const [routingNo, setRoutingNo] = React.useState('');
  const [recipientAcc, setRecipientAcc] = React.useState('');
  const [recipientName, setRecipientName] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handlePayment = async () => {
    const parsedAmount = parseFloat(amount);

    if (!sourceAcc || !routingNo || !recipientAcc || !recipientName || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Validation Error', 'Please complete all fields and ensure the amount is greater than $0.');
      return;
    }

    setLoading(true);
    try {
      // The backend requires an Idempotency-Key for all external payments
      await transactionService.externalPayment({
        sourceAccountNumber: sourceAcc,
        routingNumber: routingNo,
        recipientAccountNumber: recipientAcc,
        recipientName,
        amount: parsedAmount,
        idempotencyKey: generateUUID(),
      });

      Alert.alert('Success', `External wire of $${parsedAmount.toFixed(2)} to ${recipientName} has been initiated.`);

      // Reset form on success
      setSourceAcc('');
      setRoutingNo('');
      setRecipientAcc('');
      setRecipientName('');
      setAmount('');
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Failed to process external payment.';
      Alert.alert('Payment Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>External Wire</Text>
          <Text style={styles.subtitle}>Send funds to an external bank account.</Text>

          <View style={styles.formContainer}>
            <Input
              label="Source Account"
              placeholder="e.g. ACCT-100200"
              value={sourceAcc}
              onChangeText={setSourceAcc}
            />
            <Input
              label="Routing Number"
              placeholder="9-digit routing number"
              value={routingNo}
              onChangeText={setRoutingNo}
              keyboardType="number-pad"
            />
            <Input
              label="Recipient Account Number"
              placeholder="Account number"
              value={recipientAcc}
              onChangeText={setRecipientAcc}
              keyboardType="number-pad"
            />
            <Input
              label="Recipient Name"
              placeholder="Full Name or Business"
              value={recipientName}
              onChangeText={setRecipientName}
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
            title="Send External Wire"
            onPress={handlePayment}
            loading={loading}
            style={styles.button}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dominant, // 60% White
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
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