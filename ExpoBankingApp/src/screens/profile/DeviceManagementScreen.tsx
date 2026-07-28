import * as React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const DeviceManagementScreen = () => {
  return (
    <SecureScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Devices</Text>
          <Text style={styles.subtitle}>Authorized access points for this account.</Text>
        </View>

        <Text style={styles.sectionHeader}>Current Device</Text>

        {/* Refined Active Device Card */}
        <View style={styles.currentDeviceCard}>
          <View style={styles.deviceRow}>
            <View style={styles.iconContainer}>
              <Text style={styles.deviceIcon}>📱</Text>
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>SM-G998B (Android 14)</Text>
              <Text style={styles.deviceMeta}>Authorized: Oct 1, 2024 • App v1.0.0</Text>
            </View>
          </View>

          <View style={styles.integrityDivider} />

          <Text style={styles.integrityTitle}>Security Checks</Text>

          <View style={styles.checkRow}>
            <Text style={styles.checkIcon}>✅</Text>
            <Text style={styles.checkText}>Environment Integrity (Root Detection)</Text>
            <Text style={styles.passText}>PASS</Text>
          </View>
          <View style={styles.checkRow}>
            <Text style={styles.checkIcon}>✅</Text>
            <Text style={styles.checkText}>Network Trust (TLS Pinning)</Text>
            <Text style={styles.passText}>PASS</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Other Session</Text>

        {/* Refined Other Device Card */}
        <View style={styles.deviceCard}>
          <View style={styles.deviceRow}>
            <View style={styles.iconContainerOther}>
              <Text style={styles.deviceIcon}>💻</Text>
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceNameOther}>MacBook Pro (Chrome Web)</Text>
              <Text style={styles.deviceMeta}>Last active: 2 hours ago from London</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.unlinkActionButton} activeOpacity={0.7}>
            <Text style={styles.unlinkIcon}>🔗</Text>
            <Text style={styles.unlinkText}>Revoke Access</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SecureScreenWrapper>
  );
};

const cardBaseStyle = {
  backgroundColor: colors.surface,
  borderRadius: spacing.borderRadius.lg,
  padding: spacing.lg,
  marginBottom: spacing.lg,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dominant,
  },
  scroll: {
    padding: spacing.lg,
  },
  header: {
    paddingVertical: spacing.xl,
  },
  title: {
    color: colors.accent,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 4,
  },
  sectionHeader: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  currentDeviceCard: {
    ...cardBaseStyle,
  },
  deviceCard: {
    ...cardBaseStyle,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconContainerOther: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.textMuted}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  deviceIcon: {
    fontSize: 28,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '600',
  },
  deviceNameOther: {
    color: colors.textSecondary,
    fontSize: 17,
    fontWeight: '500',
  },
  deviceMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  integrityDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: `${colors.textMuted}40`,
    marginVertical: spacing.lg,
  },
  integrityTitle: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  checkText: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  passText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  unlinkActionButton: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: `${colors.textMuted}30`,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlinkIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  unlinkText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
});