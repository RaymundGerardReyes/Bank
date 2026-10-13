import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccountBalanceCard } from '../../components/accounts/AccountBalanceCard';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { SectionHeader } from '../../components/common/SectionHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAccounts } from '../../hooks/useAccounts';
import { useAuth } from '../../hooks/useAuth';
import { DEFAULT_RATES_TO_PHP, fxService } from '../../services/fx/fxService';
import { transactionService } from '../../services/transaction/transactionService';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency, formatDate, generateUUID, maskAccountNumber } from '../../utils/formatters';

type QuickAction = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  params?: Record<string, unknown>;
};

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Scan', icon: 'qr-code-outline', route: 'QrScanner' },
  { label: 'Transfer', icon: 'swap-horizontal-outline', route: 'Transfers' },
  { label: 'Wire', icon: 'globe-outline', route: 'ExternalPayment' },
  { label: 'Deposit', icon: 'arrow-down-circle-outline', route: 'Deposit' },
  { label: 'Withdraw', icon: 'arrow-up-circle-outline', route: 'Withdraw' },
  { label: 'Open', icon: 'add-circle-outline', route: 'OpenAccount' },
  { label: 'Statements', icon: 'document-text-outline', route: 'Statements' },
];

export const DashboardScreen = () => {
  const { accounts, isLoading, refetch } = useAccounts();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [refreshing, setRefreshing] = React.useState(false);
  const [lastSynced, setLastSynced] = React.useState(new Date().toISOString());
  const [recentTransactions, setRecentTransactions] = React.useState<any[]>([]);
  const [loadingTxns, setLoadingTxns] = React.useState(false);
  const [traceId] = React.useState(generateUUID().split('-')[0].toUpperCase());
  const [ratesToPhp, setRatesToPhp] = React.useState<Record<string, number>>(DEFAULT_RATES_TO_PHP);

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

  const primaryAccountNumber = accounts?.[0]?.accountNumber;

  const fetchLiveTransactions = React.useCallback(async (accountNum?: string) => {
    const target = accountNum || primaryAccountNumber;
    if (!target) return;
    setLoadingTxns(true);
    try {
      const history = await transactionService.getTransactionHistory(target);
      setRecentTransactions((history || []).slice(0, 5));
    } catch (err: any) {
      if (err?.response?.status === 403) {
        console.log(`[Dashboard] Account ${target} not owned by active session. Refreshing accounts...`);
        refetch?.();
      } else {
        console.log('Fetching live transactions fallback:', err);
      }
    } finally {
      setLoadingTxns(false);
    }
  }, [primaryAccountNumber, refetch]);

  React.useEffect(() => {
    if (primaryAccountNumber) {
      fetchLiveTransactions(primaryAccountNumber);
    }
  }, [primaryAccountNumber, fetchLiveTransactions]);

  const fetchFxRates = React.useCallback(async () => {
    try {
      const res = await fxService.getRates('PHP');
      if (res?.ratesToPhp) setRatesToPhp(res.ratesToPhp);
    } catch (err) {
      console.log('Fetching FX rates fallback:', err);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refetch?.();
      fetchFxRates();
    }, [refetch, fetchFxRates])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.allSettled([
      refetch?.(),
      fetchLiveTransactions(primaryAccountNumber),
      fetchFxRates(),
    ]);
    setLastSynced(new Date().toISOString());
    setRefreshing(false);
  }, [refetch, fetchLiveTransactions, primaryAccountNumber, fetchFxRates]);

  return (
    <SecureScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 88 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Good morning</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.firstName || 'Raymund'} {user?.lastName || 'Reyes'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('QrScanner')}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel="Scan QR code"
          >
            <Ionicons name="qr-code-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Card style={styles.balancePanel}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.panelLabel}>Total balance</Text>
              <Text style={styles.balanceValue}>{formatCurrency(totalNetLiquidityInPhp, 'PHP')}</Text>
            </View>
            <StatusBadge label="Protected" tone="success" />
          </View>

          {currencyEntries.length > 0 ? (
            <View style={styles.currencyList}>
              {currencyEntries.map(([currency, amount]: [string, number]) => {
                const converted = fxService.convertAmountToPhp(amount, currency, ratesToPhp);
                const isPhp = currency === 'PHP';
                return (
                  <View key={currency} style={styles.currencyRow}>
                    <Text style={styles.currencyCode}>{currency}</Text>
                    <View style={styles.currencyAmounts}>
                      <Text style={styles.currencyNative}>{formatCurrency(amount, currency)}</Text>
                      {!isPhp ? (
                        <Text style={styles.currencyConverted}>{formatCurrency(converted, 'PHP')}</Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}

          <Text style={styles.balanceMeta}>
            Synced {formatDate(lastSynced)} - Ref {traceId}
          </Text>
        </Card>

        <SectionHeader title="Move Money" />
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionButton}
              onPress={() => navigation.navigate(action.route, action.params)}
              activeOpacity={0.82}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel} numberOfLines={1}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader
          title="Accounts"
          actionLabel={accounts && accounts.length > 0 ? 'All accounts' : undefined}
          onActionPress={() => navigation.navigate('Accounts')}
        />

        {isLoading ? (
          <Text style={styles.loadingText}>Loading accounts...</Text>
        ) : accounts && accounts.length > 0 ? (
          accounts.map((acc) => (
            <View key={acc.accountNumber} style={styles.accountCardWrap}>
              <AccountBalanceCard
                account={acc}
                onPress={() => navigation.navigate('AccountDetail', { accountNumber: acc.accountNumber })}
                onTransfer={(accountNumber) => navigation.navigate('Transfers', { sourceAccountNumber: accountNumber })}
                onViewStatements={(accountNumber) => navigation.navigate('Statements', { accountNumber })}
                onViewLedger={(accountNumber) => navigation.navigate('Transactions', { accountNumber })}
              />
            </View>
          ))
        ) : (
          <EmptyState
            icon="wallet-outline"
            title="No accounts yet"
            message="Open an account or complete verification to start banking in the app."
            actionLabel="Open account"
            onActionPress={() => navigation.navigate('OpenAccount')}
          />
        )}

        <SectionHeader
          title="Recent Activity"
          actionLabel="View ledger"
          onActionPress={() => navigation.navigate('Transactions')}
        />
        <Card style={styles.activityPanel}>
          {recentTransactions.length === 0 && !loadingTxns ? (
            <EmptyState
              icon="receipt-outline"
              title="No recent activity"
              message="New transactions will appear here after your accounts are used."
            />
          ) : (
            recentTransactions.map((txn, index) => {
              const primaryAccNumber = accounts?.[0]?.accountNumber || '';
              const isCredit = txn.destinationAccountNumber === primaryAccNumber;
              const targetAccount = isCredit ? txn.sourceAccountNumber : (txn.destinationAccountNumber || txn.recipientAccount);
              const formattedTarget =
                targetAccount === 'CASH'
                  ? 'Cash transaction'
                  : targetAccount
                    ? maskAccountNumber(targetAccount)
                    : 'External bank';
              const displayTitle =
                txn.description ||
                (txn.sourceAccountNumber === 'CASH'
                  ? 'Cash deposit'
                  : txn.destinationAccountNumber === 'CASH'
                    ? 'Cash withdrawal'
                    : 'Bank transfer');

              return (
                <TouchableOpacity
                  key={txn.transactionReference || txn.id || index}
                  activeOpacity={0.82}
                  onPress={() => navigation.navigate('TransactionDetail', { transaction: txn, isCredit })}
                  style={[styles.txnRow, index < recentTransactions.length - 1 && styles.txnDivider]}
                >
                  <View style={styles.txnIcon}>
                    <Ionicons
                      name={isCredit ? 'arrow-down-outline' : 'arrow-up-outline'}
                      size={18}
                      color={isCredit ? colors.success : colors.primary}
                    />
                  </View>
                  <View style={styles.txnBody}>
                    <Text style={styles.txnTitle} numberOfLines={1}>{displayTitle}</Text>
                    <Text style={styles.txnMeta} numberOfLines={1}>
                      {isCredit ? 'From ' : 'To '}{formattedTarget} - {formatDate(txn.createdAt || txn.timestamp)}
                    </Text>
                  </View>
                  <View style={styles.txnAmountBlock}>
                    <Text style={[styles.txnAmount, isCredit ? styles.creditText : styles.debitText]}>
                      {isCredit ? '+' : '-'}{formatCurrency(txn.amount, txn.currency || 'USD')}
                    </Text>
                    <Text style={styles.txnStatus}>{txn.status}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </Card>
      </ScrollView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  eyebrow: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
    fontWeight: typography.fontWeight.heavy,
    marginTop: spacing.xs,
  },
  headerIconButton: {
    width: 46,
    height: 46,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  balancePanel: {
    marginBottom: spacing.lg,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  panelLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  balanceValue: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.hero,
    lineHeight: typography.lineHeight.hero,
    fontWeight: typography.fontWeight.heavy,
    marginTop: spacing.xs,
  },
  currencyList: {
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
  currencyCode: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.heavy,
  },
  currencyAmounts: {
    flex: 1,
    alignItems: 'flex-end',
  },
  currencyNative: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  currencyConverted: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
  },
  balanceMeta: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    marginTop: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionButton: {
    width: '22.8%',
    minHeight: 80,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: spacing.borderRadius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actionLabel: {
    color: colors.textPrimary,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  accountCardWrap: {
    marginBottom: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    textAlign: 'center',
    marginVertical: spacing.xl,
  },
  activityPanel: {
    paddingVertical: 0,
    marginBottom: spacing.xl,
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  txnDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  txnIcon: {
    width: 38,
    height: 38,
    borderRadius: spacing.borderRadius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  txnBody: {
    flex: 1,
    paddingRight: spacing.md,
  },
  txnTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  txnMeta: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    marginTop: spacing.xs,
  },
  txnAmountBlock: {
    alignItems: 'flex-end',
    maxWidth: 132,
  },
  txnAmount: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.heavy,
    textAlign: 'right',
  },
  creditText: {
    color: colors.success,
  },
  debitText: {
    color: colors.textPrimary,
  },
  txnStatus: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    marginTop: spacing.xs,
    textTransform: 'capitalize',
  },
});
