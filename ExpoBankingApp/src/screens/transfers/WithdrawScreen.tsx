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

const PRESET_AMOUNTS = [20, 40, 100, 200, 500];

export const WithdrawScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { accounts, refetch } = useAccounts();

  const initialSource = route.params?.sourceAccountNumber;
  const [selectedAcc, setSelectedAcc] = React.useState<string>(initialSource || '');
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [voucherData, setVoucherData] = React.useState<{
    amount: number;
    account: string;
    code: string;
    expiresIn: string;
  } | null>(null);

  React.useEffect(() => {
    if (initialSource) {
      setSelectedAcc(initialSource);
    } else if (accounts && accounts.length > 0 && !selectedAcc) {
      const active = accounts.find((a) => a.status === 'ACTIVE') || accounts[0];
      setSelectedAcc(active.accountNumber);
    }
  }, [accounts, initialSource, selectedAcc]);

  const activeAccount = accounts?.find((a) => a.accountNumber === selectedAcc);

  const handleSetMax = () => {
    if (activeAccount) {
      setAmount(String(activeAccount.balance || 0));
    }
  };

  const handleWithdraw = async () => {
    setError('');
    const parsedAmount = parseFloat(amount);
    const cleanAccount = selectedAcc.replace(/\s/g, '');

    if (!cleanAccount) {
      setError('Please select an account to withdraw from.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Withdrawal amount must be greater than $0.00.');
      return;
    }
    if (activeAccount && activeAccount.status !== 'ACTIVE') {
      setError(`Cannot withdraw from a ${activeAccount.status.toLowerCase()} account.`);
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
      await transactionService.withdraw({
        accountNumber: cleanAccount,
        amount: parsedAmount,
        idempotencyKey,
      });

      if (refetch) await refetch();

      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setVoucherData({
        amount: parsedAmount,
        account: cleanAccount,
        code: randomOtp,
        expiresIn: '15 minutes',
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to process withdrawal.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (voucherData) {
    return (
      <SecureScreenWrapper style={styles.successContainer}>
        <View style={styles.successCard}>
          <View style={styles.successIconBg}>
            <Ionicons name="checkmark-circle" size={56} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Withdrawal Authorized</Text>
          <Text style={styles.successSubtitle}>
            Present this OTP voucher at any NovaBank ATM or partner teller branch.
          </Text>

          <View style={styles.voucherBox}>
            <Text style={styles.voucherAmount}>
              -{formatCurrency(voucherData.amount, 'USD')}
            </Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>ATM CASHOUT CODE</Text>
              <Text style={styles.codeText}>{voucherData.code}</Text>
              <Text style={styles.expiryText}>Valid for {voucherData.expiresIn}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Debited Account</Text>
              <Text style={styles.receiptValue}>{maskAccountNumber(voucherData.account)}</Text>
            </View>
          </View>

          <Button
            title="Done"
            onPress={() => {
              setVoucherData(null);
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
            <Text style={styles.title}>Withdraw Cash</Text>
            <Text style={styles.subtitle}>Instant ATM cash code or teller voucher</Text>
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
            <TouchableOpacity style={styles.chipMax} onPress={handleSetMax}>
              <Text style={styles.chipMaxText}>MAX</Text>
            </TouchableOpacity>
          </View>

          {/* Source Account Selector */}
          <Text style={styles.sectionLabel}>Withdraw From Account</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.accountSelectorScroll}
          >
            {accounts?.map((acc) => {
              const isSelected = acc.accountNumber === selectedAcc;
              const isAccActive = acc.status === 'ACTIVE';

              return (
                <TouchableOpacity
                  key={acc.accountNumber}
                  style={[
                    styles.accountCardPill,
                    isSelected && styles.accountCardSelected,
                    !isAccActive && styles.accountCardDisabled,
                  ]}
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

          {/* Instructions Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={colors.accent} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>
              Daily ATM limit: $1,500.00. Funds are reserved immediately and released if the voucher expires uncollected.
            </Text>
          </View>

          {/* Action Button */}
          <Button
            title={`Authorize $${parseFloat(amount || '0').toFixed(2)} Cashout`}
            onPress={handleWithdraw}
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
  chipMax: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  chipMaxText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '800',
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
  accountCardDisabled: {
    opacity: 0.4,
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: spacing.xl,
  },
  infoText: {
    flex: 1,
    color: colors.accent,
    fontSize: 12,
    lineHeight: 17,
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
  voucherBox: {
    width: '100%',
    backgroundColor: colors.dominant,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  voucherAmount: {
    color: colors.accent,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  codeContainer: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  codeLabel: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  codeText: {
    color: '#78350F',
    fontSize: 32,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 6,
    marginVertical: 4,
  },
  expiryText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '600',
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