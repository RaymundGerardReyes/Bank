import * as React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();

  return (
    <SecureScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Aesthetic Header */}
        <View style={styles.topProfileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0) || 'U'}
              {user?.lastName?.charAt(0) || ''}
            </Text>
          </View>
          <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role || 'CUSTOMER'}</Text>
          </View>
        </View>

        {/* Integrated Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoRowIcon}>🛡️</Text>
            <View>
              <Text style={styles.infoLabel}>Account Status</Text>
              <Text style={styles.infoValue}>Verified & Active</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoRowIcon}>📅</Text>
            <View>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>January 2024</Text>
            </View>
          </View>
        </View>

        {/* Minimalist Button implementation */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutTitle}>Secure Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Signs out and revokes current session token.
        </Text>
      </ScrollView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dominant,
  },
  scroll: {
    paddingBottom: spacing.xl,
  },
  // Aesthetics top header
  topProfileHeader: {
    backgroundColor: colors.surface,
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: spacing.borderRadius.xl,
    borderBottomRightRadius: spacing.borderRadius.xl,
    // Minimalistic shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: `${colors.accent}10`, // Derived
    borderWidth: 2,
    borderColor: colors.dominant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    color: colors.accent,
    fontSize: 36,
    fontWeight: '700',
  },
  name: {
    color: colors.accent,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  email: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    backgroundColor: colors.dominant,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: `${colors.textMuted}40`,
  },
  roleText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // Info Section - integrated look
  infoSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRowIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: `${colors.textMuted}30`,
    marginVertical: spacing.md,
  },
  // Custom Minimalist Button (replaced 'common/Button')
  logoutBtn: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.danger,
    height: 50,
    borderRadius: spacing.borderRadius.full,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  logoutTitle: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.md,
    marginHorizontal: spacing.xl,
  },
});