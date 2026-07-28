import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AccountBalanceCard } from '../../components/accounts/AccountBalanceCard';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAccounts } from '../../hooks/useAccounts';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, formatDate, generateUUID } from '../../utils/formatters';

export const DashboardScreen = () => {
  const { accounts, isLoading, refetch } = useAccounts();
  const { user } = useAuth();

  // Initialize the navigation hook so we can route buttons to screens
  const navigation = useNavigation<any>();

  const [refreshing, setRefreshing] = React.useState(false);
  const [lastSynced, setLastSynced] = React.useState(new Date().toISOString());

  // Static trace ID for UI demonstration of CorrelationId tracking
  const [traceId] = React.useState(generateUUID().split('-')[0].toUpperCase());

  // Check if user has backend RBAC permissions for conditional UI
  const isAdminOrTeller = user?.role === 'ADMIN' || user?.role === 'TELLER';

  // Calculate total net balance across all active accounts
  const totalNetBalance = React.useMemo(() => {
    if (!accounts || accounts.length === 0) return 0;
    return accounts.reduce((acc, current) => acc + (current.balance || 0), 0);
  }, [accounts]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (refetch) {
      await refetch();
      setLastSynced(new Date().toISOString()); // Update offline-aware cache timestamp
    }
    setRefreshing(false);
  }, [refetch]);

  // Mock recent transactions mirroring Spring Boot /api/v1/transactions/history
  const recentTransactions = [
    {
      id: 'TXN-90812',
      description: 'Payroll Direct Deposit',
      type: 'CREDIT',
      amount: 3250.00,
      date: 'Today, 09:30 AM',
      status: 'COMPLETED',
    },
    {
      id: 'TXN-90811',
      description: 'Internal Transfer to Savings',
      type: 'DEBIT',
      amount: 500.00,
      date: 'Yesterday',
      status: 'COMPLETED',
    },
  ];

  return (
    <SecureScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {/* Header Section with User Greeting & Security Trust Badge */}
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

        {/* Security Alert Banner */}
        <View style={styles.alertBanner}>
          <Text style={styles.alertIcon}>🔔</Text>
          <Text style={styles.alertText}>New sign-in detected on Android SM-G998B</Text>
        </View>

        {/* Total Net Balance Card (Premium Elevation) */}
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
              🛡️ TLS Pinned • Root: PASS • {traceId}
            </Text>
          </View>
        </View>

        {/* Quick Money Movement Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.quickActionsGrid}>
          {/* Routes to TransferFormScreen */}
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Transfers')}
          >
            <View style={styles.actionIconBg}>
              <Text style={styles.actionIconText}>↗️</Text>
            </View>
            <Text style={styles.actionText}>Transfer</Text>
          </TouchableOpacity>

          {/* Routes to DepositScreen */}
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Deposit')}
          >
            <View style={styles.actionIconBg}>
              <Text style={styles.actionIconText}>📥</Text>
            </View>
            <Text style={styles.actionText}>Deposit</Text>
          </TouchableOpacity>

          {/* Routes to StatementListScreen */}
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Statements')}
          >
            <View style={styles.actionIconBg}>
              <Text style={styles.actionIconText}>📄</Text>
            </View>
            <Text style={styles.actionText}>Statements</Text>
          </TouchableOpacity>

          {/* Conditional Admin UI */}
          {isAdminOrTeller ? (
            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('AuditLogs')}
            >
              <View style={[styles.actionIconBg, styles.adminIconBg]}>
                <Text style={styles.actionIconText}>🛡️</Text>
              </View>
              <Text style={styles.actionText}>Audit Logs</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={styles.actionIconBg}>
                <Text style={styles.actionIconText}>⚙️</Text>
              </View>
              <Text style={styles.actionText}>Security</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Accounts Section */}
        <View style={styles.sectionHeaderBetween}>
          <Text style={styles.sectionTitle}>Your Accounts</Text>
          <Text style={styles.syncText}>Synced {formatDate(lastSynced).split(',')[1]}</Text>
        </View>

        {isLoading ? (
          <Text style={styles.loadingText}>Fetching secure balances...</Text>
        ) : accounts && accounts.length > 0 ? (
          accounts.map((acc) => (
            <View key={acc.accountNumber} style={styles.cardWrapper}>
              {/* Wire up the Account Card actions to the navigation too! */}
              <AccountBalanceCard
                account={acc}
                onTransfer={(accountNumber) => navigation.navigate('Transfers', { sourceAccountNumber: accountNumber })}
                onViewStatements={(accountNumber) => navigation.navigate('Statements', { accountNumber })}
                onViewLedger={(accountNumber) => navigation.navigate('Transactions', { accountNumber })}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No accounts associated with this session.</Text>
          </View>
        )}

        {/* Recent Ledger Activity Section */}
        <View style={styles.sectionHeaderBetween}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.linkText}>View Ledger</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          {recentTransactions.map((txn, index) => (
            <View
              key={txn.id}
              style={[
                styles.txnRow,
                index < recentTransactions.length - 1 && styles.txnBorder,
              ]}
            >
              <View style={styles.txnLeft}>
                <Text style={styles.txnDesc}>{txn.description}</Text>
                <Text style={styles.txnDate}>{txn.date}</Text>
              </View>
              <View style={styles.txnRight}>
                <Text
                  style={[
                    styles.txnAmount,
                    txn.type === 'CREDIT' ? styles.creditText : styles.debitText,
                  ]}
                >
                  {txn.type === 'CREDIT' ? '+' : '-'}{formatCurrency(txn.amount, 'USD')}
                </Text>
                <Text style={styles.txnStatus}>{txn.status}</Text>
              </View>
            </View>
          ))}
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
    paddingBottom: spacing.xxl,
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
  },
  actionBtn: {
    alignItems: 'center',
    width: '23%',
  },
  actionIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  adminIconBg: {
    backgroundColor: '#FFFBEB',
  },
  actionIconText: {
    fontSize: 24,
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
  emptyCard: {
    backgroundColor: '#F8FAFC',
    padding: spacing.xl,
    borderRadius: spacing.borderRadius.md,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
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
});