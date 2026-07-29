import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    container: { flex: 1, backgroundColor: '#FFFFFF' }, // 60% Dominant
    header: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#003366' }, // 10% Accent
    headerSubtitle: { fontSize: 16, fontWeight: '500', color: '#7BB2D9', marginTop: 4 },
    filterContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 16, gap: 12 },
    filterChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
    filterActive: { backgroundColor: '#003366', borderColor: '#003366' },
    filterText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
    filterTextActive: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
    listContainer: { paddingHorizontal: 24, paddingBottom: 40 },
    transactionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
    leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    iconCredit: { backgroundColor: '#ECFDF5' }, // Very light green
    iconDebit: { backgroundColor: '#F0F9FF' }, // Very light blue
    iconText: { fontSize: 18, fontWeight: '800', color: '#003366' },
    txTitle: { fontSize: 16, fontWeight: '700', color: '#003366', marginBottom: 4 },
    txCategory: { fontSize: 13, fontWeight: '500', color: '#7BB2D9' },
    rightSection: { alignItems: 'flex-end' },
    txAmount: { fontSize: 16, fontWeight: '800' },
    amountCredit: { color: '#10B981' }, // Emerald Green for income
    amountDebit: { color: '#003366' }, // Navy for expenses
    separator: { height: 1, backgroundColor: '#F1F5F9' },
});