import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePendingAuthorizations } from '../../hooks/usePendingAuthorizations';
import { biometricAuthService } from '../../services/auth/biometricAuthService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const PushAuthorizationModal: React.FC = () => {
  const { pendingAuths, approveAuthorization, denyAuthorization, loading } = usePendingAuthorizations();
  const [isVerifyingBiometrics, setIsVerifyingBiometrics] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);

  const request = pendingAuths.length > 0 ? pendingAuths[0] : null;

  // Countdown timer for challenge expiration
  useEffect(() => {
    if (!request) return;

    const expiresAtMs = new Date(request.expiresAt).getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((expiresAtMs - now) / 1000));
      setSecondsRemaining(diffSec);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [request]);

  if (!request) return null;

  const handleApprove = async () => {
    setIsVerifyingBiometrics(true);
    try {
      // Step-Up Biometric Authentication
      const bioPassed = await biometricAuthService.authenticate(
        `Authorize payment of ₱${request.amount?.toFixed(2)} to ${request.destinationAccount}`
      );

      if (!bioPassed) {
        Alert.alert('Verification Failed', 'Biometric authentication was cancelled or could not be verified.');
        return;
      }

      const success = await approveAuthorization(request.transactionIntentId);
      if (!success) {
        Alert.alert('Authorization Error', 'Failed to approve request. Please check your network connection.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'An unexpected error occurred during authorization.');
    } finally {
      setIsVerifyingBiometrics(false);
    }
  };

  const handleDeny = async () => {
    Alert.alert(
      'Deny Authorization',
      'Are you sure you want to reject this request? The transaction on the web portal will be cancelled.',
      [
        { text: 'Back', style: 'cancel' },
        {
          text: 'Deny & Terminate',
          style: 'destructive',
          onPress: async () => {
            await denyAuthorization(request.transactionIntentId);
          },
        },
      ]
    );
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const isBusy = loading || isVerifyingBiometrics;

  return (
    <Modal visible={true} transparent={true} animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header Badge */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
            </View>
            <View style={styles.badgePill}>
              <View style={styles.liveDot} />
              <Text style={styles.badgeText}>WEBAUTH OOB REQUEST</Text>
            </View>
            <Text style={styles.title}>Authorize Transfer</Text>
            <Text style={styles.subtitle}>
              A session on NovaBank Web Portal is requesting transaction authorization.
            </Text>
          </View>

          {/* Transaction Metadata Card */}
          <View style={styles.detailsContainer}>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Requested Amount</Text>
              <Text style={styles.amountValue}>₱{request.amount?.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.metaRow}>
              <Text style={styles.label}>From Account</Text>
              <Text style={styles.value} numberOfLines={1}>{request.sourceAccount}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.metaRow}>
              <Text style={styles.label}>To Recipient</Text>
              <Text style={styles.value} numberOfLines={1}>{request.destinationAccount}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.metaRow}>
              <Text style={styles.label}>Request Origin</Text>
              <View style={styles.ipContainer}>
                <Ionicons name="globe-outline" size={12} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.ipValue}>{request.ipAddress || 'Web Client'}</Text>
              </View>
            </View>
            <View style={styles.divider} />

            <View style={styles.metaRow}>
              <Text style={styles.label}>Expires In</Text>
              <View style={[styles.timerPill, secondsRemaining < 60 && styles.timerPillUrgent]}>
                <Ionicons
                  name="time-outline"
                  size={12}
                  color={secondsRemaining < 60 ? colors.danger : colors.primary}
                  style={{ marginRight: 3 }}
                />
                <Text style={[styles.timerText, secondsRemaining < 60 && styles.timerTextUrgent]}>
                  {formatTimer(secondsRemaining)}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.approveButton, isBusy && styles.buttonDisabled]}
              onPress={handleApprove}
              disabled={isBusy}
              activeOpacity={0.8}
            >
              {isBusy ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name="finger-print-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.approveButtonText}>Confirm & Authorize</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.denyButton, isBusy && styles.buttonDisabled]}
              onPress={handleDeny}
              disabled={isBusy}
              activeOpacity={0.7}
            >
              <Text style={styles.denyButtonText}>Deny & Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 44, 89, 0.65)', // High-contrast navy overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  card: {
    backgroundColor: '#FFFFFF', // 60% dominant
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#0F2C59',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight, // #E0F2FE
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary, // #0F2C59
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  amountRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    maxWidth: '55%',
    textAlign: 'right',
  },
  ipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ipValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timerPillUrgent: {
    backgroundColor: '#FEE2E2',
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  timerTextUrgent: {
    color: colors.danger,
  },
  actions: {
    flexDirection: 'column',
    gap: 10,
  },
  approveButton: {
    backgroundColor: colors.primary, // 10% accent #0F2C59
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  denyButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  denyButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
});