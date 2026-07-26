import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { authService } from '../../services/auth/authService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const OtpVerificationScreen = () => {
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      await authService.verifyOtp(code);
    } catch {
      // Handle OTP error
    } finally {
      setLoading(false);
    }
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <Text style={styles.title}>Two-Factor Authentication</Text>
      <Text style={styles.subtitle}>Enter the 6-digit OTP code sent to your registered mobile number.</Text>
      <Input
        label="OTP Verification Code"
        placeholder="123456"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
        maxLength={6}
      />
      <Button title="Verify OTP" onPress={handleVerify} loading={loading} />
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.lg,
  },
});
