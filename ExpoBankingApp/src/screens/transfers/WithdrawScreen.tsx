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
import { typography } from '../../theme/typography';
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
            <Text style={styles.subtitle}>ATM Cash Code & Over-the-Counter Vouchers</Text>
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
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Preset Chips */}
          <View style={styles.chipsRow}>
            {PRESET_AMOUNTS.map((val) => {
              const isSelected = amount === String(val);
              return (
                <TouchableOpacity
                  key={val}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => setAmount(String(val))}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>${val}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={styles.chipMax} onPress={handleSetMax}>
              <Text style={styles.chipMaxText}>MAX</Text>
            </TouchableOpacity>
          </View>

          {/* Account Selector */}
          <Text style={styles.sectionLabel}>Withdraw From Account</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.accountSelectorScroll}
          >
            {accounts?.map((acc) => {
              const isSelected = acc.accountNumber === selectedAcc;
              const isDisabled = acc.status !== 'ACTIVE';
              return (
                <TouchableOpacity
                  key={acc.accountNumber}
                  style={[
                    styles.accountCardPill,
                    isSelected && styles.accountCardSelected,
                    isDisabled && styles.accountCardDisabled,
                  ]}
                  onPress={() => !isDisabled && setSelectedAcc(acc.accountNumber)}
                  activeOpacity={isDisabled ? 1 : 0.8}
                  disabled={isDisabled}
                >
                  <View style={styles.accountPillHeader}>
                    <Text style={[styles.accountPillType, isSelected && styles.accountPillTypeActive]}>
                      {acc.accountType}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={16} color={colors.textInverse} />
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

          {/* Security Notice */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={colors.info} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>
              A single-use 6-digit ATM voucher will be issued immediately upon confirmation. It expires in 15 minutes.
            </Text>
          </View>

          {/* Submit Button */}
          <Button
            title={`Generate Voucher for $${parseFloat(amount || '0').toFixed(2)}`}
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
    backgroundColor: colors.background,
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
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
    fontWeight: typography.fontWeight.heavy,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.medium,
    marginTop: 4,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  currencySymbol: {
    fontSize: 36,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    marginRight: 6,
    marginTop: -4,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
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
    borderRadius: spacing.borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  chipTextActive: {
    color: colors.textInverse,
  },
  chipMax: {
    backgroundColor: colors.warningBg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: spacing.borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.warning,
  },
  chipMaxText: {
    color: colors.warning,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.heavy,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
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
    borderColor: colors.border,
  },
  accountCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
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
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.heavy,
  },
  accountPillTypeActive: {
    color: colors.textInverse,
  },
  accountPillNumber: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  accountPillBalance: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.heavy,
  },
  accountPillTextActive: {
    color: colors.textInverse,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.infoBg,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.info,
    marginBottom: spacing.xl,
  },
  infoText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs + 2,
  },
  submitBtn: {
    borderRadius: spacing.borderRadius.md,
    paddingVertical: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  successCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  successIconBg: {
    marginBottom: spacing.md,
  },
  successTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
    textAlign: 'center',
  },
  successSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  voucherBox: {
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  voucherAmount: {
    color: colors.danger,
    fontSize: typography.fontSize.hero,
    fontWeight: typography.fontWeight.heavy,
    marginBottom: spacing.md,
  },
  codeContainer: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    marginBottom: spacing.md,
  },
  codeLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    letterSpacing: 1,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 4,
  },
  codeText: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: typography.fontWeight.heavy,
    letterSpacing: 6,
    fontFamily: 'monospace',
    marginVertical: 4,
  },
  expiryText: {
    color: colors.warning,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  receiptRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  receiptLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
  },
  receiptValue: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  doneBtn: {
    width: '100%',
  },
});