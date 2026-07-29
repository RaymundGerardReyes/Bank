import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useTransactions } from '../../hooks/useTransactions';
import { Transaction } from '../../models/Transaction';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, formatDate, maskAccountNumber } from '../../utils/formatters';

export const TransactionHistoryScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const accountNumber = route.params?.accountNumber || 'ACCT-100200';
  const { transactions, isLoading, refetch } = useTransactions(accountNumber);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (refetch) await refetch();
    setRefreshing(false);
  }, [refetch]);

  const navigateToDetail = (transaction: Transaction) => {
    navigation.navigate('TransactionDetail', { transaction });
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    // 1. Safe Directional Logic without relying on undefined 'type'
    const isCredit = item.destinationAccountNumber === accountNumber;

    // 2. Format the opposing target account
    const targetAccount = isCredit ? item.sourceAccountNumber : (item.destinationAccountNumber || (item as any).recipientAccount);
    let formattedTarget = 'External Bank';
    if (targetAccount === 'CASH') formattedTarget = 'Cash Transaction';
    else if (targetAccount) formattedTarget = maskAccountNumber(targetAccount);

    // 3. Safe fallback description
    let defaultTitle = 'Bank Transfer';
    if (item.sourceAccountNumber === 'CASH') defaultTitle = 'Cash Deposit';
    if (item.destinationAccountNumber === 'CASH') defaultTitle = 'Cash Withdrawal';
    const displayTitle = item.description || defaultTitle;

    return (
      <TouchableOpacity
        style={styles.txnCard}
        activeOpacity={0.7}
        onPress={() => navigateToDetail(item)}
      >
        <View style={styles.txnLeft}>
          <View style={[styles.iconBg, isCredit ? styles.iconBgCredit : styles.iconBgDebit]}>
            <Text style={styles.iconText}>{isCredit ? '↓' : '↑'}</Text>
          </View>
          <View>
            <Text style={styles.txnDesc} numberOfLines={1}>{displayTitle}</Text>
            <Text style={styles.txnTarget}>{isCredit ? 'From: ' : 'To: '} {formattedTarget}</Text>
            <Text style={styles.txnDate}>{formatDate(item.timestamp || (item as any).createdAt)}</Text>
          </View>
        </View>
        <View style={styles.txnRight}>
          <Text style={[styles.txnAmount, isCredit ? styles.creditText : styles.debitText]}>
            {isCredit ? '+' : '-'}{formatCurrency(item.amount, item.currency || 'USD')}
          </Text>
          <Text style={styles.txnStatus}>{item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account History</Text>
        <Text style={styles.subtitle}>Showing ledger for {maskAccountNumber(accountNumber)}</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.transactionId || item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>No Transactions Found</Text>
              <Text style={styles.emptyText}>Your ledger history for this account is completely clear.</Text>
            </View>
          ) : null
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
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
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
    marginTop: 4,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  txnCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.dominant,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  txnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: spacing.sm,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconBgCredit: {
    backgroundColor: '#ECFCCB',
  },
  iconBgDebit: {
    backgroundColor: '#F0F8FF',
  },
  iconText: {
    fontSize: 16,
  },
  txnDesc: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  txnTarget: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  txnDate: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  txnRight: {
    alignItems: 'flex-end',
  },
  txnAmount: {
    fontSize: 15,
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
    fontWeight: '800',
  },
  // Upgraded Empty State Styles mapped perfectly to Notifications
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});