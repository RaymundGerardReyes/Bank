import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Modal, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { notificationService } from '../../services/notification/notificationService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export type NotificationCategory = 'SECURITY' | 'TRANSACTION' | 'SYSTEM' | 'DISPUTE';
export type DeliveryChannel = 'PUSH' | 'SMTP_EMAIL' | 'SMS_OTP';

export interface HardenedNotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  correlationId: string;
  referenceId: string;
  channel: DeliveryChannel;
  ipAddress: string;
  deviceInfo: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
}

type FilterType = 'ALL' | 'UNREAD' | 'SECURITY' | 'TRANSACTION';

export const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<HardenedNotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<HardenedNotificationItem | null>(null);

  const fetchLiveAuditNotifications = async () => {
    try {
      const logs = await notificationService.getAuditNotifications();
      if (logs && logs.length > 0) {
        const mapped: HardenedNotificationItem[] = logs.map((log) => ({
          id: log.id,
          category: (log.category as any) || 'SYSTEM',
          title: log.title,
          message: log.message,
          timestamp: log.timestamp,
          unread: log.unread,
          correlationId: log.correlationId,
          referenceId: log.referenceId,
          channel: (log.channel as any) || 'PUSH',
          ipAddress: log.ipAddress,
          deviceInfo: log.deviceInfo,
          severity: (log.severity as any) || 'INFO',
        }));
        setNotifications(mapped);
      }
    } catch (err) {
      console.log('Using default notification stream:', err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLiveAuditNotifications();
    }, [])
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'UNREAD') return item.unread;
    if (activeFilter === 'SECURITY') return item.category === 'SECURITY';
    if (activeFilter === 'TRANSACTION') return item.category === 'TRANSACTION';
    return true;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLiveAuditNotifications();
    setRefreshing(false);
  };

  const handleCardPress = (item: HardenedNotificationItem) => {
    if (item.unread) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
      );
    }
    setSelectedNotification(item);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const getCategoryTheme = (category: NotificationCategory) => {
    switch (category) {
      case 'SECURITY': return { icon: '🛡️', bg: '#FEF2F2', border: '#FCA5A5', label: 'Security' };
      case 'TRANSACTION': return { icon: '💸', bg: '#F0FDF4', border: '#86EFAC', label: 'Transfer' };
      case 'SYSTEM': return { icon: '⚙️', bg: '#F0F9FF', border: '#7BB2D9', label: 'System' };
      case 'DISPUTE': return { icon: '⚠️', bg: '#FFFBEB', border: '#FDE68A', label: 'Alert' };
    }
  };

  const renderItem = ({ item }: { item: HardenedNotificationItem }) => {
    const theme = getCategoryTheme(item.category);
    return (
      <TouchableOpacity
        style={[styles.cardContainer, item.unread && styles.unreadCardContainer]}
        onPress={() => handleCardPress(item)}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeaderRow}>
          <View style={styles.categoryBadgeGroup}>
            <View style={[styles.iconCircle, { backgroundColor: theme.bg, borderColor: theme.border }]}>
              <Text style={styles.iconEmoji}>{theme.icon}</Text>
            </View>
            <View>
              <View style={styles.labelChannelRow}>
                <Text style={styles.categoryLabel}>{theme.label}</Text>
              </View>
              <Text style={styles.referenceText}>Ref: {item.referenceId.split('-')[1]}</Text>
            </View>
          </View>
          <View style={styles.timestampGroup}>
            <Text style={styles.timestampText}>{item.timestamp}</Text>
            {item.unread && <View style={styles.unreadIndicatorDot} />}
          </View>
        </View>
        <Text style={[styles.cardTitle, item.unread && styles.cardTitleUnread]}>{item.title}</Text>
        <Text style={styles.cardMessage} numberOfLines={2}>{item.message}</Text>
        <View style={styles.cardFooterRow}>
          <Text style={styles.inspectLink}>View Details →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Notifications</Text>
          <Text style={styles.subtitle}>
            {unreadCount > 0
              ? `You have ${unreadCount} unread message(s)`
              : "You're all caught up!"}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markReadButton} onPress={markAllAsRead} activeOpacity={0.7}>
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        {(['ALL', 'UNREAD', 'SECURITY', 'TRANSACTION'] as FilterType[]).map((tab) => {
          const isActive = activeFilter === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterChip, isActive && styles.activeFilterChip]}
              onPress={() => setActiveFilter(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, isActive && styles.activeFilterChipText]}>
                {tab === 'ALL' ? 'All' : tab === 'UNREAD' ? `Unread (${unreadCount})` : tab === 'SECURITY' ? 'Security' : 'Transfers'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} colors={[colors.accent]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>
              {activeFilter === 'ALL'
                ? "You're all caught up! No new messages or alerts at this time."
                : `No notifications matching filter '${activeFilter.toLowerCase()}'.`}
            </Text>
            {activeFilter !== 'ALL' && (
              <TouchableOpacity style={styles.resetFilterButton} onPress={() => setActiveFilter('ALL')}>
                <Text style={styles.resetFilterText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {selectedNotification && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedNotification}
          onRequestClose={() => setSelectedNotification(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleGroup}>
                  <Text style={styles.modalCategoryLabel}>
                    {selectedNotification.category} NOTIFICATION
                  </Text>
                  <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedNotification(null)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.modalMessage}>{selectedNotification.message}</Text>
                <View style={styles.auditTable}>
                  <View style={styles.auditRow}>
                    <Text style={styles.auditKey}>Transaction ID / Trace</Text>
                    <Text style={styles.auditValueMono}>{selectedNotification.referenceId}</Text>
                  </View>
                  <View style={styles.auditRow}>
                    <Text style={styles.auditKey}>Device / Client</Text>
                    <Text style={styles.auditValue}>{selectedNotification.deviceInfo}</Text>
                  </View>
                  <View style={styles.auditRow}>
                    <Text style={styles.auditKey}>Date & Time</Text>
                    <Text style={styles.auditValue}>{selectedNotification.timestamp}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCloseSecondaryButton} onPress={() => setSelectedNotification(null)}>
                  <Text style={styles.modalCloseSecondaryText}>Dismiss Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dominant },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md },
  pageTitle: { color: colors.accent, fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: colors.textMuted, fontSize: 14, fontWeight: '600', marginTop: 2 },
  markReadButton: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, backgroundColor: colors.surface, borderRadius: spacing.borderRadius.sm, borderWidth: 1, borderColor: colors.secondary },
  markReadText: { color: colors.accent, fontSize: 11, fontWeight: '800' },
  filterContainer: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.md, gap: spacing.xs },
  filterChip: { paddingVertical: 6, paddingHorizontal: spacing.md, borderRadius: spacing.borderRadius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.secondary },
  activeFilterChip: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterChipText: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  activeFilterChipText: { color: colors.dominant },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  cardContainer: { backgroundColor: colors.dominant, borderRadius: spacing.borderRadius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: colors.accent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  unreadCardContainer: { backgroundColor: colors.surface, borderColor: colors.secondary, borderLeftWidth: 4, borderLeftColor: colors.accent },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  categoryBadgeGroup: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  labelChannelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconCircle: { width: 36, height: 36, borderRadius: spacing.borderRadius.full, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  iconEmoji: { fontSize: 16 },
  categoryLabel: { color: colors.accent, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  referenceText: { color: colors.textMuted, fontSize: 10, fontWeight: '600', fontFamily: 'monospace' },
  timestampGroup: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  timestampText: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
  unreadIndicatorDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
  cardTitle: { color: colors.accent, fontSize: 15, fontWeight: '700', marginTop: spacing.xs, marginBottom: 4 },
  cardTitleUnread: { fontWeight: '900' },
  cardMessage: { color: colors.textPrimary, fontSize: 13, lineHeight: 19 },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: spacing.sm, paddingTop: spacing.xs, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  inspectLink: { color: colors.accent, fontSize: 11, fontWeight: '800' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 44, marginBottom: spacing.sm },
  emptyTitle: { color: colors.accent, fontSize: 17, fontWeight: '800', marginBottom: spacing.xs },
  emptyText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginBottom: spacing.md, paddingHorizontal: spacing.xl },
  resetFilterButton: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: spacing.borderRadius.sm, borderWidth: 1, borderColor: colors.secondary },
  resetFilterText: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 44, 89, 0.55)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.dominant, borderTopLeftRadius: spacing.borderRadius.xl, borderTopRightRadius: spacing.borderRadius.xl, padding: spacing.lg, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  modalTitleGroup: { flex: 1 },
  modalCategoryLabel: { color: colors.secondary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  modalTitle: { color: colors.accent, fontSize: 18, fontWeight: '900', marginTop: 2 },
  closeButton: { padding: spacing.xs },
  closeButtonText: { fontSize: 18, color: colors.textMuted, fontWeight: '800' },
  modalBody: { marginBottom: spacing.lg },
  modalMessage: { color: colors.textPrimary, fontSize: 15, lineHeight: 22, marginBottom: spacing.md },
  auditTable: { backgroundColor: colors.surface, borderRadius: spacing.borderRadius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.secondary, gap: spacing.xs },
  auditRow: { flexDirection: 'column', marginBottom: 6 },
  auditKey: { color: colors.textMuted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  auditValue: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  auditValueMono: { color: colors.accent, fontSize: 11, fontWeight: '700', fontFamily: 'monospace' },
  modalActions: { gap: spacing.sm },
  modalCloseSecondaryButton: { paddingVertical: spacing.sm, alignItems: 'center' },
  modalCloseSecondaryText: { color: colors.textMuted, fontSize: 14, fontWeight: '700' },
});