import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccountBalanceCard } from '../../components/accounts/AccountBalanceCard';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { SectionHeader } from '../../components/common/SectionHeader';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAccounts } from '../../hooks/useAccounts';
import { DEFAULT_RATES_TO_PHP, fxService } from '../../services/fx/fxService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency } from '../../utils/formatters';

export const AccountListScreen = () => {
  const { accounts, refetch } = useAccounts();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);
  const [ratesToPhp, setRatesToPhp] = React.useState<Record<string, number>>(DEFAULT_RATES_TO_PHP);

  const refreshRates = React.useCallback(async () => {
    try {
      const res = await fxService.getRates('PHP');
      if (res?.ratesToPhp) setRatesToPhp(res.ratesToPhp);
    } catch (err) {
      console.log('Fetching FX rates fallback:', err);
    }
  }, []);

  React.useEffect(() => {
    refreshRates();
  }, [refreshRates]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch?.();
    await refreshRates();
    setRefreshing(false);
  };

  const balancesByCurrency = React.useMemo(() => {
    const map: Record<string, number> = {};
    (accounts || []).forEach((acc) => {
      const currency = acc.currency || 'USD';
      map[currency] = (map[currency] || 0) + (acc.balance || 0);
    });
    return map;
  }, [accounts]);

  const currencyEntries = React.useMemo(() => Object.entries(balancesByCurrency), [balancesByCurrency]);

  const totalNetLiquidityInPhp = React.useMemo(() => {
    return (accounts || []).reduce((sum, acc) => {
      const currency = acc.currency || 'PHP';
      return sum + fxService.convertAmountToPhp(acc.balance || 0, currency, ratesToPhp);
    }, 0);
  }, [accounts, ratesToPhp]);

  const renderHeader = () => (
    <View style={styles.headerArea}>
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Accounts</Text>
          <Text style={styles.subtitle}>
            {accounts?.length || 0} active {accounts?.length === 1 ? 'account' : 'accounts'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('OpenAccount')}
          activeOpacity={0.82}
          accessibilityRole="button"
          accessibilityLabel="Open account"
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {accounts && accounts.length > 0 ? (
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total balance</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(totalNetLiquidityInPhp, 'PHP')}</Text>
          <View style={styles.currencySummary}>
            {currencyEntries.map(([currency, amount]: [string, number]) => {
              const phpEquiv = fxService.convertAmountToPhp(amount, currency, ratesToPhp);
              const isPhp = currency === 'PHP';
              return (
                <View key={currency} style={styles.currencyRow}>
                  <Text style={styles.currencyTag}>{currency}</Text>
                  <Text style={styles.currencyValue} numberOfLines={1}>
                    {formatCurrency(amount, currency)}
                    {!isPhp ? ` (${formatCurrency(phpEquiv, 'PHP')})` : ''}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      ) : null}

      <SectionHeader title="Account Portfolio" />
    </View>
  );

  const renderFooter = () =>
    accounts && accounts.length > 0 ? (
      <Card style={styles.footerCard}>
        <View style={styles.footerIcon}>
          <Ionicons name="briefcase-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.footerText}>
          <Text style={styles.footerTitle}>Product options</Text>
          <Text style={styles.footerCopy}>Review available account types before opening another account.</Text>
        </View>
        <Button title="View" onPress={() => navigation.navigate('ProductCatalog')} variant="secondary" />
      </Card>
    ) : null;

  const renderEmptyState = () => (
    <EmptyState
      icon="wallet-outline"
      title="No accounts found"
      message="Open an account or complete verification to start using NovaBank."
      actionLabel="Open account"
      onActionPress={() => navigation.navigate('OpenAccount')}
    />
  );

  return (
    <SecureScreenWrapper style={styles.container}>
      <FlatList
        data={accounts || []}
        keyExtractor={(item) => item.accountNumber}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
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
          { paddingBottom: insets.bottom + 88 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      />
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flatListContent: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
  },
  headerArea: {
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleBlock: {
    flex: 1,
    paddingRight: spacing.md,
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
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  summaryAmount: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.hero,
    lineHeight: typography.lineHeight.hero,
    fontWeight: typography.fontWeight.heavy,
    marginTop: spacing.xs,
  },
  currencySummary: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  currencyTag: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.heavy,
  },
  currencyValue: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    textAlign: 'right',
  },
  cardItemWrapper: {
    marginBottom: spacing.md,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  footerIcon: {
    width: 44,
    height: 44,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    flex: 1,
  },
  footerTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  footerCopy: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    marginTop: spacing.xs,
  },
});
