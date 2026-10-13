import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Easing, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { Button } from '../../components/common/Button';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAuth } from '../../hooks/useAuth';
import { faceEnrollmentService, EnrolledFaceMetadata } from '../../services/auth/faceEnrollmentService';
import { deviceCryptoService } from '../../services/auth/deviceCryptoService';
import { faceAuthService } from '../../services/auth/faceAuthService';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from '../../services/camera/visionCameraSafe';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RETICLE_SIZE = Math.min(Math.max(Math.floor(SCREEN_WIDTH * 0.72), 240), 320);

export const FaceEnrollmentScreen = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { hasPermission, requestPermission } = useCameraPermission();

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [existingEnrollment, setExistingEnrollment] = React.useState<EnrolledFaceMetadata | null>(null);
  const [stepMessage, setStepMessage] = React.useState('Center your face in the frame');

  const scanLineAnim = React.useRef(new Animated.Value(0)).current;
  const mountAnim = React.useRef(new Animated.Value(0)).current;
  const cornerPulseAnim = React.useRef(new Animated.Value(0.6)).current;
  const successFlashAnim = React.useRef(new Animated.Value(1)).current;
  const device = useCameraDevice('front');

  // Load existing enrollment status on mount
  React.useEffect(() => {
    const loadStatus = async () => {
      const info = await faceEnrollmentService.getEnrolledFaceInfo(user?.email);
      setExistingEnrollment(info);
    };
    loadStatus();
  }, [user?.email]);

  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // Mount animation
  React.useEffect(() => {
    Animated.timing(mountAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [mountAnim]);

  // Corner pulse animation
  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(cornerPulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cornerPulseAnim, {
          toValue: 0.5,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [cornerPulseAnim]);

  // Looping scanner laser animation
  React.useEffect(() => {
    const loopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: RETICLE_SIZE,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loopAnim.start();
    return () => loopAnim.stop();
  }, [scanLineAnim]);

  const handleCaptureAndEnroll = async () => {
    setIsProcessing(true);
    setStepMessage('Verifying biometric sensor...');

    try {
      // 1. Check native biometric availability
      const hw = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hw || !enrolled) {
        throw new Error('Biometric hardware is not available or no biometrics are enrolled on this device.');
      }

      // 2. Hardware biometric authorization prompt
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authorize device biometric registration',
        cancelLabel: 'Cancel',
      });

      if (!authResult.success) {
        throw new Error('Biometric authorization was cancelled or failed.');
      }

      setStepMessage('Generating hardware-bound cryptographic key pair...');

      // 3. Generate device key pair
      const keyInfo = await deviceCryptoService.getOrCreateDeviceKey(user?.email);

      setStepMessage('Registering device credential with bank...');

      // 4. Register public key on backend under authenticated session
      const deviceModel = `${Platform.OS.toUpperCase()} Client (${Platform.Version})`;
      await faceAuthService.registerDevice(
        keyInfo.deviceId,
        keyInfo.publicKey,
        keyInfo.algorithm,
        deviceModel
      );

      // 5. Save local enrollment metadata
      const hardwareDesc = `Secure Hardware Key (${keyInfo.algorithm})`;
      const res = await faceEnrollmentService.enrollFace([], user?.email, hardwareDesc);
      setExistingEnrollment({
        enrolledAt: res.enrolledAt,
        email: user?.email,
        vectorLength: 512,
        hardwareType: hardwareDesc,
      });

      setStepMessage('Biometric enrollment complete!');

      Animated.sequence([
        Animated.timing(successFlashAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
        Animated.timing(successFlashAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();

      Alert.alert(
        'Face ID Registered',
        `Biometric device credential successfully registered with banking server.\n\nEnrolled: ${new Date(
          res.enrolledAt
        ).toLocaleString()}`,
        [
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Enrollment Error', err.message || 'Failed to register biometric credential.');
      setStepMessage('Center your face in the frame');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteEnrollment = () => {
    Alert.alert(
      'Remove Face ID',
      'Are you sure you want to revoke and delete the registered biometric credential from this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const deviceId = await deviceCryptoService.getDeviceId();
              await faceAuthService.revokeDevice(deviceId);
            } catch (err) {
              console.log('[FaceEnrollment] Server revocation error:', err);
            }
            await deviceCryptoService.revokeLocalCredential(user?.email);
            await faceEnrollmentService.deleteEnrolledFace(user?.email);
            setExistingEnrollment(null);
            Alert.alert('Face ID Removed', 'Enrolled biometric device credential was revoked.');
          },
        },
      ]
    );
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      {/* Live Front Camera Stream */}
      {isFocused && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          facing="front"
          isActive={isFocused && !isProcessing}
        />
      )}

      {/* Mask Overlay with Cutout */}
      <View style={styles.overlay}>
        <View style={styles.overlayOpaque} />
        <View style={styles.overlayRow}>
          <View style={styles.overlayOpaque} />
          <Animated.View style={[styles.reticleContainer, { transform: [{ scale: successFlashAnim }] }]}>
            <View style={[styles.reticle, isProcessing && styles.reticleSuccess]} />
            {!isProcessing && (
              <Animated.View
                style={[styles.scanLine, { transform: [{ translateY: scanLineAnim }] }]}
              />
            )}
            <Animated.View style={[styles.corner, styles.cornerTL, { opacity: cornerPulseAnim }]} />
            <Animated.View style={[styles.corner, styles.cornerTR, { opacity: cornerPulseAnim }]} />
            <Animated.View style={[styles.corner, styles.cornerBL, { opacity: cornerPulseAnim }]} />
            <Animated.View style={[styles.corner, styles.cornerBR, { opacity: cornerPulseAnim }]} />
          </Animated.View>
          <View style={styles.overlayOpaque} />
        </View>
        <View style={styles.overlayOpaque} />
      </View>

      {/* UI Control Layer */}
      <Animated.View style={[styles.uiLayer, { opacity: mountAnim, paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Biometric Face ID</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.footer}>
          <View style={styles.statusBox}>
            {isProcessing ? (
              <ActivityIndicator size="small" color={colors.success} style={{ marginRight: 8 }} />
            ) : (
              <Ionicons
                name={existingEnrollment ? 'shield-checkmark' : 'scan-outline'}
                size={18}
                color={existingEnrollment ? colors.success : colors.white}
                style={{ marginRight: 8 }}
              />
            )}
            <Text style={styles.statusText}>{stepMessage}</Text>
          </View>

          {existingEnrollment && !isProcessing ? (
            <View style={styles.enrolledInfoCard}>
              <Text style={styles.enrolledTitle}>Active Face ID Enrollment</Text>
              <Text style={styles.enrolledMeta}>
                Registered: {new Date(existingEnrollment.enrolledAt).toLocaleDateString()} • {existingEnrollment.hardwareType || 'Device Key (ECDSA P-256)'}
              </Text>
            </View>
          ) : null}

          <Button
            title={
              isProcessing
                ? 'Processing Biometrics...'
                : existingEnrollment
                ? 'Re-enroll Face ID'
                : 'Capture & Enroll Face ID'
            }
            variant="primary"
            onPress={handleCaptureAndEnroll}
            loading={isProcessing}
            style={styles.enrollButton}
          />

          {existingEnrollment && !isProcessing ? (
            <Button
              title="Delete Enrolled Face ID"
              variant="secondary"
              onPress={handleDeleteEnrollment}
              style={styles.deleteButton}
            />
          ) : null}
        </View>
      </Animated.View>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  overlay: {
    ...(StyleSheet.absoluteFill as object),
    justifyContent: 'center',
  },
  overlayOpaque: {
    flex: 1,
    backgroundColor: 'rgba(18, 49, 43, 0.88)',
  },
  overlayRow: {
    flexDirection: 'row',
    height: RETICLE_SIZE,
  },
  reticleContainer: {
    width: RETICLE_SIZE,
    height: RETICLE_SIZE,
    position: 'relative',
  },
  reticle: {
    flex: 1,
    borderRadius: RETICLE_SIZE / 2,
    borderWidth: 2,
    borderColor: 'rgba(35, 122, 87, 0.5)',
    backgroundColor: 'transparent',
  },
  reticleSuccess: {
    borderColor: colors.success,
    backgroundColor: 'rgba(35, 122, 87, 0.18)',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: '10%',
    width: '80%',
    height: 3,
    backgroundColor: colors.success,
    borderRadius: 2,
    shadowColor: colors.success,
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: colors.success,
  },
  cornerTL: { top: -6, left: -6, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 },
  cornerTR: { top: -6, right: -6, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 },
  cornerBL: { bottom: -6, left: -6, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 },
  cornerBR: { bottom: -6, right: -6, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 },
  uiLayer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 49, 43, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  enrolledInfoCard: {
    backgroundColor: 'rgba(18, 49, 43, 0.85)',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.success}66`,
  },
  enrolledTitle: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
  },
  enrolledMeta: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  enrollButton: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  deleteButton: {
    width: '100%',
    backgroundColor: `${colors.danger}18`,
    borderColor: `${colors.danger}66`,
  },
});
