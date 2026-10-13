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
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { Input } from '../../components/common/Input';
import { SectionHeader } from '../../components/common/SectionHeader';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAccounts } from '../../hooks/useAccounts';
import { idempotencyKeyService } from '../../services/transaction/idempotencyKeyService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

export const TransferFormScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { accounts } = useAccounts();

  const initialSource = route.params?.sourceAccountNumber;
  const initialDest = route.params?.destinationAccountNumber;
  const initialAmount = route.params?.amount;

  const [selectedSourceAcc, setSelectedSourceAcc] = React.useState<string>(initialSource || '');
  const [destAcc, setDestAcc] = React.useState<string>(initialDest || '');
  const [amount, setAmount] = React.useState<string>(initialAmount ? String(initialAmount) : '');
  const [description, setDescription] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (initialSource) {
      setSelectedSourceAcc(initialSource);
    } else if (accounts && accounts.length > 0 && !selectedSourceAcc) {
      const active = accounts.find((account) => account.status === 'ACTIVE') || accounts[0];
      setSelectedSourceAcc(active.accountNumber);
    }
  }, [accounts, initialSource, selectedSourceAcc]);

  React.useEffect(() => {
    if (initialDest && !destAcc) {
      setDestAcc(initialDest);
    }
    if (initialAmount && !amount) {
      setAmount(String(initialAmount));
    }
  }, [initialDest, initialAmount]);

  const activeAccount = accounts?.find((account) => account.accountNumber === selectedSourceAcc);
  const activeCurrency = activeAccount?.currency || 'PHP';

  const otherOwnAccounts = React.useMemo(() => {
    if (!accounts) return [];
    return accounts.filter((account) => account.accountNumber !== selectedSourceAcc && account.status === 'ACTIVE');
  }, [accounts, selectedSourceAcc]);

  const handleSetMax = () => {
    if (activeAccount) setAmount(String(activeAccount.balance || 0));
  };

  const handleProceed = () => {
    setError('');
    const parsedAmount = parseFloat(amount);
    const cleanSource = selectedSourceAcc.replace(/\s/g, '');
    const cleanDest = destAcc.replace(/\s/g, '');

    if (!cleanSource) {
      setError('Select the account to transfer from.');
      return;
    }
    if (cleanSource.includes('*') || cleanSource.includes('•')) {
      setError('Source account number cannot be masked.');
      return;
    }
    if (!cleanDest) {
      setError('Enter the recipient account number.');
      return;
    }
    if (cleanDest.includes('*') || cleanDest.includes('•')) {
      setError('Masked account numbers cannot be used for transfers. Please enter the complete unmasked account number.');
      return;
    }
    if (!/^[A-Za-z0-9_-]{3,50}$/.test(cleanDest)) {
      setError('Recipient account number must be between 3 and 50 valid characters.');
      return;
    }
    if (cleanSource === cleanDest) {
      setError('Source and recipient account numbers cannot be identical.');
      return;
    }

    // Pre-flight check: Prevent cross-currency failure if target is another known own account
    const destOwnAccount = accounts?.find((account) => account.accountNumber === cleanDest);
    if (destOwnAccount && destOwnAccount.currency && activeAccount && activeAccount.currency) {
      if (destOwnAccount.currency !== activeAccount.currency) {
        setError(
          `Cross-currency transfer between ${activeAccount.currency} and ${destOwnAccount.currency} is currently disabled. Both accounts must hold ${activeAccount.currency}.`
        );
        return;
      }
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Transfer amount must be greater than 0.');
      return;
    }
    if (activeAccount && activeAccount.status !== 'ACTIVE') {
      setError(`Cannot transfer from a ${activeAccount.status.toLowerCase()} account.`);
      return;
    }
    if (activeAccount && parsedAmount > activeAccount.balance) {
      setError(`Available balance is ${formatCurrency(activeAccount.balance, activeCurrency)}.`);
      return;
    }

    const idempotencyKey = idempotencyKeyService.getOrCreateKey();
    navigation.navigate('TransferReview', {
      sourceAccountNumber: cleanSource,
      destinationAccountNumber: cleanDest,
      amount: parsedAmount,
      currency: activeCurrency,
      description: description.trim() || 'Internal NovaBank Transfer',
      idempotencyKey,
    });
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom + 88 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Transfer</Text>
            <Text style={styles.subtitle}>Send money between NovaBank accounts.</Text>
          </View>

          <View style={styles.railToggleContainer}>
            <View style={[styles.railTab, styles.railTabActive]}>
              <Ionicons name="swap-horizontal-outline" size={16} color={colors.textInverse} />
              <Text style={styles.railTextActive}>Internal</Text>
            </View>
            <TouchableOpacity
              style={styles.railTab}
              onPress={() => navigation.navigate('ExternalPayment', { sourceAccountNumber: selectedSourceAcc })}
              accessibilityRole="button"
            >
              <Ionicons name="globe-outline" size={16} color={colors.primary} />
              <Text style={styles.railText}>External</Text>
            </TouchableOpacity>
          </View>

          {error ? <ErrorBanner message={error} onDismiss={() => setError('')} /> : null}

          <Card style={styles.amountCard}>
            <Text style={styles.sectionLabel}>Amount</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>{activeCurrency}</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                accessibilityLabel="Transfer amount"
              />
            </View>
            <View style={styles.chipsRow}>
              {PRESET_AMOUNTS.map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[styles.chip, amount === String(value) && styles.chipActive]}
                  onPress={() => setAmount(String(value))}
                  accessibilityRole="button"
                >
                  <Text style={[styles.chipText, amount === String(value) && styles.chipTextActive]}>
                    {formatCurrency(value, activeCurrency)}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.chip} onPress={handleSetMax} accessibilityRole="button">
                <Text style={styles.chipText}>Max</Text>
              </TouchableOpacity>
            </View>
          </Card>

          <SectionHeader title="From Account" />
          {accounts && accounts.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.accountSelectorScroll}
            >
              {accounts.map((account) => {
                const isSelected = account.accountNumber === selectedSourceAcc;
                const isActive = account.status === 'ACTIVE';

                return (
                  <TouchableOpacity
                    key={account.accountNumber}
                    style={[
                      styles.accountOption,
                      isSelected && styles.accountOptionSelected,
                      !isActive && styles.accountOptionDisabled,
                    ]}
                    onPress={() => setSelectedSourceAcc(account.accountNumber)}
                    activeOpacity={0.82}
                    accessibilityRole="button"
                  >
                    <View style={styles.accountOptionHeader}>
                      <Text style={[styles.accountType, isSelected && styles.selectedText]}>
                        {account.accountType}
                      </Text>
                      {isSelected ? (
                        <Ionicons name="checkmark-circle" size={18} color={colors.textInverse} />
                      ) : null}
                    </View>
                    <Text style={[styles.accountNumber, isSelected && styles.selectedText]}>
                      {maskAccountNumber(account.accountNumber)}
                    </Text>
                    <Text style={[styles.accountBalance, isSelected && styles.selectedText]}>
                      {formatCurrency(account.balance, account.currency || 'PHP')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <EmptyState
              icon="wallet-outline"
              title="No source accounts"
              message="Open an account before starting an internal transfer."
              actionLabel="Open account"
              onActionPress={() => navigation.navigate('OpenAccount')}
            />
          )}

          <SectionHeader title="Recipient" />
          {otherOwnAccounts.length > 0 ? (
            <View style={styles.ownAccountsSection}>
              <Text style={styles.ownAccountsTitle}>My Other Accounts</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.ownAccountsScroll}
              >
                {otherOwnAccounts.map((account) => {
                  const isSelected = destAcc === account.accountNumber;
                  const isSameCurrency = account.currency === activeCurrency;
                  return (
                    <TouchableOpacity
                      key={account.accountNumber}
                      style={[
                        styles.ownAccountChip,
                        isSelected && styles.ownAccountChipSelected,
                        !isSameCurrency && styles.ownAccountChipMismatch,
                      ]}
                      onPress={() => {
                        if (isSameCurrency) {
                          setDestAcc(account.accountNumber);
                          setError('');
                        } else {
                          setError(
                            `Cross-currency transfer from ${activeCurrency} to ${account.currency} is currently disabled. Both accounts must hold ${activeCurrency}.`
                          );
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.ownAccountChipHeader}>
                        <Text style={[styles.ownAccountChipType, isSelected && styles.ownAccountChipTextSelected]}>
                          {account.accountType}
                        </Text>
                        <Text style={[styles.ownAccountChipCurrency, isSelected && styles.ownAccountChipTextSelected]}>
                          {account.currency}
                        </Text>
                      </View>
                      <Text style={[styles.ownAccountChipNumber, isSelected && styles.ownAccountChipTextSelected]}>
                        {maskAccountNumber(account.accountNumber)}
                      </Text>
                      {!isSameCurrency && (
                        <View style={styles.currencyMismatchBadge}>
                          <Text style={styles.currencyMismatchText}>Different Currency</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          <Card style={styles.formCard}>
            <Input
              label="Recipient account number"
              placeholder="Enter 16-digit account number"
              value={destAcc}
              onChangeText={(text) => {
                setDestAcc(text);
                if (text.includes('*') || text.includes('•')) {
                  setError('Masked account numbers cannot be used for transfers. Please enter the full unmasked digits.');
                } else {
                  setError('');
                }
              }}
              keyboardType="number-pad"
            />
            <Input
              label="Memo"
              placeholder="Optional note"
              value={description}
              onChangeText={setDescription}
            />
          </Card>

          <Button
            title="Review transfer"
            onPress={handleProceed}
            fullWidth
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
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
    fontWeight: typography.fontWeight.heavy,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    marginTop: spacing.xs,
  },
  railToggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  railTab: {
    flex: 1,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: spacing.borderRadius.sm,
  },
  railTabActive: {
    backgroundColor: colors.primary,
  },
  railTextActive: {
    color: colors.textInverse,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  railText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  amountCard: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  currencySymbol: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.fontWeight.heavy,
    marginRight: spacing.sm,
  },
  amountInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: typography.fontWeight.heavy,
    paddingVertical: 0,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    minHeight: spacing.touchTarget,
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  chipTextActive: {
    color: colors.textInverse,
  },
  accountSelectorScroll: {
    gap: spacing.ms,
    paddingBottom: spacing.sm,
  },
  accountOption: {
    width: 176,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  accountOptionDisabled: {
    opacity: 0.45,
  },
  accountOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  accountType: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    fontWeight: typography.fontWeight.heavy,
  },
  accountNumber: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    marginBottom: spacing.sm,
  },
  accountBalance: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontWeight: typography.fontWeight.heavy,
  },
  selectedText: {
    color: colors.textInverse,
  },
  ownAccountsSection: {
    marginBottom: spacing.md,
  },
  ownAccountsTitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ownAccountsScroll: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  ownAccountChip: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    minWidth: 130,
  },
  ownAccountChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  ownAccountChipMismatch: {
    borderColor: colors.warning,
    backgroundColor: colors.surfaceAlt,
  },
  ownAccountChipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ownAccountChipType: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.heavy,
  },
  ownAccountChipCurrency: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  ownAccountChipNumber: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontFamily: 'monospace',
  },
  ownAccountChipTextSelected: {
    color: colors.textInverse,
  },
  currencyMismatchBadge: {
    marginTop: 4,
    backgroundColor: colors.warningBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  currencyMismatchText: {
    color: colors.warning,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
  formCard: {
    paddingBottom: spacing.xs,
    marginBottom: spacing.lg,
  },
  reviewButton: {
    marginTop: spacing.sm,
  },
});
