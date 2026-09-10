import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useGetAccountByNumberQuery } from '../../state/api/accountApi';
import { transactionService } from '../../services/transaction/transactionService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, formatDate, maskAccountNumber } from '../../utils/formatters';

export const AccountDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { accountNumber } = route.params || {};

  const { data: accountResp, isLoading, isError, refetch } = useGetAccountByNumberQuery(accountNumber, {
    skip: !accountNumber,
  });
  const account = accountResp?.data;

  const [isNumberRevealed, setIsNumberRevealed] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [loadingTxns, setLoadingTxns] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchTransactions = React.useCallback(async () => {
    if (!accountNumber) return;
    setLoadingTxns(true);
    try {
      const history = await transactionService.getTransactionHistory(accountNumber);
      if (history) {
        setTransactions(history.slice(0, 10));
      }
    } catch {
      // Fallback gracefully
    } finally {
      setLoadingTxns(false);
    }
  }, [accountNumber]);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await fetchTransactions();
    setRefreshing(false);
  };

  const copyToClipboard = async () => {
    if (!account?.accountNumber) return;
    try {
      await Clipboard.setStringAsync(account.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      Alert.alert('Copied', `Account number: ${account.accountNumber}`);
    }
  };

  const isActive = account?.status === 'ACTIVE';

  if (isLoading) {
    return (
      <SecureScreenWrapper style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading account details...</Text>
      </SecureScreenWrapper>
    );
  }

  if (isError || !account) {
    return (
      <SecureScreenWrapper style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={56} color={colors.danger} />
        <Text style={styles.errorTitle}>Account Not Found</Text>
        <Text style={styles.errorSubtitle}>Unable to load details for account #{accountNumber}.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SecureScreenWrapper>
    );
  }

  return (
    <SecureScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {/* Top Hero Account Card */}
        <View style={styles.heroCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.accountType}>{account.accountType} ACCOUNT</Text>
              <Text style={styles.accountSub}>NovaBank Enterprise</Text>
            </View>
            <View style={[styles.statusBadge, isActive ? styles.badgeActive : styles.badgeFrozen]}>
              <View style={[styles.statusDot, isActive ? styles.dotActive : styles.dotFrozen]} />
              <Text style={[styles.statusText, isActive ? styles.textActive : styles.textFrozen]}>
                {account.status}
              </Text>
            </View>
          </View>

          {/* Account Number with Eye & Copy */}
          <View style={styles.accountNumberRow}>
            <Text style={styles.accountNumberText}>
              {isNumberRevealed ? account.accountNumber : maskAccountNumber(account.accountNumber)}
            </Text>
            <View style={styles.accActionButtons}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => setIsNumberRevealed(!isNumberRevealed)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={isNumberRevealed ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.accent}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={copyToClipboard}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={copied ? 'checkmark-circle-outline' : 'copy-outline'}
                  size={18}
                  color={copied ? colors.success : colors.accent}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance Breakdown */}
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>
              {formatCurrency(account.balance, account.currency || 'USD')}
            </Text>
            <View style={styles.balanceMetaRow}>
              <Text style={styles.balanceMetaText}>Current Ledger Balance:</Text>
              <Text style={styles.balanceMetaValue}>
                {formatCurrency(account.balance, account.currency || 'USD')}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Inactivity Warning */}
        {!isActive && (
          <View style={styles.frozenAlert}>
            <Ionicons name="warning-outline" size={20} color={colors.danger} style={{ marginRight: 8 }} />
            <Text style={styles.frozenText}>
              This account is currently {account.status.toLowerCase()}. Outbound transfers are paused.
            </Text>
          </View>
        )}

        {/* Quick Actions Row */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, !isActive && styles.actionDisabled]}
            disabled={!isActive}
            onPress={() => navigation.navigate('Transfers', { sourceAccountNumber: account.accountNumber })}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#F0F9FF' }]}>
              <Ionicons name="swap-horizontal" size={22} color={colors.accent} />
            </View>
            <Text style={styles.actionLabel}>Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Deposit', { targetAccountNumber: account.accountNumber })}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#ECFCCB' }]}>
              <Ionicons name="arrow-down" size={22} color={colors.success} />
            </View>
            <Text style={styles.actionLabel}>Deposit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, !isActive && styles.actionDisabled]}
            disabled={!isActive}
            onPress={() => navigation.navigate('Withdraw', { sourceAccountNumber: account.accountNumber })}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="arrow-up" size={22} color={colors.warning} />
            </View>
            <Text style={styles.actionLabel}>Withdraw</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Statements', { accountNumber: account.accountNumber })}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="document-text-outline" size={22} color={colors.accent} />
            </View>
            <Text style={styles.actionLabel}>Statements</Text>
          </TouchableOpacity>
        </View>

        {/* Account Details & Limits Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardSectionTitle}>Account Information</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Routing Number (ACH/Wire)</Text>
            <Text style={styles.detailValue}>021000021</Text>
          </View>
          <View style={styles.rowDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Daily Outbound Transfer Limit</Text>
            <Text style={styles.detailValue}>$10,000.00</Text>
          </View>
          <View style={styles.rowDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Daily ATM Withdrawal Limit</Text>
            <Text style={styles.detailValue}>$1,500.00</Text>
          </View>
          <View style={styles.rowDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Interest Rate / APY</Text>
            <Text style={[styles.detailValue, { color: colors.success }]}>
              {account.accountType === 'SAVINGS' ? '4.50% APY' : '0.05% APY'}
            </Text>
          </View>
          <View style={styles.rowDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Created</Text>
            <Text style={styles.detailValue}>
              {account.createdAt ? formatDate(account.createdAt).split(',')[0] : 'Standard Member'}
            </Text>
          </View>
        </View>

        {/* Recent Transactions Section */}
        <View style={styles.sectionHeaderBetween}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Transactions', { accountNumber: account.accountNumber })}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsCard}>
          {loadingTxns ? (
            <View style={styles.loadingTxnsBox}>
              <ActivityIndicator size="small" color={colors.accent} />
              <Text style={styles.loadingTxnsText}>Loading ledger activity...</Text>
            </View>
          ) : transactions.length === 0 ? (
            <View style={styles.emptyTxnBox}>
              <Ionicons name="receipt-outline" size={36} color={colors.textMuted} />
              <Text style={styles.emptyTxnTitle}>No Transactions Yet</Text>
              <Text style={styles.emptyTxnDesc}>Transactions on this account will appear here.</Text>
            </View>
          ) : (
            transactions.map((txn, index) => {
              const isCredit = txn.destinationAccountNumber === account.accountNumber;
              const title =
                txn.description ||
                (txn.sourceAccountNumber === 'CASH'
                  ? 'Cash Deposit'
                  : txn.destinationAccountNumber === 'CASH'
                  ? 'Cash Withdrawal'
                  : isCredit
                  ? 'Transfer Received'
                  : 'Transfer Sent');

              return (
                <TouchableOpacity
                  key={txn.transactionReference || txn.id || index}
                  style={[styles.txnRow, index < transactions.length - 1 && styles.txnBorder]}
                  onPress={() => navigation.navigate('TransactionDetail', { transaction: txn, isCredit })}
                  activeOpacity={0.7}
                >
                  <View style={[styles.txnIconBg, isCredit ? styles.iconCredit : styles.iconDebit]}>
                    <Ionicons
                      name={isCredit ? 'arrow-down' : 'arrow-up'}
                      size={16}
                      color={isCredit ? colors.success : colors.accent}
                    />
                  </View>
                  <View style={styles.txnCenter}>
                    <Text style={styles.txnTitle} numberOfLines={1}>
                      {title}
                    </Text>
                    <Text style={styles.txnDate}>
                      {formatDate(txn.createdAt || txn.timestamp)}
                    </Text>
                  </View>
                  <View style={styles.txnRight}>
                    <Text style={[styles.txnAmount, isCredit ? styles.creditAmount : styles.debitAmount]}>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.dominant,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  errorTitle: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  errorSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: spacing.borderRadius.md,
  },
  retryText: {
    color: colors.dominant,
    fontWeight: '700',
    fontSize: 14,
  },
  heroCard: {
    backgroundColor: colors.accent,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  accountType: {
    color: colors.dominant,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  accountSub: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: spacing.borderRadius.full,
  },
  badgeActive: {
    backgroundColor: 'rgba(22, 163, 74, 0.2)',
    borderWidth: 1,
    borderColor: '#4ADE80',
  },
  badgeFrozen: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderWidth: 1,
    borderColor: '#F87171',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  dotActive: {
    backgroundColor: '#4ADE80',
  },
  dotFrozen: {
    backgroundColor: '#F87171',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  textActive: {
    color: '#4ADE80',
  },
  textFrozen: {
    color: '#F87171',
  },
  accountNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    marginBottom: spacing.lg,
  },
  accountNumberText: {
    color: colors.dominant,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    fontFamily: 'monospace',
  },
  accActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 6,
    borderRadius: 6,
  },
  balanceSection: {
    marginTop: spacing.xs,
  },
  balanceLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    color: colors.dominant,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginVertical: 4,
  },
  balanceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  balanceMetaText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  balanceMetaValue: {
    color: colors.dominant,
    fontSize: 12,
    fontWeight: '700',
  },
  frozenAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  frozenText: {
    flex: 1,
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
    width: '22%',
  },
  actionDisabled: {
    opacity: 0.4,
  },
  actionIconBg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  actionLabel: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.xl,
  },
  cardSectionTitle: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  detailValue: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  viewAllText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '700',
  },
  transactionsCard: {
    backgroundColor: colors.dominant,
    borderRadius: spacing.borderRadius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loadingTxnsBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: 8,
  },
  loadingTxnsText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  emptyTxnBox: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyTxnTitle: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  emptyTxnDesc: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  txnBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  txnIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconCredit: {
    backgroundColor: '#ECFCCB',
  },
  iconDebit: {
    backgroundColor: '#F0F9FF',
  },
  txnCenter: {
    flex: 1,
    paddingRight: 8,
  },
  txnTitle: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  txnDate: {
    color: colors.textMuted,
    fontSize: 11,
  },
  txnRight: {
    alignItems: 'flex-end',
  },
  txnAmount: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  creditAmount: {
    color: colors.success,
  },
  debitAmount: {
    color: colors.accent,
  },
  txnStatus: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
