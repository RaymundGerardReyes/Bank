import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { Statement } from '../../models/Statement';
import { useGetStatementsQuery } from '../../state/api/statementApi';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatDate } from '../../utils/formatters';

// --- Enterprise Skeleton Loader ---
const SkeletonStatementCard = () => (
  <View style={styles.statementCard}>
    <View style={styles.cardLeft}>
      <View style={[styles.iconBg, { backgroundColor: colors.surfaceAlt, borderColor: 'transparent' }]} />
      <View style={{ gap: 6 }}>
        <View style={{ width: 120, height: 16, backgroundColor: colors.surfaceAlt, borderRadius: 4 }} />
        <View style={{ width: 80, height: 12, backgroundColor: colors.divider, borderRadius: 4 }} />
      </View>
    </View>
    <View style={{ width: 70, height: 24, backgroundColor: colors.surfaceAlt, borderRadius: 12 }} />
  </View>
);

export const StatementListScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const accountNumber = route.params?.accountNumber || 'ACCT-100200';

  const { data, isLoading } = useGetStatementsQuery(accountNumber);

  // STRICTLY LIVE DATA: We removed the mock array fallback here.
  const statements: Statement[] = data?.data || [];

  const navigateToViewer = (statement: Statement) => {
    navigation.navigate('StatementViewer', { statement });
  };

  const renderItem = ({ item }: { item: Statement }) => {
    // Gracefully handle dates from the backend
    const periodName = item.statementPeriod || formatDate(item.startDate || item.generatedAt);

    return (
      <TouchableOpacity
        style={styles.statementCard}
        activeOpacity={0.7}
        onPress={() => navigateToViewer(item)}
      >
        <View style={styles.cardLeft}>
          <View style={styles.iconBg}>
            <Ionicons name="document-text-outline" size={22} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.periodText}>{periodName}</Text>
            <Text style={styles.dateText}>
              Generated: {formatDate(item.generatedAt)}
            </Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.viewText}>View PDF</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account Statements</Text>
        <Text style={styles.subtitle}>Select a month to view the official PDF document.</Text>
      </View>

      <FlatList
        data={statements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <View style={{ marginTop: spacing.md }}>
              <SkeletonStatementCard />
              <SkeletonStatementCard />
              <SkeletonStatementCard />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="file-tray-outline" size={36} color={colors.textSecondary} />
              </View>
              <Text style={styles.emptyTitle}>No Statements Available</Text>
              <Text style={styles.emptyText}>
                Official account statements are generated at the end of each billing cycle. Check back later.
              </Text>
            </View>
          )
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
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  statementCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  dateText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  cardRight: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: spacing.borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 20,
  },
});