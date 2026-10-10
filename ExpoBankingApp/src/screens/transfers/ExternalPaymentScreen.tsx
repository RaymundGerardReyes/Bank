import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import {
  ActivityIndicator,
  Animated,
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
import { Institution } from '../../models/Institution';
import { transactionService } from '../../services/transaction/transactionService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency, generateUUID, maskAccountNumber } from '../../utils/formatters';

interface RailOption {
  key: string;
  label: string;
  subtitle: string;
  currency: string;
  delivery: string;
  routingLabel: string;
  routingPlaceholder: string;
  maxLen: number;
}

const SUPPORTED_RAILS: RailOption[] = [
  {
    key: 'FEDWIRE',
    label: 'Fedwire',
    subtitle: 'Real-Time Gross Settlement',
    currency: 'USD',
    delivery: 'Same-Day Real-Time',
    routingLabel: 'ABA Routing Transit Number (9 digits)',
    routingPlaceholder: '021000021',
    maxLen: 9,
  },
  {
    key: 'ACH',
    label: 'ACH Direct',
    subtitle: 'Automated Clearing House',
    currency: 'USD',
    delivery: '1-2 Business Days',
    routingLabel: 'ABA Routing Number (9 digits)',
    routingPlaceholder: '021000021',
    maxLen: 9,
  },
  {
    key: 'INSTAPAY',
    label: 'InstaPay',
    subtitle: 'Real-Time Retail Transfer',
    currency: 'PHP',
    delivery: 'Instant 24/7 (Up to ₱50k)',
    routingLabel: 'Receiving Bank BIC / Clearing Code',
    routingPlaceholder: 'BDOUPHM2',
    maxLen: 11,
  },
  {
    key: 'PESONET',
    label: 'PESONet',
    subtitle: 'Batch Electronic Fund Transfer',
    currency: 'PHP',
    delivery: 'Same-Day Batch (Up to ₱500k)',
    routingLabel: 'Receiving Bank BIC / Clearing Code',
    routingPlaceholder: 'BOPIPHMM',
    maxLen: 11,
  },
  {
    key: 'SWIFT',
    label: 'SWIFT Wire',
    subtitle: 'Cross-Border Interbank Wire',
    currency: 'USD',
    delivery: '1-3 Business Days',
    routingLabel: 'SWIFT BIC Code (8 or 11 characters)',
    routingPlaceholder: 'HSBCUS33',
    maxLen: 11,
  },
];

export const ExternalPaymentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { accounts, refetch } = useAccounts();

  const initialSource = route.params?.sourceAccountNumber;
  const [selectedSource, setSelectedSource] = React.useState<string>(initialSource || '');
  const [selectedRail, setSelectedRail] = React.useState<string>('FEDWIRE');
  const [institutions, setInstitutions] = React.useState<Institution[]>([]);
  const [loadingInstitutions, setLoadingInstitutions] = React.useState<boolean>(false);

  const [selectedBankName, setSelectedBankName] = React.useState<string>('');
  const [routingNo, setRoutingNo] = React.useState('');
  const [recipientAcc, setRecipientAcc] = React.useState('');
  const [recipientName, setRecipientName] = React.useState('');
  const [amount, setAmount] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [successData, setSuccessData] = React.useState<any | null>(null);

  const currentRail = React.useMemo(() => {
    return SUPPORTED_RAILS.find((r) => r.key === selectedRail) || SUPPORTED_RAILS[0];
  }, [selectedRail]);

  // Sync initial source account
  React.useEffect(() => {
    if (initialSource) {
      setSelectedSource(initialSource);
    } else if (accounts && accounts.length > 0 && !selectedSource) {
      const active = accounts.find((a) => a.status === 'ACTIVE') || accounts[0];
      setSelectedSource(active.accountNumber);
    }
  }, [accounts, initialSource, selectedSource]);

  // Fetch live institutions from backend whenever the selected rail changes
  React.useEffect(() => {
    let isMounted = true;
    const fetchInstitutions = async () => {
      setLoadingInstitutions(true);
      try {
        const liveInstitutions = await transactionService.getInstitutions(selectedRail);
        if (isMounted) {
          setInstitutions(liveInstitutions);
          if (liveInstitutions.length > 0) {
            const first = liveInstitutions[0];
            setSelectedBankName(first.name || first.institutionName);
            setRoutingNo(first.routingCode || first.bic);
          } else {
            setSelectedBankName('');
            setRoutingNo('');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setInstitutions([]);
        }
      } finally {
        if (isMounted) {
          setLoadingInstitutions(false);
        }
      }
    };

    fetchInstitutions();
    return () => {
      isMounted = false;
    };
  }, [selectedRail]);

  const activeAccount = accounts?.find((a) => a.accountNumber === selectedSource);

  const selectBankPreset = (bank: Institution) => {
    setSelectedBankName(bank.name || bank.institutionName);
    setRoutingNo(bank.routingCode || bank.bic);
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
    if (!cleanRouting) {
      setError(`Please enter a valid ${currentRail.routingLabel.toLowerCase()}.`);
      return;
    }
    if (currentRail.maxLen === 9 && cleanRouting.length !== 9) {
      setError('ABA routing number must be exactly 9 digits.');
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
      setError(`Amount must be greater than ${currentRail.currency === 'PHP' ? '₱0.00' : '$0.00'}.`);
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
          activeAccount.currency || currentRail.currency
        )}.`
      );
      return;
    }

    setLoading(true);
    try {
      const idempotencyKey = generateUUID();
      await transactionService.externalPayment({
        sourceAccountNumber: cleanSource,
        destinationAccountNumber: cleanDest,
        recipientAccountNumber: cleanDest,
        routingNumber: cleanRouting,
        recipientName: recipientName.trim(),
        amount: parsedAmount,
        railName: selectedRail,
        idempotencyKey,
      });

      if (refetch) await refetch();

      setSuccessData({
        amount: parsedAmount,
        currency: currentRail.currency,
        source: cleanSource,
        recipient: recipientName.trim(),
        recipientAccount: cleanDest,
        bank: selectedBankName || 'External Financial Institution',
        rail: currentRail.label,
        reference: idempotencyKey.substring(0, 8).toUpperCase(),
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to process external transfer.';
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
          <Text style={styles.successTitle}>Transfer Dispatched</Text>
          <Text style={styles.successSubtitle}>
            Funds are queued for {successData.rail} settlement to {successData.recipient}.
          </Text>

          <View style={styles.receiptBox}>
            <Text style={styles.receiptAmount}>
              -{formatCurrency(successData.amount, successData.currency)}
            </Text>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Settlement Rail</Text>
              <Text style={styles.receiptValue}>{successData.rail}</Text>
            </View>
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
              <Text style={styles.receiptLabel}>Reference ID</Text>
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
            <Text style={styles.title}>External Transfer</Text>
            <Text style={styles.subtitle}>{currentRail.subtitle}</Text>
          </View>

          {error ? <ErrorBanner message={error} onDismiss={() => setError('')} /> : null}

          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>{currentRail.currency === 'PHP' ? '₱' : '$'}</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
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
                      <Ionicons name="checkmark-circle" size={16} color={colors.textInverse} />
                    )}
                  </View>
                  <Text style={[styles.accountPillNumber, isSelected && styles.accountPillTextActive]}>
                    {maskAccountNumber(acc.accountNumber)}
                  </Text>
                  <Text style={[styles.accountPillBalance, isSelected && styles.accountPillTextActive]}>
                    {formatCurrency(acc.balance, acc.currency || currentRail.currency)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Payment Rail Selector */}
          <Text style={styles.sectionLabel}>Payment Rail</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.railSelectorScroll}
          >
            {SUPPORTED_RAILS.map((rail) => {
              const isSelected = rail.key === selectedRail;
              return (
                <TouchableOpacity
                  key={rail.key}
                  style={[styles.railCardPill, isSelected && styles.railCardSelected]}
                  onPress={() => setSelectedRail(rail.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.railTitle, isSelected && styles.railTextActive]}>
                    {rail.label}
                  </Text>
                  <Text style={[styles.railSubtitle, isSelected && styles.railSubtitleActive]}>
                    {rail.delivery}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Destination Bank Presets (Live Directory) */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>
              Select Recipient Bank
            </Text>
            {loadingInstitutions ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.badgeText}>{institutions.length} Live</Text>
            )}
          </View>

          {loadingInstitutions ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Fetching active network institutions...</Text>
            </View>
          ) : institutions.length > 0 ? (
            <View style={styles.bankChipsRow}>
              {institutions.map((b) => {
                const code = b.routingCode || b.bic;
                const isSelected = routingNo === code;
                return (
                  <TouchableOpacity
                    key={b.id || code}
                    style={[styles.bankChip, isSelected && styles.bankChipSelected]}
                    onPress={() => selectBankPreset(b)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.bankChipText, isSelected && styles.bankChipTextSelected]}>
                      {b.name || b.institutionName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyNotice}>
              <Text style={styles.emptyNoticeText}>
                No pre-configured banks for this rail. Enter routing or BIC manually below.
              </Text>
            </View>
          )}

          {/* Recipient Details Card */}
          <View style={styles.card}>
            <Input
              label={currentRail.routingLabel}
              placeholder={currentRail.routingPlaceholder}
              value={routingNo}
              onChangeText={(text) => {
                setRoutingNo(text);
                setSelectedBankName('External Financial Institution');
              }}
              keyboardType={currentRail.maxLen === 9 ? 'number-pad' : 'default'}
              maxLength={currentRail.maxLen}
              autoCapitalize="characters"
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
              placeholder="Full Legal Name or Registered Business"
              value={recipientName}
              onChangeText={setRecipientName}
            />
          </View>

          {/* Fee & Settlement Breakdown */}
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Estimated Delivery</Text>
              <Text style={styles.breakdownValue}>{currentRail.delivery}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Transfer Fee</Text>
              <Text style={[styles.breakdownValue, { color: colors.success }]}>
                {currentRail.currency === 'PHP' ? '₱0.00 (Promo)' : '$0.00 (Promo)'}
              </Text>
            </View>
            <View style={[styles.breakdownRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Systemic Debit</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(parseFloat(amount || '0'), currentRail.currency)}
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <Button
            title={`Dispatch ${currentRail.label} Transfer`}
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
    color: colors.primary,
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
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badgeText: {
    color: colors.success,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
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
  railSelectorScroll: {
    gap: 10,
    paddingBottom: spacing.md,
  },
  railCardPill: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    minWidth: 120,
  },
  railCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  railTitle: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.heavy,
  },
  railSubtitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  railTextActive: {
    color: colors.textInverse,
  },
  railSubtitleActive: {
    color: 'rgba(255,255,255,0.75)',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
  emptyNotice: {
    backgroundColor: colors.surfaceAlt,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.sm,
    marginBottom: spacing.md,
  },
  emptyNoticeText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    fontStyle: 'italic',
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
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bankChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  bankChipText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  bankChipTextSelected: {
    color: colors.textInverse,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  breakdownLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
  },
  breakdownValue: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    marginTop: 6,
    paddingTop: 8,
  },
  totalLabel: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  totalValue: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.heavy,
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
  receiptBox: {
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  receiptAmount: {
    color: colors.primary,
    fontSize: typography.fontSize.hero,
    fontWeight: typography.fontWeight.heavy,
    marginBottom: spacing.md,
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