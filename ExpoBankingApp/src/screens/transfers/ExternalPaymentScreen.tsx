import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { Input } from '../../components/common/Input';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAccounts } from '../../hooks/useAccounts';
import { transactionService } from '../../services/transaction/transactionService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, generateUUID, maskAccountNumber } from '../../utils/formatters';

const POPULAR_BANKS = [
  { name: 'Chase Bank', routing: '021000021' },
  { name: 'Bank of America', routing: '026009593' },
  { name: 'Wells Fargo', routing: '121000248' },
  { name: 'Citibank N.A.', routing: '021000089' },
];

export const ExternalPaymentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { accounts, refetch } = useAccounts();

  const initialSource = route.params?.sourceAccountNumber;
  const [selectedSource, setSelectedSource] = React.useState<string>(initialSource || '');
  const [selectedBankName, setSelectedBankName] = React.useState<string>(POPULAR_BANKS[0].name);
  const [routingNo, setRoutingNo] = React.useState(POPULAR_BANKS[0].routing);
  const [recipientAcc, setRecipientAcc] = React.useState('');
  const [recipientName, setRecipientName] = React.useState('');
  const [amount, setAmount] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [successData, setSuccessData] = React.useState<any | null>(null);

  React.useEffect(() => {
    if (initialSource) {
      setSelectedSource(initialSource);
    } else if (accounts && accounts.length > 0 && !selectedSource) {
      const active = accounts.find((a) => a.status === 'ACTIVE') || accounts[0];
      setSelectedSource(active.accountNumber);
    }
  }, [accounts, initialSource, selectedSource]);

  const activeAccount = accounts?.find((a) => a.accountNumber === selectedSource);

  const selectBankPreset = (bank: typeof POPULAR_BANKS[0]) => {
    setSelectedBankName(bank.name);
    setRoutingNo(bank.routing);
  };

  const handlePayment = async () => {
    setError('');
    const parsedAmount = parseFloat(amount);
    const cleanSource = selectedSource.replace(/\s/g, '');
    const cleanDest = recipientAcc.replace(/\s/g, '');
    const cleanRouting = routingNo.replace(/\s/g, '');

    if (!cleanSource) {
      setError('Please select a source account.');
      return;
    }
    if (!cleanRouting || cleanRouting.length !== 9) {
      setError('Routing number must be exactly 9 digits.');
      return;
    }
    if (!cleanDest) {
      setError('Please enter the recipient account number.');
      return;
    }
    if (!recipientName.trim()) {
      setError('Please enter the recipient full name or business entity.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than $0.00.');
      return;
    }
    if (activeAccount && activeAccount.status !== 'ACTIVE') {
      setError(`Cannot transfer from a ${activeAccount.status.toLowerCase()} account.`);
      return;
    }
    if (activeAccount && parsedAmount > activeAccount.balance) {
      setError(
        `Insufficient funds. Available balance is ${formatCurrency(
          activeAccount.balance,
          activeAccount.currency || 'USD'
        )}.`
      );
      return;
    }

    setLoading(true);
    try {
      const idempotencyKey = generateUUID();
      await transactionService.externalPayment({
        sourceAccountNumber: cleanSource,
        routingNumber: cleanRouting,
        recipientAccountNumber: cleanDest,
        recipientName: recipientName.trim(),
        amount: parsedAmount,
        idempotencyKey,
      });

      if (refetch) await refetch();

      setSuccessData({
        amount: parsedAmount,
        source: cleanSource,
        recipient: recipientName.trim(),
        recipientAccount: cleanDest,
        bank: selectedBankName,
        reference: idempotencyKey.substring(0, 8).toUpperCase(),
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to process external wire.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <SecureScreenWrapper style={styles.successContainer}>
        <View style={styles.successCard}>
          <View style={styles.successIconBg}>
            <Ionicons name="checkmark-circle" size={56} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Wire Dispatched</Text>
          <Text style={styles.successSubtitle}>
            Funds are queued for Fedwire/ACH settlement to {successData.recipient}.
          </Text>

          <View style={styles.receiptBox}>
            <Text style={styles.receiptAmount}>
              -{formatCurrency(successData.amount, 'USD')}
            </Text>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Recipient</Text>
              <Text style={styles.receiptValue}>{successData.recipient}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Destination Bank</Text>
              <Text style={styles.receiptValue}>{successData.bank}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Destination Account</Text>
              <Text style={styles.receiptValue}>{maskAccountNumber(successData.recipientAccount)}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Fedwire Ref</Text>
              <Text style={styles.receiptValue}>{successData.reference}</Text>
            </View>
          </View>

          <Button
            title="Done"
            onPress={() => {
              setSuccessData(null);
              setAmount('');
              setRecipientAcc('');
              setRecipientName('');
              navigation.navigate('MainTabs');
            }}
            style={styles.doneBtn}
          />
        </View>
      </SecureScreenWrapper>
    );
  }

  return (
    <SecureScreenWrapper style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Wire Transfer</Text>
            <Text style={styles.subtitle}>ACH & Fedwire Same-Day Settlement</Text>
          </View>

          {error ? <ErrorBanner message={error} onDismiss={() => setError('')} /> : null}

          {/* Amount Input */}
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

          {/* Source Account Carousel */}
          <Text style={styles.sectionLabel}>Source Account</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.accountSelectorScroll}
          >
            {accounts?.map((acc) => {
              const isSelected = acc.accountNumber === selectedSource;
              return (
                <TouchableOpacity
                  key={acc.accountNumber}
                  style={[styles.accountCardPill, isSelected && styles.accountCardSelected]}
                  onPress={() => setSelectedSource(acc.accountNumber)}
                  activeOpacity={0.8}
                >
                  <View style={styles.accountPillHeader}>
                    <Text style={[styles.accountPillType, isSelected && styles.accountPillTypeActive]}>
                      {acc.accountType}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={16} color={colors.dominant} />
                    )}
                  </View>
                  <Text style={[styles.accountPillNumber, isSelected && styles.accountPillTextActive]}>
                    {maskAccountNumber(acc.accountNumber)}
                  </Text>
                  <Text style={[styles.accountPillBalance, isSelected && styles.accountPillTextActive]}>
                    {formatCurrency(acc.balance, acc.currency || 'USD')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Recipient Bank Presets */}
          <Text style={styles.sectionLabel}>Select Recipient Bank</Text>
          <View style={styles.bankChipsRow}>
            {POPULAR_BANKS.map((b) => {
              const isSelected = routingNo === b.routing;
              return (
                <TouchableOpacity
                  key={b.name}
                  style={[styles.bankChip, isSelected && styles.bankChipSelected]}
                  onPress={() => selectBankPreset(b)}
                >
                  <Text style={[styles.bankChipText, isSelected && styles.bankChipTextSelected]}>
                    {b.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Recipient Details Card */}
          <View style={styles.card}>
            <Input
              label="Routing Transit Number (ABA 9-digit)"
              placeholder="021000021"
              value={routingNo}
              onChangeText={(text) => {
                setRoutingNo(text);
                setSelectedBankName('External Financial Institution');
              }}
              keyboardType="number-pad"
              maxLength={9}
            />
            <View style={styles.divider} />
            <Input
              label="Recipient Account Number"
              placeholder="e.g. 9876543210"
              value={recipientAcc}
              onChangeText={setRecipientAcc}
              keyboardType="number-pad"
            />
            <View style={styles.divider} />
            <Input
              label="Recipient Beneficiary Name"
              placeholder="Full Legal Name or Registered LLC"
              value={recipientName}
              onChangeText={setRecipientName}
            />
          </View>

          {/* Fee & Settlement Breakdown */}
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Estimated Delivery</Text>
              <Text style={styles.breakdownValue}>Same-Day Business Hours</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Transfer Fee</Text>
              <Text style={[styles.breakdownValue, { color: colors.success }]}>$0.00 (Promo)</Text>
            </View>
            <View style={[styles.breakdownRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Systemic Debit</Text>
              <Text style={styles.totalValue}>
                ${parseFloat(amount || '0').toFixed(2)} USD
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <Button
            title="Dispatch External Wire"
            onPress={handlePayment}
            loading={loading}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dominant,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  title: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  currencySymbol: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.accent,
    marginRight: 6,
    marginTop: -4,
  },
  amountInput: {
    fontSize: 54,
    fontWeight: '900',
    color: colors.accent,
    minWidth: 140,
    textAlign: 'center',
  },
  sectionLabel: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accountSelectorScroll: {
    gap: 12,
    paddingBottom: spacing.md,
  },
  accountCardPill: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  accountCardSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  accountPillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  accountPillType: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '800',
  },
  accountPillTypeActive: {
    color: colors.dominant,
  },
  accountPillNumber: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  accountPillBalance: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '800',
  },
  accountPillTextActive: {
    color: colors.dominant,
  },
  bankChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.lg,
  },
  bankChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  bankChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  bankChipText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  bankChipTextSelected: {
    color: colors.dominant,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: spacing.md,
  },
  breakdownCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.xl,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  breakdownLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  breakdownValue: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 6,
    paddingTop: 8,
  },
  totalLabel: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  totalValue: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '900',
  },
  submitBtn: {
    borderRadius: spacing.borderRadius.md,
    paddingVertical: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.dominant,
  },
  successCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  successIconBg: {
    marginBottom: spacing.md,
  },
  successTitle: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  successSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: colors.dominant,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  receiptAmount: {
    color: colors.accent,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  receiptRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  receiptLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  receiptValue: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  doneBtn: {
    width: '100%',
  },
});