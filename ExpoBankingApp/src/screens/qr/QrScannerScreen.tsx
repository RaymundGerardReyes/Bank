import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  Code,
  isNativeCameraAvailable,
  isWorkletFrameProcessorSupported,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from '../../services/camera/visionCameraSafe';
import { Button } from '../../components/common/Button';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { ENV } from '../../config/env';
import { biometricAuthService } from '../../services/auth/biometricAuthService';
import { tokenStorageService } from '../../services/auth/tokenStorageService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCAN_AREA_SIZE = Math.min(Math.max(Math.floor(SCREEN_WIDTH * 0.68), 220), 300);

interface AuthIntentPayload {
  intentId: number;
  amount?: number;
  recipient?: string;
  currency?: string;
}

interface TransferQrPayload {
  accountNumber: string;
  amount?: number;
  accountName?: string;
  reference?: string;
}

export const QrScannerScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { hasPermission, requestPermission } = useCameraPermission();

  const [torch, setTorch] = React.useState<'on' | 'off'>('off');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [detectedAuthIntent, setDetectedAuthIntent] = React.useState<AuthIntentPayload | null>(null);
  const [isApproving, setIsApproving] = React.useState(false);

  const device = useCameraDevice('back');
  const isScanLockedRef = React.useRef(false);

  // Scanner Laser Animation
  const scanLineAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  React.useEffect(() => {
    const loopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: SCAN_AREA_SIZE - 4,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loopAnim.start();
    return () => loopAnim.stop();
  }, [scanLineAnim]);

  const mountAnim = React.useRef(new Animated.Value(0)).current;
  const cornerPulseAnim = React.useRef(new Animated.Value(0.6)).current;
  const qrFoundAnim = React.useRef(new Animated.Value(1)).current;

  // Mount animation
  React.useEffect(() => {
    Animated.timing(mountAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [mountAnim]);

  // Corner pulse
  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(cornerPulseAnim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(cornerPulseAnim, { toValue: 0.45, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [cornerPulseAnim]);

  // Parse QR Payload Helper
  const parseScannedValue = (raw: string): { type: 'AUTH' | 'TRANSFER' | 'UNKNOWN'; data?: any } => {
    const text = raw.trim();

    // 1. JSON Payload format
    if (text.startsWith('{') && text.endsWith('}')) {
      try {
        const json = JSON.parse(text);
        if (json.type === 'AUTH_INTENT' || json.intentId) {
          return {
            type: 'AUTH',
            data: {
              intentId: Number(json.intentId),
              amount: json.amount ? Number(json.amount) : undefined,
              recipient: json.recipient || json.destinationAccount,
              currency: json.currency || 'PHP',
            },
          };
        }
        if (json.accountNumber) {
          return {
            type: 'TRANSFER',
            data: {
              accountNumber: String(json.accountNumber),
              amount: json.amount ? Number(json.amount) : undefined,
              accountName: json.accountName || json.name,
              reference: json.reference || json.notes,
            },
          };
        }
      } catch (e) {
        // Fallback to URL parsing
      }
    }

    // 2. URI Scheme: munbank://authorize?intentId=123&amount=100&recipient=...
    if (text.startsWith('munbank://authorize') || text.includes('/authorize?intentId=')) {
      try {
        const queryPart = text.includes('?') ? text.split('?')[1] : '';
        const params = new URLSearchParams(queryPart);
        const intentId = Number(params.get('intentId'));
        if (intentId) {
          return {
            type: 'AUTH',
            data: {
              intentId,
              amount: params.get('amount') ? Number(params.get('amount')) : undefined,
              recipient: params.get('recipient') || undefined,
              currency: params.get('currency') || 'PHP',
            },
          };
        }
      } catch (e) {
        // Continue
      }
    }

    // 3. URI Scheme: munbank://transfer?dest=...&amount=...
    if (text.startsWith('munbank://transfer') || text.startsWith('qrph://')) {
      try {
        const queryPart = text.includes('?') ? text.split('?')[1] : '';
        const params = new URLSearchParams(queryPart);
        const dest = params.get('dest') || params.get('destination') || params.get('accountNumber');
        if (dest) {
          return {
            type: 'TRANSFER',
            data: {
              accountNumber: dest,
              amount: params.get('amount') ? Number(params.get('amount')) : undefined,
              accountName: params.get('name') || undefined,
              reference: params.get('ref') || undefined,
            },
          };
        }
      } catch (e) {
        // Continue
      }
    }

    // 4. Raw 16-digit or formatted account number (e.g., 4859 2223 4066 9478)
    const cleanedDigits = text.replace(/[\s-]/g, '');
    if (/^\d{10,20}$/.test(cleanedDigits)) {
      return {
        type: 'TRANSFER',
        data: {
          accountNumber: cleanedDigits,
        },
      };
    }

    return { type: 'UNKNOWN', data: text };
  };

  const handleCodeScanned = React.useCallback(
    (codes: Code[]) => {
      if (isScanLockedRef.current || codes.length === 0) return;
      const code = codes[0];
      if (!code.value) return;

      isScanLockedRef.current = true;
      setIsProcessing(true);

      const parsed = parseScannedValue(code.value);

      if (parsed.type === 'AUTH') {
        setIsProcessing(false);
        setDetectedAuthIntent(parsed.data);
        // QR found animation
        Animated.sequence([
          Animated.timing(qrFoundAnim, { toValue: 1.06, duration: 120, useNativeDriver: true }),
          Animated.timing(qrFoundAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
        ]).start();
      } else if (parsed.type === 'TRANSFER') {
        setIsProcessing(false);
        // QR found animation
        Animated.sequence([
          Animated.timing(qrFoundAnim, { toValue: 1.06, duration: 120, useNativeDriver: true }),
          Animated.timing(qrFoundAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
        ]).start();
        const { accountNumber, amount, accountName, reference } = parsed.data as TransferQrPayload;
        Alert.alert(
          'QR Transfer Detected',
          `Send transfer to ${accountName ? accountName + ' (' + accountNumber + ')' : accountNumber}${
            amount ? ' for ' + formatCurrency(amount, 'PHP') : ''
          }?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                isScanLockedRef.current = false;
              },
            },
            {
              text: 'Proceed to Transfer',
              onPress: () => {
                navigation.navigate('MainTabs', {
                  screen: 'Transfers',
                  params: {
                    destinationAccountNumber: accountNumber,
                    amount,
                    description: reference || 'QR Ph Instant Transfer',
                  },
                });
              },
            },
          ]
        );
      } else {
        setIsProcessing(false);
        Alert.alert(
          'Unrecognized QR Code',
          'The scanned QR code is neither a valid Passkey Authorization request nor a supported QR Ph / NovaBank recipient code.',
          [
            {
              text: 'OK',
              onPress: () => {
                isScanLockedRef.current = false;
              },
            },
          ]
        );
      }
    },
    [navigation]
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: handleCodeScanned,
  });

  // Approve Intent via Mobile Passkey / Biometrics
  const handleApproveIntent = async () => {
    if (!detectedAuthIntent) return;
    setIsApproving(true);

    try {
      // 1. Biometric Passkey Step-Up
      const displayAmount = detectedAuthIntent.amount
        ? formatCurrency(detectedAuthIntent.amount, detectedAuthIntent.currency || 'PHP')
        : 'the requested transaction';
      const prompt = `Authorize Passkey Approval for ${displayAmount} to ${detectedAuthIntent.recipient || 'Portal'}`;

      const bioSuccess = await biometricAuthService.authenticate(prompt);
      if (!bioSuccess) {
        Alert.alert('Authentication Cancelled', 'Biometric passkey confirmation was not completed.');
        setIsApproving(false);
        return;
      }

      // 2. Call Backend Approve Endpoint
      const token = await tokenStorageService.getAccessToken();
      if (!token) {
        Alert.alert('Session Expired', 'Please log in again to authorize transactions.');
        setIsApproving(false);
        return;
      }

      const response = await fetch(
        `${ENV.API_BASE_URL}/mobile/authorizations/${detectedAuthIntent.intentId}/approve`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setDetectedAuthIntent(null);
        Alert.alert(
          'Authorization Approved',
          'Your web portal transaction has been authorized successfully and is now executing.',
          [
            {
              text: 'Done',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert(
          'Authorization Failed',
          errorData.message || 'The authorization attempt may have expired or already completed.'
        );
        isScanLockedRef.current = false;
        setDetectedAuthIntent(null);
      }
    } catch (err: any) {
      Alert.alert('Network Error', err.message || 'Failed to submit authorization to the server.');
      isScanLockedRef.current = false;
    } finally {
      setIsApproving(false);
    }
  };

  const handleDenyIntent = async () => {
    if (!detectedAuthIntent) return;
    setIsApproving(true);
    try {
      const token = await tokenStorageService.getAccessToken();
      if (token) {
        await fetch(
          `${ENV.API_BASE_URL}/mobile/authorizations/${detectedAuthIntent.intentId}/deny`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setDetectedAuthIntent(null);
      Alert.alert('Authorization Denied', 'The transaction has been cancelled.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      setDetectedAuthIntent(null);
      navigation.goBack();
    } finally {
      setIsApproving(false);
    }
  };

  if (!hasPermission) {
    return (
      <SecureScreenWrapper style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={64} color={colors.primary} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionSub}>
          To scan QR Ph codes and authorize desktop transactions with Passkey pairing, please enable camera access.
        </Text>
        <Button
          title="Grant Permission"
          onPress={async () => {
            const res = await requestPermission();
            if (!res) Linking.openSettings();
          }}
          style={styles.permissionBtn}
        />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </SecureScreenWrapper>
    );
  }

  if (!device) {
    return (
      <SecureScreenWrapper style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.danger} />
        <Text style={styles.permissionTitle}>No Camera Detected</Text>
        <Text style={styles.permissionSub}>Unable to access the device rear camera.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} style={styles.permissionBtn} />
      </SecureScreenWrapper>
    );
  }

  return (
    <View style={styles.container}>
      {/* Vision Camera Fullscreen Viewfinder */}
      {isFocused && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isFocused && !detectedAuthIntent}
          codeScanner={codeScanner}
          torch={torch}
        />
      )}

      {/* Dimmed Overlay with Transparent Cutout Window */}
      <View style={styles.overlayContainer}>
        <View style={styles.overlayTop}>
          <View style={styles.navHeader}>
            <TouchableOpacity
              style={styles.iconCircleButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={24} color={colors.white} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Scan QR Code</Text>

            <TouchableOpacity
              style={[styles.iconCircleButton, torch === 'on' && styles.torchActive]}
              onPress={() => setTorch((prev) => (prev === 'on' ? 'off' : 'on'))}
              activeOpacity={0.8}
            >
              <Ionicons
                name={torch === 'on' ? 'flash' : 'flash-off'}
                size={22}
                color={torch === 'on' ? colors.warning : colors.white}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.instructionText}>
            Align QR Ph payment or desktop authorization QR code within the frame
          </Text>
        </View>

        <View style={styles.scanRow}>
          <View style={styles.overlaySide} />

          {/* Viewfinder Reticle Box */}
          <Animated.View style={[styles.scanWindow, { transform: [{ scale: qrFoundAnim }] }]}>
            {/* Viewfinder Corners */}
            <Animated.View style={[styles.corner, styles.cornerTL, { opacity: cornerPulseAnim }]} />
            <Animated.View style={[styles.corner, styles.cornerTR, { opacity: cornerPulseAnim }]} />
            <Animated.View style={[styles.corner, styles.cornerBL, { opacity: cornerPulseAnim }]} />
            <Animated.View style={[styles.corner, styles.cornerBR, { opacity: cornerPulseAnim }]} />

            {/* Scanning Laser Beam */}
            <Animated.View
              style={[
                styles.laserBeam,
                {
                  transform: [{ translateY: scanLineAnim }],
                },
              ]}
            />

            {isProcessing && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color={colors.white} />
                <Text style={styles.processingText}>Decoding...</Text>
              </View>
            )}
          </Animated.View>

          <View style={styles.overlaySide} />
        </View>

        <Animated.View style={[styles.overlayBottom, { opacity: mountAnim, transform: [{ translateY: mountAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <View style={styles.badgeRow}>
            <View style={styles.supportedBadge}>
              <Ionicons name="qr-code-outline" size={16} color={colors.white} />
              <Text style={styles.badgeText}>QR Ph Verified</Text>
            </View>
            <View style={styles.supportedBadge}>
              <Ionicons name="finger-print-outline" size={16} color={colors.white} />
              <Text style={styles.badgeText}>Passkey Pairing</Text>
            </View>
          </View>
          {!isWorkletFrameProcessorSupported() && (
            <Button
              title="Quick Test: Auto-Scan Demo QR"
              variant="secondary"
              onPress={() =>
                handleCodeScanned([
                  {
                    value:
                      '{"accountNumber":"4859222340669478","amount":500,"accountName":"Maria Santos","reference":"Demo Transfer"}',
                  },
                ])
              }
              style={{ marginHorizontal: 24, marginTop: 12 }}
            />
          )}
        </Animated.View>
      </View>

      {/* Modal Dialog for Passkey Authorization */}
      <Modal
        visible={!!detectedAuthIntent}
        transparent={true}
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderIcon}>
              <Ionicons name="finger-print" size={36} color={colors.primary} />
            </View>

            <View style={styles.modalBadge}>
              <Text style={styles.modalBadgeText}>USE PASSKEY TO AUTHORIZE</Text>
            </View>

            <Text style={styles.modalTitle}>Desktop Web Approval</Text>
            <Text style={styles.modalSub}>
              A live authorization request was scanned from your desktop web portal.
            </Text>

            <View style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transaction Intent</Text>
                <Text style={styles.detailValue}>#{detectedAuthIntent?.intentId}</Text>
              </View>
              {detectedAuthIntent?.amount !== undefined && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={[styles.detailValue, styles.detailAmount]}>
                    {formatCurrency(detectedAuthIntent.amount, detectedAuthIntent.currency || 'PHP')}
                  </Text>
                </View>
              )}
              {detectedAuthIntent?.recipient && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Recipient</Text>
                  <Text style={styles.detailValue}>{detectedAuthIntent.recipient}</Text>
                </View>
              )}
            </View>

            <View style={styles.modalActions}>
              <Button
                title={isApproving ? 'Verifying...' : 'Authorize with Biometrics'}
                onPress={handleApproveIntent}
                loading={isApproving}
                style={styles.approveBtn}
              />
              <Button
                title="Deny Transfer"
                variant="secondary"
                onPress={handleDenyIntent}
                disabled={isApproving}
                style={styles.denyBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.dominant,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  permissionSub: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  permissionBtn: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  cancelBtn: {
    padding: spacing.md,
  },
  cancelText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  overlayContainer: {
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(18, 49, 43, 0.75)',
    paddingTop: 48,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.md,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  iconCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchActive: {
    backgroundColor: 'rgba(168, 105, 18, 0.4)',
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },
  scanRow: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(18, 49, 43, 0.75)',
  },
  scanWindow: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: colors.primary,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderBottomRightRadius: 8,
  },
  laserBeam: {
    position: 'absolute',
    left: 6,
    right: 6,
    height: 3,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 2,
  },
  processingOverlay: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: 'rgba(18, 49, 43, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    color: colors.white,
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(18, 49, 43, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  supportedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 49, 43, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.dominant,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.xl,
    alignItems: 'center',
  },
  modalHeaderIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  modalBadge: {
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: colors.success,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: spacing.xs,
  },
  modalBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.success,
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  modalSub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.md,
  },
  detailsBox: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  detailAmount: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  modalActions: {
    width: '100%',
    gap: spacing.sm,
  },
  approveBtn: {
    width: '100%',
  },
  denyBtn: {
    width: '100%',
    borderColor: colors.danger,
  },
});
