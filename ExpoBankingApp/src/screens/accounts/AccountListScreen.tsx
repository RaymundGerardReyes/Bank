import * as React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAccounts } from '../../hooks/useAccounts';
import { AccountBalanceCard } from '../../components/accounts/AccountBalanceCard';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const AccountListScreen = () => {
  const { accounts } = useAccounts();

  const renderEmptyState = () => (
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
  );

  return (
    <SecureScreenWrapper style={styles.container}>
      <Text style={styles.title}>Your Accounts</Text>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.accountNumber}
        renderItem={({ item }) => <AccountBalanceCard account={item} />}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={!accounts || accounts.length === 0 ? styles.emptyContainer : null}
      />
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  hardenedEmptyCard: {
    backgroundColor: '#F8FAFC',
    padding: spacing.xl,
    borderRadius: spacing.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: spacing.xl,
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
});
