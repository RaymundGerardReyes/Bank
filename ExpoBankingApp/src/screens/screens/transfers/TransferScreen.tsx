import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TransferScreen() {
    const navigation = useNavigation<any>();
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [memo, setMemo] = useState('');

    const handleTransfer = () => {
        // Add transfer logic here
        navigation.navigate('TransferReview');
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Send Money</Text>
                    <Text style={styles.headerSubtitle}>Internal & External Transfers</Text>
                </View>

                {/* Massive Amount Input for UX Focus */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        placeholderTextColor="#7BB2D9"
                        autoFocus
                    />
                </View>

                <View style={styles.card}>
                    {/* From Account (Static for now, can be a dropdown) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>From Account</Text>
                        <View style={styles.accountSelector}>
                            <View>
                                <Text style={styles.accountName}>Premium Checking</Text>
                                <Text style={styles.accountBalance}>Available: $14,850.75</Text>
                            </View>
                            <Text style={styles.accountNumber}>**** 7654</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* To Account */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>To Recipient</Text>
                        <TextInput
                            style={styles.textInput}
                            value={recipient}
                            onChangeText={setRecipient}
                            placeholder="Email, Phone, or Account Number"
                            placeholderTextColor="#A0AEC0"
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Memo */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Memo (Optional)</Text>
                        <TextInput
                            style={styles.textInput}
                            value={memo}
                            onChangeText={setMemo}
                            placeholder="What is this for?"
                            placeholderTextColor="#A0AEC0"
                        />
                    </View>
                </View>

            </ScrollView>

            {/* Sticky Bottom Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, (!amount || !recipient) && styles.buttonDisabled]}
                    onPress={handleTransfer}
                    disabled={!amount || !recipient}
                >
                    <Text style={styles.buttonText}>Review Transfer</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' }, // 60% Dominant
    scrollContainer: { padding: 24, paddingBottom: 100 },
    header: { marginBottom: 32, marginTop: 20 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#003366' }, // 10% Accent
    headerSubtitle: { fontSize: 16, fontWeight: '500', color: '#7BB2D9', marginTop: 4 }, // 30% Secondary
    amountContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
    currencySymbol: { fontSize: 48, fontWeight: '700', color: '#003366', marginRight: 8 },
    amountInput: { fontSize: 64, fontWeight: '800', color: '#003366', minWidth: 150 },
    card: {
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#003366',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    inputGroup: { marginVertical: 8 },
    label: { fontSize: 13, fontWeight: '700', color: '#7BB2D9', textTransform: 'uppercase', marginBottom: 8 },
    textInput: { fontSize: 16, fontWeight: '600', color: '#003366', paddingVertical: 8 },
    accountSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    accountName: { fontSize: 16, fontWeight: '700', color: '#003366' },
    accountBalance: { fontSize: 13, fontWeight: '500', color: '#10B981', marginTop: 2 },
    accountNumber: { fontSize: 14, fontWeight: '600', color: '#A0AEC0' },
    divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#F1F5F9' },
    button: { backgroundColor: '#003366', paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#003366', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    buttonDisabled: { backgroundColor: '#CBD5E1', shadowOpacity: 0 },
    buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
});