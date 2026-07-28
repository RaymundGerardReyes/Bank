import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { Statement } from '../../models/Statement';
import { useGetStatementsQuery } from '../../state/api/statementApi';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const StatementListScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const accountNumber = route.params?.accountNumber || 'ACCT-100200';

  const { data, isLoading } = useGetStatementsQuery(accountNumber);

  // Fallback to mock data if the API is empty during testing
  const statements: Statement[] = data?.data || [
    { id: 1, accountNumber, statementPeriod: 'July 2026', startDate: '2026-07-01', endDate: '2026-07-31', pdfDownloadUrl: '', generatedAt: '2026-08-01' },
    { id: 2, accountNumber, statementPeriod: 'June 2026', startDate: '2026-06-01', endDate: '2026-06-30', pdfDownloadUrl: '', generatedAt: '2026-07-01' },
  ];

  const navigateToViewer = (statement: Statement) => {
    navigation.navigate('StatementViewer', { statement });
  };

  const renderItem = ({ item }: { item: Statement }) => (
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
          <Text style={styles.periodText}>{item.statementPeriod}</Text>
          <Text style={styles.dateText}>Generated: {item.generatedAt}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.viewText}>View PDF</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SecureScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account Statements</Text>
        <Text style={styles.subtitle}>Select a month to view the official PDF document.</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={statements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  },
  title: {
    color: colors.accent, // 10% Navy
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary, // 30% Soft Blue
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
});