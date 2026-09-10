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
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAccounts } from '../../hooks/useAccounts';
import { transactionService } from '../../services/transaction/transactionService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, generateUUID, maskAccountNumber } from '../../utils/formatters';

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000];

const DEPOSIT_METHODS = [
  { id: 'DIRECT', title: 'Instant Electronic Credit', icon: 'flash-outline' as const },
  { id: 'CARD', title: 'Debit Card Instant Load', icon: 'card-outline' as const },
  { id: 'CHECK', title: 'Mobile Check Capture', icon: 'camera-outline' as const },
];

export const DepositScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { accounts, refetch } = useAccounts();

  const initialTarget = route.params?.targetAccountNumber;
  const [selectedAcc, setSelectedAcc] = React.useState<string>(initialTarget || '');
  const [amount, setAmount] = React.useState('');
  const [method, setMethod] = React.useState('DIRECT');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [successData, setSuccessData] = React.useState<{ amount: number; account: string; ref: string } | null>(null);

  React.useEffect(() => {
    if (initialTarget) {
      setSelectedAcc(initialTarget);
    } else if (accounts && accounts.length > 0 && !selectedAcc) {
      const active = accounts.find((a) => a.status === 'ACTIVE') || accounts[0];
      setSelectedAcc(active.accountNumber);
    }
  }, [accounts, initialTarget, selectedAcc]);

  const targetAccount = accounts?.find((a) => a.accountNumber === selectedAcc);

  const handleDeposit = async () => {
    setError('');
    const parsedAmount = parseFloat(amount);
    const cleanAccount = selectedAcc.replace(/\s/g, '');

    if (!cleanAccount) {
      setError('Please select an account to deposit funds into.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Deposit amount must be greater than $0.00.');
      return;
    }

    setLoading(true);
    try {
      const idempotencyKey = generateUUID();
      await transactionService.deposit({
        accountNumber: cleanAccount,
        amount: parsedAmount,
        idempotencyKey,
      });

      if (refetch) await refetch();

      setSuccessData({
        amount: parsedAmount,
        account: cleanAccount,
        ref: idempotencyKey.substring(0, 8).toUpperCase(),
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to process deposit.';
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
          <Text style={styles.successTitle}>Deposit Confirmed</Text>
          <Text style={styles.successSubtitle}>
            Funds are available immediately in your account.
          </Text>

          <View style={styles.receiptBox}>
            <Text style={styles.receiptAmount}>
              +{formatCurrency(successData.amount, 'USD')}
            </Text>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Credited Account</Text>
              <Text style={styles.receiptValue}>{maskAccountNumber(successData.account)}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transaction Ref</Text>
              <Text style={styles.receiptValue}>{successData.ref}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Status</Text>
              <Text style={[styles.receiptValue, { color: colors.success }]}>COMPLETED</Text>
            </View>
          </View>

          <Button
            title="Done"
            onPress={() => {
              setSuccessData(null);
              setAmount('');
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
            <Text style={styles.title}>Deposit Cash</Text>
            <Text style={styles.subtitle}>Instantly fund your verified accounts</Text>
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

          {/* Quick Amount Chips */}
          <View style={styles.chipsRow}>
            {PRESET_AMOUNTS.map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.chip, amount === String(val) && styles.chipActive]}
                onPress={() => setAmount(String(val))}
              >
                <Text style={[styles.chipText, amount === String(val) && styles.chipTextActive]}>
                  ${val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Target Account Selector */}
          <Text style={styles.sectionLabel}>Deposit Into Account</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.accountSelectorScroll}
          >
            {accounts?.map((acc) => {
              const isSelected = acc.accountNumber === selectedAcc;
              return (
                <TouchableOpacity
                  key={acc.accountNumber}
                  style={[styles.accountCardPill, isSelected && styles.accountCardSelected]}
                  onPress={() => setSelectedAcc(acc.accountNumber)}
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

          {/* Deposit Method Selector */}
          <Text style={styles.sectionLabel}>Funding Method</Text>
          <View style={styles.methodsContainer}>
            {DEPOSIT_METHODS.map((m) => {
              const isSelected = m.id === method;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.methodCard, isSelected && styles.methodCardSelected]}
                  onPress={() => setMethod(m.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={m.icon}
                    size={20}
                    color={isSelected ? colors.accent : colors.textSecondary}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[styles.methodTitle, isSelected && styles.methodTitleActive]}>
                    {m.title}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color={colors.accent} style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Button */}
          <Button
            title={`Deposit $${parseFloat(amount || '0').toFixed(2)} Now`}
            onPress={handleDeposit}
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
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: spacing.xl,
  },
  chip: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.dominant,
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
    paddingBottom: spacing.lg,
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
  methodsContainer: {
    gap: 8,
    marginBottom: spacing.xl,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  methodCardSelected: {
    borderColor: colors.accent,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  methodTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  methodTitleActive: {
    color: colors.accent,
    fontWeight: '700',
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
    color: colors.success,
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