import * as React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

// Mock data reflecting backend notification payloads
const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'SECURITY',
    title: 'New Sign-In Detected',
    message: 'Your account was accessed from Android SM-G998B.',
    time: '10 mins ago',
    unread: true,
  },
  {
    id: 'notif-2',
    type: 'TRANSACTION',
    title: 'Transfer Completed',
    message: 'Your internal transfer of $500.00 was successful.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 'notif-3',
    type: 'SYSTEM',
    title: 'Statement Available',
    message: 'Your monthly statement for July is ready to view.',
    time: 'Jul 26, 2026',
    unread: false,
  },
];

export const NotificationsScreen = () => {
  const renderItem = ({ item }: { item: typeof MOCK_NOTIFICATIONS[0] }) => (
    <TouchableOpacity
      style={[styles.notificationCard, item.unread && styles.unreadCard]}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          {item.type === 'SECURITY' ? '🛡️' : item.type === 'TRANSACTION' ? '💸' : '📄'}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, item.unread && styles.titleUnread]}>
            {item.title}
          </Text>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SecureScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Alerts & Notifications</Text>
      </View>

      <FlatList
        data={MOCK_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>You're all caught up!</Text>
            <Text style={styles.emptyText}>No new security or transaction alerts.</Text>
          </View>
        }
      />
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dominant, // 60% White
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  pageTitle: {
    color: colors.accent, // 10% Deep Navy
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#F1F5F9', // Very soft border
  },
  unreadCard: {
    backgroundColor: '#F0F8FF', // Soft blue tint for unread
    borderColor: colors.secondary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dominant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  titleUnread: {
    fontWeight: '900',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  time: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});