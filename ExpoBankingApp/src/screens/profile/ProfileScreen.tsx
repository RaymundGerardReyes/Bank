import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { SectionHeader } from '../../components/common/SectionHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAuth } from '../../hooks/useAuth';
import { faceEnrollmentService } from '../../services/auth/faceEnrollmentService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type MenuItem = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const SETTINGS_SECTIONS: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Security',
    items: [
      {
        title: 'Security controls',
        subtitle: 'Biometrics, PIN, password, and second factors',
        icon: 'shield-checkmark-outline',
        route: 'SecuritySettings',
      },
      {
        title: 'Face recognition',
        subtitle: 'Enroll or update your facial biometric profile',
        icon: 'scan-outline',
        route: 'FaceEnrollment',
      },
      {
        title: 'Trusted devices',
        subtitle: 'Review active sessions and registered hardware',
        icon: 'phone-portrait-outline',
        route: 'DeviceManagement',
      },
      {
        title: 'Audit trail',
        subtitle: 'View recent account and access events',
        icon: 'document-text-outline',
        route: 'AuditLogs',
      },
    ],
  },
  {
    title: 'Banking',
    items: [
      {
        title: 'Products',
        subtitle: 'Compare account types before opening a new account',
        icon: 'briefcase-outline',
        route: 'ProductCatalog',
      },
      {
        title: 'Statements',
        subtitle: 'Download monthly account statements',
        icon: 'folder-open-outline',
        route: 'Statements',
      },
    ],
  },
];

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const initials = `${user?.firstName?.charAt(0) || 'U'}${user?.lastName?.charAt(0) || ''}`;
  const [isFaceEnrolled, setIsFaceEnrolled] = React.useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      async function checkBiometrics() {
        const enrolled = await faceEnrollmentService.isFaceEnrolled(user?.email);
        if (isMounted) {
          setIsFaceEnrolled(enrolled);
        }
      }
      checkBiometrics();
      return () => {
        isMounted = false;
      };
    }, [user?.email])
  );

  const handleLogout = () => {
    Alert.alert('Sign out', 'End this NovaBank session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 88 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.identity}>
            <Text style={styles.name} numberOfLines={1}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.email} numberOfLines={1}>{user?.email}</Text>
            <StatusBadge label={user?.role || 'CUSTOMER'} tone="neutral" />
          </View>
        </View>

        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusIcon}>
              <Ionicons name="checkmark-circle-outline" size={22} color={colors.success} />
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>Identity verified</Text>
              <Text style={styles.statusCopy}>Your account is eligible for standard mobile banking actions.</Text>
            </View>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusRow}>
            <View style={styles.statusIcon}>
              <Ionicons name="lock-closed-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>Session protected</Text>
              <Text style={styles.statusCopy}>Sensitive actions may request biometric confirmation.</Text>
            </View>
          </View>
          <View style={styles.statusDivider} />
          <TouchableOpacity
            style={styles.statusRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(isFaceEnrolled ? 'SecuritySettings' : 'FaceEnrollment')}
          >
            <View style={styles.statusIcon}>
              <Ionicons
                name={isFaceEnrolled ? 'shield-checkmark-outline' : 'scan-outline'}
                size={22}
                color={isFaceEnrolled ? colors.success : colors.warning}
              />
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>
                {isFaceEnrolled ? 'Face Biometrics: Active' : 'Face Biometrics: Not Set'}
              </Text>
              <Text style={styles.statusCopy}>
                {isFaceEnrolled
                  ? 'Hardware-backed facial biometric vector profile active.'
                  : 'Tap here to enroll face biometrics for passwordless login.'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>

        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title}>
            <SectionHeader title={section.title} />
            <Card style={styles.menuCard}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.title}
                  style={[styles.menuRow, index < section.items.length - 1 && styles.menuDivider]}
                  onPress={() => navigation.navigate(item.route)}
                  activeOpacity={0.82}
                  accessibilityRole="button"
                >
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon} size={20} color={colors.primary} />
                  </View>
                  <View style={styles.menuText}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        <Button title="Sign out" onPress={handleLogout} variant="danger" fullWidth style={styles.logoutButton} />
        <Text style={styles.footerText}>NovaBank Mobile v2.4.0</Text>
      </ScrollView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: spacing.borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
    fontWeight: typography.fontWeight.heavy,
  },
  identity: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
    fontWeight: typography.fontWeight.heavy,
  },
  email: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
  },
  statusCard: {
    marginBottom: spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  statusCopy: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    marginTop: spacing.xs,
  },
  statusDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  menuDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: spacing.borderRadius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  menuTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  menuSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    marginTop: spacing.xs,
  },
  logoutButton: {
    marginTop: spacing.lg,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
