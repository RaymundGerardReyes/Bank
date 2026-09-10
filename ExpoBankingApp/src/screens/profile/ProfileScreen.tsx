import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to end your secure session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const SETTINGS_SECTIONS = [
    {
      title: 'Security & Access',
      items: [
        {
          title: 'Security Controls',
          subtitle: 'Biometrics, PIN, Password & 2FA',
          icon: 'shield-checkmark-outline' as const,
          action: () => navigation.navigate('SecuritySettings'),
        },
        {
          title: 'Trusted Devices',
          subtitle: 'Manage active sessions & hardware keys',
          icon: 'phone-portrait-outline' as const,
          action: () => navigation.navigate('DeviceManagement'),
        },
        {
          title: 'Audit Trail',
          subtitle: 'Immutable cryptographic security log',
          icon: 'document-text-outline' as const,
          action: () => navigation.navigate('AuditLogs'),
        },
      ],
    },
    {
      title: 'Banking & Statements',
      items: [
        {
          title: 'Products & Yield Rates',
          subtitle: 'Explore High-Yield Savings & checking plans',
          icon: 'sparkles-outline' as const,
          action: () => navigation.navigate('ProductCatalog'),
        },
        {
          title: 'Monthly Statements',
          subtitle: 'Download encrypted PDF e-statements',
          icon: 'folder-open-outline' as const,
          action: () => navigation.navigate('Statements'),
        },
      ],
    },
  ];

  return (
    <SecureScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Aesthetic Profile Header */}
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
            <View style={styles.roleDot} />
            <Text style={styles.roleText}>{user?.role || 'CUSTOMER'}</Text>
          </View>
        </View>

        {/* Status Highlights */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconBg}>
              <Ionicons name="shield-checkmark" size={18} color={colors.success} />
            </View>
            <View style={styles.infoRowContent}>
              <Text style={styles.infoLabel}>KYC Verification</Text>
              <Text style={styles.infoValue}>Tier 3 Institutional Verified</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoIconBg}>
              <Ionicons name="lock-closed" size={18} color={colors.accent} />
            </View>
            <View style={styles.infoRowContent}>
              <Text style={styles.infoLabel}>Session Protocol</Text>
              <Text style={styles.infoValue}>TLS 1.3 / Hardware Biometric Pinned</Text>
            </View>
          </View>
        </View>

        {/* Navigation Sections */}
        {SETTINGS_SECTIONS.map((sec, sIdx) => (
          <View key={sIdx} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{sec.title}</Text>
            <View style={styles.menuCard}>
              {sec.items.map((item, iIdx) => (
                <TouchableOpacity
                  key={iIdx}
                  style={[styles.menuRow, iIdx < sec.items.length - 1 && styles.menuRowBorder]}
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconBg}>
                    <Ionicons name={item.icon} size={20} color={colors.accent} />
                  </View>
                  <View style={styles.menuRowContent}>
                    <Text style={styles.menuRowTitle}>{item.title}</Text>
                    <Text style={styles.menuRowSub}>{item.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={colors.dominant} style={{ marginRight: 8 }} />
          <Text style={styles.logoutTitle}>Secure Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          NovaBank Enterprise Mobile • v2.4.0 (Hardened Build)
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
  topProfileHeader: {
    backgroundColor: colors.surface,
    paddingTop: spacing.xl * 1.5,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: spacing.borderRadius.xl,
    borderBottomRightRadius: spacing.borderRadius.xl,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    color: colors.dominant,
    fontSize: 32,
    fontWeight: '800',
  },
  name: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  email: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dominant,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  roleText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  infoSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoRowContent: {
    flex: 1,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoValue: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: spacing.sm,
  },
  menuSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  menuSectionTitle: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  menuCard: {
    backgroundColor: colors.dominant,
    borderRadius: spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuRowContent: {
    flex: 1,
  },
  menuRowTitle: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  menuRowSub: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  logoutBtn: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    backgroundColor: colors.danger,
    height: 50,
    borderRadius: spacing.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  logoutTitle: {
    color: colors.dominant,
    fontSize: 15,
    fontWeight: '700',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.md,
    fontFamily: 'monospace',
  },
});