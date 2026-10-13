import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

// Mock Data representing your backend Audit Logs
const AUDIT_LOGS = [
    { id: '1', action: 'TRANSFER_EXECUTE', actor: 'user_client1', ip: '192.168.1.105', date: 'Today, 21:00:15', status: 'SUCCESS', type: 'transaction' },
    { id: '2', action: 'AUTH_LOGIN_FAILED', actor: 'unknown', ip: '10.45.2.11', date: 'Today, 20:45:02', status: 'FAILED', type: 'security' },
    { id: '3', action: 'API_KEY_ROTATED', actor: 'sys_admin', ip: '192.168.1.1', date: 'Yesterday, 14:22:00', status: 'SUCCESS', type: 'system' },
    { id: '4', action: 'AUTH_LOGIN', actor: 'user_client1', ip: '192.168.1.105', date: 'Jul 26, 09:15 AM', status: 'SUCCESS', type: 'security' },
    { id: '5', action: 'ACCOUNT_FROZEN', actor: 'sys_admin', ip: '10.0.0.1', date: 'Jul 25, 04:30 PM', status: 'SUCCESS', type: 'system' },
];

export default function AuditHistoryScreen() {
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState('All');

    // Helper to determine icon letter and color based on event type
    const getIconConfig = (type: string) => {
        switch (type) {
            case 'security': return { letter: 'S', bg: colors.dangerBg, color: colors.danger };
            case 'transaction': return { letter: 'T', bg: colors.infoBg, color: colors.info };
            case 'system': return { letter: 'C', bg: colors.surfaceAlt, color: colors.textSecondary };
            default: return { letter: 'A', bg: colors.primaryLight, color: colors.primary };
        }
    };

    const renderAuditRow = ({ item }: any) => {
        const icon = getIconConfig(item.type);
        const isSuccess = item.status === 'SUCCESS';

        return (
            <TouchableOpacity style={styles.auditRow} activeOpacity={0.7}>
                <View style={styles.leftSection}>
                    {/* Event Type Icon */}
                    <View style={[styles.iconContainer, { backgroundColor: icon.bg }]}>
                        <Text style={[styles.iconText, { color: icon.color }]}>{icon.letter}</Text>
                    </View>

                    {/* Event Details */}
                    <View style={styles.textDataContainer}>
                        <Text style={styles.actionTitle}>{item.action}</Text>
                        <Text style={styles.actorSubtitle}>
                            {item.actor} • {item.ip}
                        </Text>
                        <Text style={styles.dateText}>{item.date}</Text>
                    </View>
                </View>

                {/* Status Badge */}
                <View style={styles.rightSection}>
                    <View style={[styles.statusBadge, isSuccess ? styles.badgeSuccess : styles.badgeFailed]}>
                        <Text style={[styles.statusText, isSuccess ? styles.textSuccess : styles.textFailed]}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <Text style={styles.headerTitle}>Audit Trail</Text>
                <Text style={styles.headerSubtitle}>Immutable Security & System Logs</Text>
            </View>

            {/* Scannable Filters */}
            <View style={styles.filterContainer}>
                {['All', 'Security', 'Transactions', 'System'].map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[styles.filterChip, activeFilter === filter && styles.filterActive]}
                        onPress={() => setActiveFilter(filter)}
                    >
                        <Text style={activeFilter === filter ? styles.filterTextActive : styles.filterText}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* List */}
            <FlatList
                data={activeFilter === 'All' ? AUDIT_LOGS : AUDIT_LOGS.filter(log => log.type.toLowerCase() === activeFilter.toLowerCase())}
                keyExtractor={(item) => item.id}
                renderItem={renderAuditRow}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    header: { paddingHorizontal: 24, paddingBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: colors.primary },
    headerSubtitle: { fontSize: 16, fontWeight: '500', color: colors.textSecondary, marginTop: 4 },

    filterContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 16, gap: 10 },
    filterChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
    filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    filterText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    filterTextActive: { fontSize: 13, fontWeight: '700', color: colors.surface },

    listContainer: { paddingHorizontal: 24, paddingBottom: 40 },

    auditRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
    leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },

    iconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    iconText: { fontSize: 18, fontWeight: '800' },

    textDataContainer: { flex: 1, paddingRight: 10 },
    actionTitle: { fontSize: 15, fontWeight: '800', color: colors.primary, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
    actorSubtitle: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 2 },
    dateText: { fontSize: 12, fontWeight: '500', color: colors.textMuted },

    rightSection: { alignItems: 'flex-end', justifyContent: 'center' },

    statusBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1 },
    badgeSuccess: { backgroundColor: colors.successBg, borderColor: colors.success },
    badgeFailed: { backgroundColor: colors.dangerBg, borderColor: colors.danger },

    statusText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
    textSuccess: { color: colors.success },
    textFailed: { color: colors.danger },

    separator: { height: 1, backgroundColor: colors.divider },
});