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
import { Account, AccountType } from '../../models/Account';
import { accountService } from '../../services/account/accountService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';

interface ProductOption {
  type: AccountType;
  title: string;
  subtitle: string;
  rate: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: string;
  benefits: string[];
}

const PRODUCT_OPTIONS: ProductOption[] = [
  {
    type: AccountType.CHECKING,
    title: 'Everyday Checking',
    subtitle: 'Zero monthly fees, fee-free ATM access & debit card',
    rate: '0.05% APY',
    icon: 'card-outline',
    benefits: ['Zero maintenance fee', 'Instant P2P transfers', 'Real-time transaction alerts'],
  },
  {
    type: AccountType.SAVINGS,
    title: 'High-Yield Savings',
    subtitle: 'Maximize liquidity with market-leading compound interest',
    rate: '4.50% APY',
    icon: 'trending-up-outline',
    badge: 'MOST POPULAR',
    benefits: ['4.50% high yield APY', 'Compounded daily', 'FDIC-insured protection up to $250,000'],
  },
  {
    type: AccountType.INVESTMENT,
    title: 'Treasury & Investment',
    subtitle: 'Managed automated yield and money market instruments',
    rate: '5.10% APY',
    icon: 'stats-chart-outline',
    badge: 'PREMIUM',
    benefits: ['Institutional yields', 'Flexible liquidity sweeps', 'Dedicated account specialist'],
  },
];

const PRESET_AMOUNTS = [100, 500, 1000, 5000];

export const OpenAccountScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const initialProduct = (route.params?.productType as AccountType) || AccountType.SAVINGS;
  const [selectedType, setSelectedType] = React.useState<AccountType>(initialProduct);
  const [deposit, setDeposit] = React.useState('500');
  const [acceptedTerms, setAcceptedTerms] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [createdAccount, setCreatedAccount] = React.useState<Account | null>(null);

  const selectedProduct = PRODUCT_OPTIONS.find((p) => p.type === selectedType) || PRODUCT_OPTIONS[0];

  const handleOpenAccount = async () => {
    setError('');
    const parsedAmount = parseFloat(deposit);

    if (isNaN(parsedAmount) || parsedAmount < 25) {
      setError('A minimum initial deposit of $25.00 is required to open this account.');
      return;
    }
    if (!acceptedTerms) {
      setError('Please review and agree to the account opening terms.');
      return;
    }

    setLoading(true);
    try {
      const newAcc = await accountService.openAccount(selectedType, parsedAmount);
      setCreatedAccount(newAcc);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to open account. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (createdAccount) {
    return (
      <SecureScreenWrapper style={styles.successContainer}>
        <View style={styles.successCard}>
          <View style={styles.successIconBg}>
            <Ionicons name="checkmark-circle" size={56} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Account Opened!</Text>
          <Text style={styles.successSub}>
            Your new {createdAccount.accountType} account is active and ready to use.
          </Text>

          <View style={styles.accountCardSnippet}>
            <Text style={styles.snippetLabel}>New Account Number</Text>
            <Text style={styles.snippetNumber}>{createdAccount.accountNumber}</Text>
            <View style={styles.snippetRow}>
              <Text style={styles.snippetSubText}>Initial Funded Balance</Text>
              <Text style={styles.snippetBalance}>
                {formatCurrency(createdAccount.balance, createdAccount.currency || 'USD')}
              </Text>
            </View>
          </View>

          <Button
            title="View Account Details"
            onPress={() => {
              navigation.replace('AccountDetail', { accountNumber: createdAccount.accountNumber });
            }}
            style={styles.doneBtn}
          />

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.homeBtnText}>Return to Dashboard</Text>
          </TouchableOpacity>
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
            <Text style={styles.title}>Open New Account</Text>
            <Text style={styles.subtitle}>Select your preferred account type and fund initial balance.</Text>
          </View>

          {error ? <ErrorBanner message={error} onDismiss={() => setError('')} /> : null}

          {/* Product Cards Selector */}
          <Text style={styles.sectionLabel}>Select Account Type</Text>
          <View style={styles.productList}>
            {PRODUCT_OPTIONS.map((prod) => {
              const isSelected = prod.type === selectedType;
              return (
                <TouchableOpacity
                  key={prod.type}
                  style={[styles.productCard, isSelected && styles.productCardSelected]}
                  onPress={() => setSelectedType(prod.type)}
                  activeOpacity={0.8}
                >
                  <View style={styles.productTopRow}>
                    <View style={styles.productTitleRow}>
                      <View style={[styles.productIconBg, isSelected && styles.productIconBgActive]}>
                        <Ionicons
                          name={prod.icon}
                          size={22}
                          color={isSelected ? colors.dominant : colors.accent}
                        />
                      </View>
                      <View>
                        <Text style={[styles.productName, isSelected && styles.productNameActive]}>
                          {prod.title}
                        </Text>
                        <Text style={styles.productRateBadge}>{prod.rate}</Text>
                      </View>
                    </View>
                    {prod.badge && (
                      <View style={styles.badgePopular}>
                        <Text style={styles.badgePopularText}>{prod.badge}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.productDescription}>{prod.subtitle}</Text>

                  {/* Bullet Benefits */}
                  <View style={styles.benefitsContainer}>
                    {prod.benefits.map((b, idx) => (
                      <View key={idx} style={styles.benefitRow}>
                        <Ionicons name="checkmark-circle-outline" size={14} color={colors.success} />
                        <Text style={styles.benefitText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Initial Deposit Section */}
          <Text style={styles.sectionLabel}>Initial Deposit Amount</Text>
          <View style={styles.depositCard}>
            <View style={styles.amountInputRow}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={deposit}
                onChangeText={setDeposit}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Quick Presets */}
            <View style={styles.chipsRow}>
              {PRESET_AMOUNTS.map((val) => {
                const isSelected = deposit === String(val);
                return (
                  <TouchableOpacity
                    key={val}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setDeposit(String(val))}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      ${val}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Live Preview Card */}
          <Text style={styles.sectionLabel}>Live Account Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewType}>{selectedProduct.title.toUpperCase()}</Text>
              <Text style={styles.previewStatus}>STATUS: READY TO PROVISION</Text>
            </View>
            <Text style={styles.previewNumber}>•••• •••• •••• NEW</Text>
            <View style={styles.previewBalanceRow}>
              <View>
                <Text style={styles.previewBalanceLabel}>Starting Balance</Text>
                <Text style={styles.previewBalanceValue}>
                  ${parseFloat(deposit || '0').toFixed(2)} USD
                </Text>
              </View>
              <View style={styles.previewYieldBadge}>
                <Text style={styles.previewYieldText}>{selectedProduct.rate}</Text>
              </View>
            </View>
          </View>

          {/* Terms & Conditions Check */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={acceptedTerms ? 'checkbox' : 'square-outline'}
              size={22}
              color={acceptedTerms ? colors.accent : colors.textMuted}
            />
            <Text style={styles.termsText}>
              I agree to the NovaBank Account Agreement, Deposit Terms, and Electronic Disclosures.
            </Text>
          </TouchableOpacity>

          {/* Action Button */}
          <Button
            title={`Open ${selectedProduct.title} Now`}
            onPress={handleOpenAccount}
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
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.accent,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  sectionLabel: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  productList: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  productCardSelected: {
    borderColor: colors.accent,
    backgroundColor: '#FFFFFF',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  productTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  productIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productIconBgActive: {
    backgroundColor: colors.accent,
  },
  productName: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '800',
  },
  productNameActive: {
    color: colors.accent,
  },
  productRateBadge: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  badgePopular: {
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  badgePopularText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '800',
  },
  productDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  benefitsContainer: {
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  benefitText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  depositCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  currencySymbol: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.accent,
    marginRight: 6,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.accent,
    minWidth: 120,
    textAlign: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  chip: {
    flex: 1,
    backgroundColor: colors.dominant,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: colors.dominant,
  },
  previewCard: {
    backgroundColor: colors.accent,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewType: {
    color: colors.dominant,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  previewStatus: {
    color: '#86EFAC',
    fontSize: 10,
    fontWeight: '700',
  },
  previewNumber: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: 16,
  },
  previewBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  previewBalanceLabel: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  previewBalanceValue: {
    color: colors.dominant,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  previewYieldBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  previewYieldText: {
    color: colors.dominant,
    fontSize: 12,
    fontWeight: '800',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.xl,
    paddingHorizontal: 4,
  },
  termsText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
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
  successSub: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  accountCardSnippet: {
    width: '100%',
    backgroundColor: colors.dominant,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: spacing.xl,
  },
  snippetLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  snippetNumber: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
    fontFamily: 'monospace',
    marginVertical: 4,
  },
  snippetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  snippetSubText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  snippetBalance: {
    color: colors.success,
    fontSize: 15,
    fontWeight: '800',
  },
  doneBtn: {
    width: '100%',
    marginBottom: spacing.md,
  },
  homeBtn: {
    paddingVertical: spacing.sm,
  },
  homeBtnText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
});

