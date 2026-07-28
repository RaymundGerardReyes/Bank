import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useTransactions } from '../../hooks/useTransactions';
import { Transaction } from '../../models/Transaction';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const TransactionHistoryScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  // Dynamically pull account number from route, fallback to a default if testing standalone
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
    const isCredit = item.type === 'DEPOSIT';
    return (
      <TouchableOpacity
        style={styles.txnCard}
        activeOpacity={0.7}
        onPress={() => navigateToDetail(item)}
      >
        <View style={styles.txnLeft}>
          <View style={[styles.iconBg, isCredit ? styles.iconBgCredit : styles.iconBgDebit]}>
            <Text style={styles.iconText}>{isCredit ? '📥' : '↗️'}</Text>
          </View>
          <View>
            <Text style={styles.txnDesc} numberOfLines={1}>{item.description || item.type}</Text>
            <Text style={styles.txnDate}>{formatDate(item.timestamp)}</Text>
          </View>
        </View>
        <View style={styles.txnRight}>
          <Text style={[styles.txnAmount, isCredit ? styles.creditText : styles.debitText]}>
            {isCredit ? '+' : '-'}{formatCurrency(item.amount, item.currency)}
          </Text>
          <Text style={styles.txnStatus}>{item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ledger Feed</Text>
        <Text style={styles.subtitle}>Showing history for {accountNumber}</Text>
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
              <Text style={styles.emptyText}>No transactions found for this account.</Text>
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
    backgroundColor: colors.dominant, // 60% White
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary, // 30% Soft Blue structure
  },
  title: {
    color: colors.accent, // 10% Deep Navy
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
    borderBottomColor: '#F1F5F9', // Very soft divider
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
    backgroundColor: '#ECFCCB', // Soft green tint
  },
  iconBgDebit: {
    backgroundColor: '#F0F8FF', // Soft blue tint
  },
  iconText: {
    fontSize: 16,
  },
  txnDesc: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  txnDate: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  txnRight: {
    alignItems: 'flex-end',
  },
  txnAmount: {
    fontSize: 15,
    fontWeight: '800',
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
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});