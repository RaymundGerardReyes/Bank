import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccountBalanceCard } from '../../components/accounts/AccountBalanceCard';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAccounts } from '../../hooks/useAccounts';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';

export const AccountListScreen = () => {
  const { accounts, refetch } = useAccounts();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (refetch) await refetch();
    setRefreshing(false);
  };

  const totalBalance = React.useMemo(() => {
    if (!accounts || accounts.length === 0) return 0;
    return accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  }, [accounts]);

  const renderHeader = () => (
    <View style={styles.headerArea}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Your Accounts</Text>
          <Text style={styles.subtitle}>
            {accounts?.length || 0} active {accounts?.length === 1 ? 'account' : 'accounts'} registered
          </Text>
        </View>
        <TouchableOpacity
          style={styles.openAccountHeaderBtn}
          onPress={() => navigation.navigate('OpenAccount')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color={colors.dominant} style={{ marginRight: 4 }} />
          <Text style={styles.openAccountBtnText}>Open Account</Text>
        </TouchableOpacity>
      </View>

      {/* Portfolio Summary Pill */}
      {accounts && accounts.length > 0 && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryLabel}>Total Net Liquidity</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(totalBalance, 'USD')}</Text>
          </View>
          <TouchableOpacity
            style={styles.ratesPill}
            onPress={() => navigation.navigate('ProductCatalog')}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles" size={14} color={colors.accent} style={{ marginRight: 4 }} />
            <Text style={styles.ratesPillText}>Rates & Yields</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerPromoCard}>
      <View style={styles.promoIconContainer}>
        <Ionicons name="trending-up" size={24} color={colors.accent} />
      </View>
      <View style={styles.promoTextContainer}>
        <Text style={styles.promoTitle}>Earn 4.50% APY on Savings</Text>
        <Text style={styles.promoDesc}>Open a high-yield sub-account in under 60 seconds with zero paperwork.</Text>
      </View>
      <TouchableOpacity
        style={styles.promoActionBtn}
        onPress={() => navigation.navigate('OpenAccount', { productType: 'SAVINGS' })}
      >
        <Ionicons name="arrow-forward" size={18} color={colors.dominant} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.hardenedEmptyCard}>
      <View style={styles.warningIconContainer}>
        <Text style={styles.warningIconText}>⚠️</Text>
      </View>
      <Text style={styles.emptyCardTitle}>No Active Accounts Found</Text>
      <Text style={styles.emptyCardDescription}>
        We could not locate a checking or savings account linked to your profile. This can happen if your registration was incomplete or your account is pending manual KYC verification.
      </Text>
      <TouchableOpacity
        style={styles.contactSupportBtn}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('OpenAccount')}
      >
        <Text style={styles.contactSupportText}>+ Open New Account</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SecureScreenWrapper style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.accountNumber}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={accounts && accounts.length > 0 ? renderFooter : null}
        renderItem={({ item }) => (
          <View style={styles.cardItemWrapper}>
            <AccountBalanceCard
              account={item}
              onPress={() => navigation.navigate('AccountDetail', { accountNumber: item.accountNumber })}
              onTransfer={(accountNumber) => navigation.navigate('Transfers', { sourceAccountNumber: accountNumber })}
              onViewStatements={(accountNumber) => navigation.navigate('Statements', { accountNumber })}
              onViewLedger={(accountNumber) => navigation.navigate('Transactions', { accountNumber })}
            />
          </View>
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.flatListContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      />
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dominant,
  },
  flatListContent: {
    padding: spacing.lg,
  },
  headerArea: {
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.accent,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  openAccountHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: spacing.borderRadius.full,
  },
  openAccountBtnText: {
    color: colors.dominant,
    fontSize: 12,
    fontWeight: '700',
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryLeft: {
    flex: 1,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryAmount: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  ratesPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  ratesPillText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  cardItemWrapper: {
    marginBottom: spacing.md,
  },
  footerPromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  promoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  promoTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  promoTitle: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  promoDesc: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  promoActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hardenedEmptyCard: {
    backgroundColor: '#F8FAFC',
    padding: spacing.xl,
    borderRadius: spacing.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: spacing.xl,
  },
  warningIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  warningIconText: {
    fontSize: 28,
  },
  emptyCardTitle: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyCardDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  contactSupportBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: spacing.borderRadius.md,
    width: '100%',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  contactSupportText: {
    color: colors.dominant,
    fontSize: 14,
    fontWeight: '700',
  },
});
