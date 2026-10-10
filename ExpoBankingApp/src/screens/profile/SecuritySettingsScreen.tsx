import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAuth } from '../../hooks/useAuth';
import {
  faceEnrollmentService,
  EnrolledFaceMetadata,
} from '../../services/auth/faceEnrollmentService';
import { DuressPinHandler } from '../../security/DuressPinHandler';
import { AutoLockManager } from '../../security/AutoLockManager';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const StatusBadge = ({ status }: { status: string }) => {
  const isActive =
    status === 'ENABLED' ||
    status === 'ENROLLED' ||
    status === 'AVAILABLE' ||
    status === 'ACTIVE' ||
    status === 'CONFIGURED';
  return (
    <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeInactive]}>
      <Text style={[styles.badgeText, isActive ? styles.badgeTextActive : styles.badgeTextInactive]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
};

export const SecuritySettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [isFaceEnrolled, setIsFaceEnrolled] = React.useState<boolean>(false);
  const [faceMeta, setFaceMeta] = React.useState<EnrolledFaceMetadata | null>(null);
  const [hardwareBiometrics, setHardwareBiometrics] = React.useState<{
    hasHardware: boolean;
    isEnrolled: boolean;
    biometricTypes: string[];
  }>({
    hasHardware: false,
    isEnrolled: false,
    biometricTypes: [],
  });
  const [hasDuressPin, setHasDuressPin] = React.useState<boolean>(false);
  const [autoLockTimeoutMs, setAutoLockTimeoutMs] = React.useState<number>(300000);
  const [loading, setLoading] = React.useState<boolean>(true);

  const loadSecurityState = React.useCallback(async () => {
    try {
      setLoading(true);
      const email = user?.email || 'default_user';
      const [enrolled, meta, hw, duress, timeoutMs] = await Promise.all([
        faceEnrollmentService.isFaceEnrolled(email),
        faceEnrollmentService.getEnrolledFaceInfo(email),
        faceEnrollmentService.checkHardwareBiometrics(),
        DuressPinHandler.hasDuressPin(),
        AutoLockManager.getTimeoutMs(),
      ]);

      setIsFaceEnrolled(enrolled);
      setFaceMeta(meta);
      setHardwareBiometrics(hw);
      setHasDuressPin(duress);
      setAutoLockTimeoutMs(timeoutMs);
    } catch (e) {
      console.warn('Failed to load security state:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useFocusEffect(
    React.useCallback(() => {
      loadSecurityState();
    }, [loadSecurityState])
  );

  const handleFaceBiometricsPress = () => {
    navigation.navigate('FaceEnrollment');
  };

  const handleResetFaceEnrollment = () => {
    Alert.alert(
      'Remove Face Enrollment',
      'Are you sure you want to delete your stored face biometric profile? You will need to re-enroll before using Face ID login.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const email = user?.email || 'default_user';
            await faceEnrollmentService.deleteEnrolledFace(email);
            await loadSecurityState();
            Alert.alert('Face ID Removed', 'Your face biometric profile has been erased from this device.');
          },
        },
      ]
    );
  };

  const handleChangePin = () => {
    Alert.alert(
      'Primary Access PIN',
      'Your primary 6-digit PIN is verified during account activation. To rotate your primary PIN, an SMS/Email OTP verification step is required.',
      [{ text: 'OK' }]
    );
  };

  const handleDuressPin = () => {
    if (hasDuressPin) {
      Alert.alert(
        'Duress / Panic PIN',
        'Emergency duress PIN is currently configured on this device. Entering this PIN opens restricted safe-mode.',
        [
          { text: 'Keep PIN', style: 'cancel' },
          {
            text: 'Reconfigure PIN',
            onPress: async () => {
              await DuressPinHandler.setDuressPin('8888');
              await loadSecurityState();
              Alert.alert('Duress PIN Updated', 'Panic PIN updated to emergency code (8888).');
            },
          },
          {
            text: 'Remove Duress PIN',
            style: 'destructive',
            onPress: async () => {
              await DuressPinHandler.clearDuressPin();
              await loadSecurityState();
              Alert.alert('Removed', 'Duress PIN has been cleared.');
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Configure Duress / Panic PIN',
        'A duress PIN opens a restricted dummy safe-mode interface and quietly signals bank security under coercion. Would you like to activate emergency duress protection?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable Duress Protection',
            onPress: async () => {
              await DuressPinHandler.setDuressPin('9999');
              await loadSecurityState();
              Alert.alert(
                'Duress PIN Activated',
                'Emergency duress PIN enabled (default code: 9999). Entering this code at login activates safe mode.'
              );
            },
          },
        ]
      );
    }
  };

  const handleAutoLockTimeout = () => {
    Alert.alert(
      'Auto-Lock Inactivity Timeout',
      'Select how long the app can remain idle before locking:',
      [
        {
          text: '1 Minute',
          onPress: async () => {
            await AutoLockManager.setTimeoutMs(60000);
            await loadSecurityState();
          },
        },
        {
          text: '5 Minutes (Default)',
          onPress: async () => {
            await AutoLockManager.setTimeoutMs(300000);
            await loadSecurityState();
          },
        },
        {
          text: '15 Minutes',
          onPress: async () => {
            await AutoLockManager.setTimeoutMs(900000);
            await loadSecurityState();
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const formatTimeout = (ms: number): string => {
    const minutes = Math.round(ms / 60000);
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Security Controls</Text>
          <Text style={styles.subtitle}>
            Hardened device telemetry, biometrics, and cryptographic PIN protocols.
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Inspecting secure hardware...</Text>
          </View>
        ) : null}

        {/* Setting Item 1 - Face Recognition Biometrics */}
        <TouchableOpacity
          style={styles.settingItem}
          activeOpacity={0.7}
          onPress={handleFaceBiometricsPress}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="scan-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Face ID Biometrics</Text>
            <Text style={styles.itemDesc} numberOfLines={2}>
              {isFaceEnrolled
                ? `Enrolled profile (${faceMeta?.vectorLength || 512}D vector) • Tap to re-enroll or update`
                : 'No face enrolled yet. Tap to configure face recognition.'}
            </Text>
          </View>
          <View style={styles.rightAction}>
            <StatusBadge status={isFaceEnrolled ? 'Enrolled' : 'Not Set'} />
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Setting Item 2 - Device Native Biometrics */}
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="finger-print-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Hardware Biometrics</Text>
            <Text style={styles.itemDesc} numberOfLines={2}>
              {hardwareBiometrics.hasHardware
                ? (hardwareBiometrics.biometricTypes.join(', ') || 'System Biometric Sensor Active')
                : 'No hardware biometrics sensor detected'}
            </Text>
          </View>
          <View style={styles.rightAction}>
            <StatusBadge status={hardwareBiometrics.hasHardware ? 'Available' : 'Unavailable'} />
          </View>
        </View>

        {/* Setting Item 3 - Primary PIN */}
        <TouchableOpacity
          style={styles.settingItem}
          activeOpacity={0.7}
          onPress={handleChangePin}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="keypad-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Primary Access PIN</Text>
            <Text style={styles.itemDesc}>Standard 6-digit access and transfer PIN.</Text>
          </View>
          <View style={styles.rightAction}>
            <StatusBadge status="Active" />
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Setting Item 4 - Duress / Panic PIN */}
        <TouchableOpacity
          style={styles.settingItem}
          activeOpacity={0.7}
          onPress={handleDuressPin}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${colors.warning}15` }]}>
            <Ionicons name="warning-outline" size={24} color={colors.warning} />
          </View>
          <View style={styles.itemContent}>
            <Text style={[styles.itemTitle, { color: colors.warning }]}>Set Duress / Panic PIN</Text>
            <Text style={styles.itemDesc}>
              {hasDuressPin
                ? 'Active emergency panic code • Opens safe-mode'
                : 'Opens restricted safe-mode under coercion.'}
            </Text>
          </View>
          <View style={styles.rightAction}>
            <StatusBadge status={hasDuressPin ? 'Configured' : 'Not Set'} />
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Setting Item 5 - Auto-Lock Inactivity Timeout */}
        <TouchableOpacity
          style={styles.settingItem}
          activeOpacity={0.7}
          onPress={handleAutoLockTimeout}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="timer-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Auto-Lock Timeout</Text>
            <Text style={styles.itemDesc}>
              Locks app after {formatTimeout(autoLockTimeoutMs)} of inactivity.
            </Text>
          </View>
          <View style={styles.rightAction}>
            <StatusBadge status={formatTimeout(autoLockTimeoutMs)} />
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Face Reset Button if enrolled */}
        {isFaceEnrolled ? (
          <View style={styles.resetContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              activeOpacity={0.7}
              onPress={handleResetFaceEnrollment}
            >
              <Text style={styles.resetButtonText}>Remove Face Biometric Data</Text>
            </TouchableOpacity>
          </View>
        ) : null}
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
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 4,
    lineHeight: 20,
    fontWeight: '400',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 13,
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
    backgroundColor: `${colors.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  itemTitle: {
    color: colors.textPrimary,
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
  resetContainer: {
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  resetButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: `${colors.danger}15`,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.danger}30`,
  },
  resetButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
});