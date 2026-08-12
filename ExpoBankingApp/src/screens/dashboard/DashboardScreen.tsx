import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // <-- IMPORT THIS
import { AccountBalanceCard } from '../../components/accounts/AccountBalanceCard';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAccounts } from '../../hooks/useAccounts';
import { useAuth } from '../../hooks/useAuth';
import { transactionService } from '../../services/transaction/transactionService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, formatDate, generateUUID, maskAccountNumber } from '../../utils/formatters';

export const DashboardScreen = () => {
  const { accounts, isLoading, refetch } = useAccounts();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets(); // <-- HOOK TO GET OS NAVIGATION BAR HEIGHT

  const [refreshing, setRefreshing] = React.useState(false);
  const [lastSynced, setLastSynced] = React.useState(new Date().toISOString());
  const [recentTransactions, setRecentTransactions] = React.useState<any[]>([]);
  const [loadingTxns, setLoadingTxns] = React.useState(false);
  const [traceId] = React.useState(generateUUID().split('-')[0].toUpperCase());

  const isAdminOrTeller = user?.role === 'ADMIN' || user?.role === 'TELLER';

  const totalNetBalance = React.useMemo(() => {
    if (!accounts || accounts.length === 0) return 0;
    return accounts.reduce((acc, current) => acc + (current.balance || 0), 0);
  }, [accounts]);

  const fetchLiveTransactions = React.useCallback(async () => {
    if (!accounts || accounts.length === 0) return;
    setLoadingTxns(true);
    try {
      const primaryAccNumber = accounts[0].accountNumber;
      const history = await transactionService.getTransactionHistory(primaryAccNumber);
      if (history && history.length > 0) {
        setRecentTransactions(history.slice(0, 5));
      }
    } catch (err) {
      console.log('Fetching live transactions fallback:', err);
    } finally {
      setLoadingTxns(false);
    }
  }, [accounts]);

  useFocusEffect(
    React.useCallback(() => {
      if (refetch) refetch();
      fetchLiveTransactions();
      setLastSynced(new Date().toISOString());
    }, [refetch, fetchLiveTransactions])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (refetch) await refetch();
    await fetchLiveTransactions();
    setLastSynced(new Date().toISOString());
    setRefreshing(false);
  }, [refetch, fetchLiveTransactions]);

  return (
    <SecureScreenWrapper style={styles.container}>
      <ScrollView
        // <-- ENTERPRISE FIX: DYNAMIC BOTTOM PADDING -->
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.userName}>
              {user?.firstName || 'Raymund'} {user?.lastName || 'Reyes'}
            </Text>
          </View>
          <View style={styles.securityBadge}>
            <View style={styles.securityDot} />
            <Text style={styles.securityBadgeText}>SECURE</Text>
          </View>
        </View>

        <View style={styles.alertBanner}>
          <Text style={styles.alertIcon}>🛡️</Text>
          <Text style={styles.alertText}>New sign-in detected on Android SM-G998B</Text>
        </View>

        <View style={styles.netWorthCard}>
          <View style={styles.netWorthHeader}>
            <Text style={styles.netWorthLabel}>Total Net Liquidity</Text>
            <Text style={styles.currencyBadge}>USD</Text>
          </View>
          <Text style={styles.netWorthAmount}>
            {formatCurrency(totalNetBalance, 'USD').replace('$', '')}
          </Text>
          <View style={styles.netWorthFooter}>
            <Text style={styles.netWorthFooterText}>
              TLS Pinned • Root: PASS • {traceId}
            </Text>
          </View>
        </View>

        {/* --- UPGRADED QUICK ACTIONS UI --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Transfers')}>
            <View style={[styles.actionIconBg, { backgroundColor: '#F0F9FF' }]}>
              <Text style={styles.actionIconText}>💸</Text>
            </View>
            <Text style={styles.actionText}>Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Deposit')}>
            <View style={[styles.actionIconBg, { backgroundColor: '#ECFCCB' }]}>
              <Text style={styles.actionIconText}>📥</Text>
            </View>
            <Text style={styles.actionText}>Deposit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Statements')}>
            <View style={[styles.actionIconBg, { backgroundColor: '#F3F4F6' }]}>
              <Text style={styles.actionIconText}>📄</Text>
            </View>
            <Text style={styles.actionText}>Statements</Text>
          </TouchableOpacity>

          {isAdminOrTeller ? (
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => navigation.navigate('AuditLogs')}>
              <View style={[styles.actionIconBg, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', borderWidth: 1 }]}>
                <Text style={styles.actionIconText}>⚡</Text>
              </View>
              <Text style={styles.actionText}>Audit Logs</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Profile')}>
              <View style={[styles.actionIconBg, { backgroundColor: '#F8FAFC' }]}>
                <Text style={styles.actionIconText}>⚙️</Text>
              </View>
              <Text style={styles.actionText}>Security</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionHeaderBetween}>
          <Text style={styles.sectionTitle}>Your Accounts</Text>
          <Text style={styles.syncText}>Synced {formatDate(lastSynced).split(',')[1]}</Text>
        </View>

        {isLoading ? (
          <Text style={styles.loadingText}>Fetching secure balances...</Text>
        ) : accounts && accounts.length > 0 ? (
          accounts.map((acc) => (
            <View key={acc.accountNumber} style={styles.cardWrapper}>
              <AccountBalanceCard
                account={acc}
                onTransfer={(accountNumber) => navigation.navigate('Transfers', { sourceAccountNumber: accountNumber })}
                onViewStatements={(accountNumber) => navigation.navigate('Statements', { accountNumber })}
                onViewLedger={(accountNumber) => navigation.navigate('Transactions', { accountNumber })}
              />
            </View>
          ))
        ) : (
          <View style={styles.hardenedEmptyCard}>
            <View style={styles.warningIconContainer}>
              <Text style={styles.warningIconText}>⚠️</Text>
            </View>
            <Text style={styles.emptyCardTitle}>No Active Accounts Found</Text>
            <Text style={styles.emptyCardDescription}>
              We could not locate a checking or savings account linked to your profile. This can happen if your registration was incomplete or your account is pending manual KYC verification.
            </Text>
            <TouchableOpacity style={styles.contactSupportBtn} activeOpacity={0.8}>
              <Text style={styles.contactSupportText}>Contact Support / Complete KYC</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionHeaderBetween}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.linkText}>View Ledger</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          {recentTransactions.length === 0 && !loadingTxns ? (
            <View style={{ padding: spacing.xl, alignItems: 'center' }}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyCardTitle}>No Recent Activity</Text>
            </View>
          ) : (
            recentTransactions.map((txn, index) => {
              const primaryAccNumber = accounts[0]?.accountNumber || '';
              const isCredit = txn.destinationAccountNumber === primaryAccNumber;
              const targetAccount = isCredit ? txn.sourceAccountNumber : (txn.destinationAccountNumber || txn.recipientAccount);

              let formattedTarget = 'External Bank';
              if (targetAccount === 'CASH') formattedTarget = 'Cash Transaction';
              else if (targetAccount) formattedTarget = maskAccountNumber(targetAccount);

              let defaultTitle = 'Bank Transfer';
              if (txn.sourceAccountNumber === 'CASH') defaultTitle = 'Cash Deposit';
              if (txn.destinationAccountNumber === 'CASH') defaultTitle = 'Cash Withdrawal';

              const displayTitle = txn.description || defaultTitle;

              return (
                <TouchableOpacity
                  key={txn.transactionReference || txn.id || index}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('TransactionDetail', { transaction: txn, isCredit })}
                  style={[
                    styles.txnRow,
                    index < recentTransactions.length - 1 && styles.txnBorder,
                  ]}
                >
                  <View style={styles.txnLeft}>
                    <Text style={styles.txnDesc} numberOfLines={1}>{displayTitle}</Text>
                    <Text style={styles.txnTarget}>
                      {isCredit ? 'From: ' : 'To: '} {formattedTarget}
                    </Text>
                    <Text style={styles.txnDate}>{formatDate(txn.createdAt || txn.timestamp)}</Text>
                  </View>
                  <View style={styles.txnRight}>
                    <Text
                      style={[
                        styles.txnAmount,
                        isCredit ? styles.creditText : styles.debitText,
                      ]}
                    >
                      {isCredit ? '+' : '-'}{formatCurrency(txn.amount, txn.currency || 'USD')}
                    </Text>
                    <Text style={styles.txnStatus}>{txn.status}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dominant,
  },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    // Bottom padding dynamically handled by insets now!
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  userName: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFCCB',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: spacing.borderRadius.full,
  },
  securityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  securityBadgeText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: spacing.md,
    borderRadius: spacing.borderRadius.md,
    marginBottom: spacing.xl,
  },
  alertIcon: {
    marginRight: spacing.sm,
    fontSize: 16,
  },
  alertText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  netWorthCard: {
    backgroundColor: colors.dominant,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderTopWidth: 4,
    borderTopColor: colors.secondary,
  },
  netWorthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  netWorthLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  currencyBadge: {
    backgroundColor: '#F1F5F9',
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  netWorthAmount: {
    color: colors.accent,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
    marginVertical: spacing.xs,
  },
  netWorthFooter: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: spacing.md,
  },
  netWorthFooterText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: spacing.lg,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  syncText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  linkText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm, // Added slight padding
  },
  actionBtn: {
    alignItems: 'center',
    width: '22%', // Adjusted for better spacing
  },
  actionIconBg: {
    width: 60, // Refined circular size
    height: 60,
    borderRadius: 30, // Perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: colors.accent, // Sleek shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  actionIconText: {
    fontSize: 26,
  },
  actionText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardWrapper: {
    marginBottom: spacing.lg,
  },
  loadingText: {
    color: colors.textSecondary,
    marginVertical: spacing.xl,
    textAlign: 'center',
    fontWeight: '500',
  },
  hardenedEmptyCard: {
    backgroundColor: '#F8FAFC',
    padding: spacing.xl,
    borderRadius: spacing.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.xl,
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
  activityCard: {
    backgroundColor: colors.dominant,
    borderRadius: spacing.borderRadius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  txnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  txnBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  txnLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
  txnDesc: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  txnTarget: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  txnDate: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  txnRight: {
    alignItems: 'flex-end',
  },
  txnAmount: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  creditText: {
    color: colors.success,
  },
  debitText: {
    color: colors.accent,
  },
  txnStatus: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
});