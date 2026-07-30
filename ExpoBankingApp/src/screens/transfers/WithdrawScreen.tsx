import * as React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { transactionService } from '../../services/transaction/transactionService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { generateUUID } from '../../utils/formatters';

export const WithdrawScreen = () => {
  const [accountNo, setAccountNo] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleWithdraw = async () => {
    setError('');
    const parsedAmount = parseFloat(amount);
    const cleanAccount = accountNo.replace(/\s/g, '');

    if (!cleanAccount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid account number and an amount greater than $0.');
      return;
    }

    setLoading(true);
    try {
      await transactionService.withdraw({
        accountNumber: cleanAccount,
        amount: parsedAmount,
        idempotencyKey: generateUUID(),
      });
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to process withdrawal.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SecureScreenWrapper style={styles.successContainer}>
        <View style={styles.successIconBg}><Text style={styles.successIcon}>✓</Text></View>
        <Text style={styles.title}>Withdrawal Complete</Text>
        <Text style={styles.subtitle}>Funds have been deducted successfully.</Text>
        <View style={styles.footer}>
          <Button title="Done" onPress={() => { setSuccess(false); setAmount(''); }} />
        </View>
      </SecureScreenWrapper>
    );
  }

  return (
    <SecureScreenWrapper style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Withdraw Cash</Text>
            <Text style={styles.subtitle}>Extract funds from your wallet.</Text>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={`${colors.secondary}80`}
            />
          </View>

          <View style={styles.card}>
            <Input
              label="Source Account Number"
              placeholder="e.g. 4859 2200 1337 1001"
              value={accountNo}
              onChangeText={setAccountNo}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Confirm Withdrawal" onPress={handleWithdraw} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dominant },
  flex: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: 120 },
  header: { marginBottom: spacing.xl, marginTop: spacing.md },
  title: { color: colors.accent, fontSize: 28, fontWeight: '900', letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: 16, fontWeight: '600', marginTop: 4, textAlign: 'center' },
  errorBanner: { backgroundColor: '#FEF2F2', padding: spacing.md, borderRadius: spacing.borderRadius.md, borderWidth: 1, borderColor: '#FECACA', marginBottom: spacing.lg },
  errorText: { color: colors.danger, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  amountContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xxl },
  currencySymbol: { fontSize: 48, fontWeight: '800', color: colors.accent, marginRight: 8, marginTop: -8 },
  amountInput: { fontSize: 64, fontWeight: '900', color: colors.accent, minWidth: 160 },
  card: { backgroundColor: colors.surface, borderRadius: spacing.borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: `${colors.secondary}40` },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, backgroundColor: colors.dominant, borderTopWidth: 1, borderColor: `${colors.secondary}30` },

  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl, backgroundColor: colors.dominant },
  successIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ECFCCB', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  successIcon: { fontSize: 40, color: colors.success },
});