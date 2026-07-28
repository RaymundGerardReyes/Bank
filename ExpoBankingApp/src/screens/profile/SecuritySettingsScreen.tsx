import * as React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === 'Enabled';
  return (
    <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeInactive]}>
      <Text style={[styles.badgeText, isActive ? styles.badgeTextActive : styles.badgeTextInactive]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
};

export const SecuritySettingsScreen = () => {
  return (
    <SecureScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Security</Text>
          <Text style={styles.subtitle}>Adjust parameters to match your usage.</Text>
        </View>

        {/* Setting Item 1 */}
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.6}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>🖐️</Text>
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Biometric Step-Up</Text>
            <Text style={styles.itemDesc} numberOfLines={2}>
              Fingerprint or face recognition for transfers.
            </Text>
          </View>
          <View style={styles.rightAction}>
            <StatusBadge status="Enabled" />
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Setting Item 2 */}
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.6}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>🔒</Text>
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Change Primary PIN</Text>
            <Text style={styles.itemDesc}>Standard 6-digit access PIN.</Text>
          </View>
          <View style={styles.rightAction}>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Setting Item 3 - Warning item */}
        <TouchableOpacity style={[styles.settingItem]} activeOpacity={0.6}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.warning}15` }]}>
            <Text style={styles.iconEmoji}>⚠️</Text>
          </View>
          <View style={styles.itemContent}>
            <Text style={[styles.itemTitle, { color: colors.warning }]}>Set Duress / Panic PIN</Text>
            <Text style={styles.itemDesc}>Opens restricted safe-mode.</Text>
          </View>
          <View style={styles.rightAction}>
            <StatusBadge status="Not Set" />
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>
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
  header: {
    padding: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
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
    fontWeight: '400',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${colors.textMuted}30`,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconEmoji: {
    fontSize: 22,
  },
  itemContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  itemTitle: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '600',
  },
  itemDesc: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
    lineHeight: 18,
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevron: {
    fontSize: 22,
    color: colors.textMuted,
    fontWeight: '300',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeActive: {
    backgroundColor: `${colors.success}15`,
  },
  badgeInactive: {
    backgroundColor: `${colors.textMuted}15`,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeTextActive: {
    color: colors.success,
  },
  badgeTextInactive: {
    color: colors.textMuted,
  },
});