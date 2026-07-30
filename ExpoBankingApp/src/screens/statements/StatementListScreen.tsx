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
      <View style={[styles.iconBg, { backgroundColor: `${colors.secondary}20`, borderColor: 'transparent' }]} />
      <View style={{ gap: 6 }}>
        <View style={{ width: 120, height: 16, backgroundColor: `${colors.secondary}20`, borderRadius: 4 }} />
        <View style={{ width: 80, height: 12, backgroundColor: `${colors.secondary}10`, borderRadius: 4 }} />
      </View>
    </View>
    <View style={{ width: 70, height: 24, backgroundColor: `${colors.secondary}20`, borderRadius: 12 }} />
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
            <Text style={styles.iconText}>📄</Text>
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
                <Text style={styles.emptyIcon}>🗄️</Text>
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
    backgroundColor: colors.dominant,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    color: colors.accent,
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
    borderColor: colors.secondary,
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
    backgroundColor: colors.dominant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  iconText: {
    fontSize: 20,
  },
  periodText: {
    color: colors.accent,
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
    backgroundColor: colors.dominant,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: spacing.borderRadius.full,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  viewText: {
    color: colors.accent,
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
    borderColor: colors.secondary,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    color: colors.accent,
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