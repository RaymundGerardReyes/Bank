import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

// Mock Data representing your backend Ledger
const TRANSACTIONS = [
    { id: '1', title: 'Salary Deposit', category: 'Income', amount: '+ $4,500.00', date: 'Today, 09:00 AM', type: 'credit' },
    { id: '2', title: 'Starbucks', category: 'Food & Drink', amount: '- $5.40', date: 'Yesterday, 08:30 AM', type: 'debit' },
    { id: '3', title: 'Transfer to Savings', category: 'Internal', amount: '- $500.00', date: 'Yesterday, 10:15 AM', type: 'debit' },
    { id: '4', title: 'Amazon AWS', category: 'Software', amount: '- $45.00', date: 'Jul 26, 11:20 PM', type: 'debit' },
    { id: '5', title: 'Client Payment', category: 'Freelance', amount: '+ $1,200.00', date: 'Jul 25, 02:00 PM', type: 'credit' },
];

export default function TransactionsScreen() {
    const insets = useSafeAreaInsets();

    const renderTransaction = ({ item }: any) => {
        const isCredit = item.type === 'credit';
        return (
            <TouchableOpacity style={styles.transactionRow} activeOpacity={0.7}>
                <View style={styles.leftSection}>
                    {/* Visual indicator for debit/credit */}
                    <View style={[styles.iconContainer, isCredit ? styles.iconCredit : styles.iconDebit]}>
                        <Ionicons
                            name={isCredit ? 'arrow-down' : 'arrow-up'}
                            size={20}
                            color={isCredit ? colors.success : colors.textPrimary}
                        />
                    </View>
                    <View>
                        <Text style={styles.txTitle}>{item.title}</Text>
                        <Text style={styles.txCategory}>{item.category} • {item.date}</Text>
                    </View>
                </View>
                <View style={styles.rightSection}>
                    <Text style={[styles.txAmount, isCredit ? styles.amountCredit : styles.amountDebit]}>
                        {item.amount}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <Text style={styles.headerTitle}>Transactions</Text>
                <Text style={styles.headerSubtitle}>Recent Ledger Activity</Text>
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity style={[styles.filterChip, styles.filterActive]}>
                    <Text style={styles.filterTextActive}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterText}>Income</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterText}>Expenses</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={TRANSACTIONS}
                keyExtractor={(item) => item.id}
                renderItem={renderTransaction}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
    headerTitle: { fontSize: typography.fontSize.hero, fontWeight: typography.fontWeight.heavy, color: colors.primary },
    headerSubtitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.medium, color: colors.textSecondary, marginTop: spacing.xs },
    filterContainer: { flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.md, gap: spacing.md },
    filterChip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: spacing.borderRadius.full, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
    filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    filterText: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.textSecondary },
    filterTextActive: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.textInverse },
    listContainer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
    transactionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md },
    leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
    iconCredit: { backgroundColor: colors.successBg },
    iconDebit: { backgroundColor: colors.surfaceAlt },
    txTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.xs },
    txCategory: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.textSecondary },
    rightSection: { alignItems: 'flex-end' },
    txAmount: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.heavy },
    amountCredit: { color: colors.success },
    amountDebit: { color: colors.textPrimary },
    separator: { height: 1, backgroundColor: colors.divider },
});