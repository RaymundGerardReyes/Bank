import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { notificationService } from '../../services/notification/notificationService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

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

const FILTERS: FilterType[] = ['ALL', 'UNREAD', 'SECURITY', 'TRANSACTION'];

const getCategoryIcon = (category: NotificationCategory): keyof typeof Ionicons.glyphMap => {
  if (category === 'SECURITY') return 'shield-checkmark-outline';
  if (category === 'TRANSACTION') return 'card-outline';
  if (category === 'DISPUTE') return 'alert-circle-outline';
  return 'information-circle-outline';
};

const getSeverityTone = (severity: HardenedNotificationItem['severity']) => {
  if (severity === 'CRITICAL') return 'danger' as const;
  if (severity === 'WARNING') return 'warning' as const;
  return 'info' as const;
};

export const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
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
          category: (log.category as NotificationCategory) || 'SYSTEM',
          title: log.title,
          message: log.message,
          timestamp: log.timestamp,
          unread: log.unread,
          correlationId: log.correlationId,
          referenceId: log.referenceId,
          channel: (log.channel as DeliveryChannel) || 'PUSH',
          ipAddress: log.ipAddress,
          deviceInfo: log.deviceInfo,
          severity: (log.severity as HardenedNotificationItem['severity']) || 'INFO',
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

  const unreadCount = notifications.filter((notification) => notification.unread).length;

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
        prev.map((notification) =>
          notification.id === item.id ? { ...notification, unread: false } : notification
        )
      );
    }
    setSelectedNotification(item);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const renderItem = ({ item }: { item: HardenedNotificationItem }) => (
    <TouchableOpacity
      style={[styles.notificationRow, item.unread && styles.notificationUnread]}
      onPress={() => handleCardPress(item)}
      activeOpacity={0.82}
      accessibilityRole="button"
    >
      <View style={styles.notificationIcon}>
        <Ionicons name={getCategoryIcon(item.category)} size={20} color={colors.primary} />
      </View>
      <View style={styles.notificationBody}>
        <View style={styles.notificationTopRow}>
          <Text style={styles.notificationTitle} numberOfLines={1}>{item.title}</Text>
          {item.unread ? <View style={styles.unreadDot} /> : null}
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>{item.message}</Text>
        <View style={styles.notificationMetaRow}>
          <StatusBadge label={item.category} tone={getSeverityTone(item.severity)} />
          <Text style={styles.notificationTime}>{item.timestamp}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SecureScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.pageTitle}>Alerts</Text>
          <Text style={styles.subtitle}>
            {unreadCount > 0 ? `${unreadCount} unread message(s)` : 'No unread messages'}
          </Text>
        </View>
        {unreadCount > 0 ? (
          <TouchableOpacity style={styles.markReadButton} onPress={markAllAsRead} activeOpacity={0.82}>
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filterContainer}>
        {FILTERS.map((tab) => {
          const isActive = activeFilter === tab;
          const label = tab === 'ALL' ? 'All' : tab === 'UNREAD' ? `Unread (${unreadCount})` : tab === 'TRANSACTION' ? 'Transfers' : 'Security';
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterChip, isActive && styles.activeFilterChip]}
              onPress={() => setActiveFilter(tab)}
              activeOpacity={0.82}
              accessibilityRole="button"
            >
              <Text style={[styles.filterChipText, isActive && styles.activeFilterChipText]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 88 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <EmptyState
              icon="notifications-outline"
              title="No alerts"
              message={
                activeFilter === 'ALL'
                  ? 'Account notices and security messages will appear here.'
                  : `No messages match the ${activeFilter.toLowerCase()} filter.`
              }
              actionLabel={activeFilter !== 'ALL' ? 'Clear filter' : undefined}
              onActionPress={activeFilter !== 'ALL' ? () => setActiveFilter('ALL') : undefined}
            />
          </Card>
        }
      />

      {selectedNotification ? (
        <Modal
          animationType="slide"
          transparent
          visible={Boolean(selectedNotification)}
          onRequestClose={() => setSelectedNotification(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, spacing.screen) }]}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleGroup}>
                  <StatusBadge
                    label={selectedNotification.severity}
                    tone={getSeverityTone(selectedNotification.severity)}
                  />
                  <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedNotification(null)}
                  style={styles.closeButton}
                  accessibilityRole="button"
                  accessibilityLabel="Close alert detail"
                >
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.modalScrollView}
                contentContainerStyle={styles.modalScrollBody}
              >
                <Text style={styles.modalMessage}>{selectedNotification.message}</Text>
                <Card style={styles.auditCard}>
                  <View style={styles.auditRow}>
                    <Text style={styles.auditKey}>Reference</Text>
                    <Text style={styles.auditValue}>{selectedNotification.referenceId}</Text>
                  </View>
                  <View style={styles.auditRow}>
                    <Text style={styles.auditKey}>Device</Text>
                    <Text style={styles.auditValue}>{selectedNotification.deviceInfo}</Text>
                  </View>
                  <View style={styles.auditRow}>
                    <Text style={styles.auditKey}>Channel</Text>
                    <Text style={styles.auditValue}>{selectedNotification.channel}</Text>
                  </View>
                  <View style={styles.auditRow}>
                    <Text style={styles.auditKey}>Time</Text>
                    <Text style={styles.auditValue}>{selectedNotification.timestamp}</Text>
                  </View>
                </Card>
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : null}
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
    fontWeight: typography.fontWeight.heavy,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    marginTop: spacing.xs,
  },
  markReadButton: {
    minHeight: spacing.touchTarget,
    justifyContent: 'center',
  },
  markReadText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    minHeight: 38,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  activeFilterChipText: {
    color: colors.textInverse,
  },
  listContent: {
    paddingHorizontal: spacing.screen,
  },
  notificationRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  notificationUnread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationIcon: {
    width: 42,
    height: 42,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  notificationBody: {
    flex: 1,
  },
  notificationTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notificationTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notificationMessage: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    marginTop: spacing.xs,
  },
  notificationMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  notificationTime: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    flexShrink: 1,
    textAlign: 'right',
  },
  emptyCard: {
    marginTop: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 49, 43, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: spacing.borderRadius.xl,
    borderTopRightRadius: spacing.borderRadius.xl,
    padding: spacing.screen,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  modalTitleGroup: {
    flex: 1,
    paddingRight: spacing.md,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.xl,
    fontWeight: typography.fontWeight.heavy,
    marginTop: spacing.sm,
  },
  closeButton: {
    width: spacing.touchTarget,
    height: spacing.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollView: {
    flexShrink: 1,
  },
  modalScrollBody: {
    paddingBottom: spacing.md,
  },
  modalMessage: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    marginBottom: spacing.md,
  },
  auditCard: {
    gap: spacing.sm,
  },
  auditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  auditKey: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  auditValue: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    textAlign: 'right',
  },
});
