import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const [error, setError] = React.useState('');

  const handleProceed = () => {
    setError('');
    const parsedAmount = parseFloat(amount);

    // Auto-sanitize whitespace for backend ISO 7812 matching
    const cleanSource = sourceAcc.replace(/\s/g, '');
    const cleanDest = destAcc.replace(/\s/g, '');

    if (!cleanSource || !cleanDest) {
      setError('Please provide both source and destination account numbers.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Transfer amount must be greater than $0.00.');
      return;
    }

    const idempotencyKey = idempotencyKeyService.getOrCreateKey();
    navigation.navigate('TransferReview', {
      sourceAccountNumber: cleanSource,
      destinationAccountNumber: cleanDest,
      amount: parsedAmount,
      description,
      idempotencyKey,
    });
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

          <View style={styles.header}>
            <Text style={styles.title}>Send Money</Text>
            <Text style={styles.subtitle}>Instant internal transfer</Text>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Hero Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={`${colors.secondary}80`}
              autoFocus
            />
          </View>

          {/* Clean Input Card */}
          <View style={styles.card}>
            <Input
              label="From Account Number"
              placeholder="e.g. 4859 2200 1337 1001"
              value={sourceAcc}
              onChangeText={setSourceAcc}
            />
            <View style={styles.divider} />
            <Input
              label="To Recipient Account"
              placeholder="e.g. 4859 2200 1337 9999"
              value={destAcc}
              onChangeText={setDestAcc}
            />
            <View style={styles.divider} />
            <Input
              label="Memo (Optional)"
              placeholder="What is this for?"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </ScrollView>

        {/* Sticky Ergonomic Footer */}
        <View style={styles.footer}>
          <Button title="Review Transfer" onPress={handleProceed} />
        </View>
      </KeyboardAvoidingView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dominant },
  flex: { flex: 1 },
  scrollContainer: { padding: spacing.lg, paddingBottom: 120 },
  header: { marginBottom: spacing.xl, marginTop: spacing.md },
  title: { color: colors.accent, fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: colors.textSecondary, fontSize: 16, fontWeight: '600', marginTop: 4 },
  errorBanner: { backgroundColor: '#FEF2F2', padding: spacing.md, borderRadius: spacing.borderRadius.md, borderWidth: 1, borderColor: '#FECACA', marginBottom: spacing.lg },
  errorText: { color: colors.danger, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  amountContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xxl },
  currencySymbol: { fontSize: 48, fontWeight: '800', color: colors.accent, marginRight: 8, marginTop: -8 },
  amountInput: { fontSize: 64, fontWeight: '900', color: colors.accent, minWidth: 160 },
  card: { backgroundColor: colors.surface, borderRadius: spacing.borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: `${colors.secondary}40` },
  divider: { height: 1, backgroundColor: `${colors.secondary}30`, marginVertical: spacing.sm },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, backgroundColor: colors.dominant, borderTopWidth: 1, borderColor: `${colors.secondary}30` },
});