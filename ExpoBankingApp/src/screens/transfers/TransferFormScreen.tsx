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
import { idempotencyKeyService } from '../../services/transaction/idempotencyKeyService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

export const TransferFormScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { accounts } = useAccounts();

  const initialSource = route.params?.sourceAccountNumber;
  const [selectedSourceAcc, setSelectedSourceAcc] = React.useState<string>(initialSource || '');
  const [destAcc, setDestAcc] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [error, setError] = React.useState('');

  // Auto-select first active account if not already selected
  React.useEffect(() => {
    if (initialSource) {
      setSelectedSourceAcc(initialSource);
    } else if (accounts && accounts.length > 0 && !selectedSourceAcc) {
      const active = accounts.find((a) => a.status === 'ACTIVE') || accounts[0];
      setSelectedSourceAcc(active.accountNumber);
    }
  }, [accounts, initialSource, selectedSourceAcc]);

  const activeAccount = accounts?.find((a) => a.accountNumber === selectedSourceAcc);

  const handleSetMax = () => {
    if (activeAccount) {
      setAmount(String(activeAccount.balance || 0));
    }
  };

  const handleProceed = () => {
    setError('');
    const parsedAmount = parseFloat(amount);
    const cleanSource = selectedSourceAcc.replace(/\s/g, '');
    const cleanDest = destAcc.replace(/\s/g, '');

    if (!cleanSource) {
      setError('Please select a source funding account.');
      return;
    }
    if (!cleanDest) {
      setError('Please enter the recipient account number.');
      return;
    }
    if (cleanSource === cleanDest) {
      setError('Source and recipient account numbers cannot be identical.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Transfer amount must be greater than $0.00.');
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

    const idempotencyKey = idempotencyKeyService.getOrCreateKey();
    navigation.navigate('TransferReview', {
      sourceAccountNumber: cleanSource,
      destinationAccountNumber: cleanDest,
      amount: parsedAmount,
      description: description.trim() || 'Internal NovaBank Transfer',
      idempotencyKey,
    });
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom + 100 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Send Money</Text>
            <Text style={styles.subtitle}>Instant fee-free internal transfer</Text>
          </View>

          {/* Transfer Rail Toggle (Internal vs External Wire) */}
          <View style={styles.railToggleContainer}>
            <View style={[styles.railTab, styles.railTabActive]}>
              <Ionicons name="flash-outline" size={16} color={colors.dominant} style={{ marginRight: 6 }} />
              <Text style={styles.railTextActive}>NovaBank Instant</Text>
            </View>
            <TouchableOpacity
              style={styles.railTab}
              onPress={() => navigation.navigate('ExternalPayment', { sourceAccountNumber: selectedSourceAcc })}
            >
              <Ionicons name="globe-outline" size={16} color={colors.accent} style={{ marginRight: 6 }} />
              <Text style={styles.railText}>External Wire / ACH</Text>
            </TouchableOpacity>
          </View>

          {error ? <ErrorBanner message={error} onDismiss={() => setError('')} /> : null}

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

          {/* Source Account Carousel */}
          <Text style={styles.sectionLabel}>Pay From Account</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.accountSelectorScroll}
          >
            {accounts?.map((acc) => {
              const isSelected = acc.accountNumber === selectedSourceAcc;
              const isAccActive = acc.status === 'ACTIVE';

              return (
                <TouchableOpacity
                  key={acc.accountNumber}
                  style={[
                    styles.accountCardPill,
                    isSelected && styles.accountCardSelected,
                    !isAccActive && styles.accountCardDisabled,
                  ]}
                  onPress={() => setSelectedSourceAcc(acc.accountNumber)}
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

          {/* Form Fields Card */}
          <View style={styles.card}>
            <Input
              label="Recipient NovaBank Account Number"
              placeholder="e.g. 4859 2200 1337 9999"
              value={destAcc}
              onChangeText={setDestAcc}
              keyboardType="number-pad"
            />
            <View style={styles.divider} />
            <Input
              label="Memo / Reference Note (Optional)"
              placeholder="e.g. Rent, Freelance Invoice, Dinner"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Review Transfer Button inside flow */}
          <Button
            title="Review & Confirm Transfer"
            onPress={handleProceed}
            style={styles.reviewButton}
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
  scrollContainer: {
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
  railToggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    padding: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  railTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  railTabActive: {
    backgroundColor: colors.accent,
  },
  railTextActive: {
    color: colors.dominant,
    fontSize: 12,
    fontWeight: '800',
  },
  railText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
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
    width: 170,
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
    letterSpacing: 0.5,
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.xl,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: spacing.md,
  },
  reviewButton: {
    borderRadius: spacing.borderRadius.md,
    paddingVertical: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});