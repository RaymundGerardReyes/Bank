import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';

// Mock Data representing your backend Ledger
const TRANSACTIONS = [
    { id: '1', title: 'Salary Deposit', category: 'Income', amount: '+ $4,500.00', date: 'Today, 09:00 AM', type: 'credit' },
    { id: '2', title: 'Starbucks', category: 'Food & Drink', amount: '- $5.40', date: 'Yesterday, 08:30 AM', type: 'debit' },
    { id: '3', title: 'Transfer to Savings', category: 'Internal', amount: '- $500.00', date: 'Yesterday, 10:15 AM', type: 'debit' },
    { id: '4', title: 'Amazon AWS', category: 'Software', amount: '- $45.00', date: 'Jul 26, 11:20 PM', type: 'debit' },
    { id: '5', title: 'Client Payment', category: 'Freelance', amount: '+ $1,200.00', date: 'Jul 25, 02:00 PM', type: 'credit' },
];

export default function TransactionsScreen() {

    const renderTransaction = ({ item }: any) => (
        <TouchableOpacity style={styles.transactionRow} activeOpacity={0.7}>
            <View style={styles.leftSection}>
                {/* Visual indicator for debit/credit */}
                <View style={[styles.iconContainer, item.type === 'credit' ? styles.iconCredit : styles.iconDebit]}>
                    <Text style={styles.iconText}>{item.title.charAt(0)}</Text>
                </View>
                <View>
                    <Text style={styles.txTitle}>{item.title}</Text>
                    <Text style={styles.txCategory}>{item.category} • {item.date}</Text>
                </View>
            </View>
            <View style={styles.rightSection}>
                <Text style={[styles.txAmount, item.type === 'credit' ? styles.amountCredit : styles.amountDebit]}>
                    {item.amount}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
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
    header: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: colors.primary },
    headerSubtitle: { fontSize: 16, fontWeight: '500', color: colors.info, marginTop: 4 },
    filterContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 16, gap: 12 },
    filterChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
    filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    filterText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
    filterTextActive: { fontSize: 14, fontWeight: '700', color: colors.surface },
    listContainer: { paddingHorizontal: 24, paddingBottom: 40 },
    transactionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
    leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    iconCredit: { backgroundColor: colors.successBg },
    iconDebit: { backgroundColor: colors.infoBg },
    iconText: { fontSize: 18, fontWeight: '800', color: colors.primary },
    txTitle: { fontSize: 16, fontWeight: '700', color: colors.primary, marginBottom: 4 },
    txCategory: { fontSize: 13, fontWeight: '500', color: colors.info },
    rightSection: { alignItems: 'flex-end' },
    txAmount: { fontSize: 16, fontWeight: '800' },
    amountCredit: { color: colors.success },
    amountDebit: { color: colors.primary },
    separator: { height: 1, backgroundColor: colors.divider },
});