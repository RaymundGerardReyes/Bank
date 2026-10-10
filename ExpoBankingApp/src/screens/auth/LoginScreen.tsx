import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { Input } from '../../components/common/Input';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'We could not sign you in with those credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandSection}>
            <View style={styles.brandMark}>
              <Ionicons name="shield-checkmark-outline" size={30} color={colors.primary} />
            </View>
            <Text style={styles.brandName}>NovaBank</Text>
            <Text style={styles.brandCopy}>Private mobile banking for verified clients.</Text>
          </View>

          <View style={styles.formPanel}>
            <Text style={styles.formTitle}>Sign in</Text>
            <Text style={styles.formSubtitle}>Use your registered credentials to access your accounts.</Text>

            {error ? <ErrorBanner message={error} onDismiss={() => setError(null)} /> : null}

            <Input
              label="Email address"
              placeholder="name@example.com"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="username"
            />

            <Input
              label="Password"
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              textContentType="password"
            />

            <View style={styles.formUtilityRow}>
              <TouchableOpacity
                onPress={() => setShowPassword((value) => !value)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Text style={styles.utilityLink}>{showPassword ? 'Hide password' : 'Show password'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
              >
                <Text style={styles.utilityLink}>Forgot password</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Sign in securely"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              style={styles.signInButton}
            />

            <TouchableOpacity
              style={styles.faceIdButton}
              activeOpacity={0.82}
              onPress={() => navigation.navigate('FaceVerification')}
              accessibilityRole="button"
              accessibilityLabel="Sign in with Face ID"
            >
              <Ionicons name="scan-outline" size={20} color={colors.primary} />
              <Text style={styles.faceIdText}>Use Face ID</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>Protected by device security and encrypted transport.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screen,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brandMark: {
    width: 64,
    height: 64,
    borderRadius: spacing.borderRadius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  brandName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.hero,
    lineHeight: typography.lineHeight.hero,
    fontWeight: typography.fontWeight.heavy,
    textAlign: 'center',
  },
  brandCopy: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  formPanel: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.ml,
    ...shadows.subtle,
  },
  formTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
    fontWeight: typography.fontWeight.heavy,
  },
  formSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  formUtilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  utilityLink: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  signInButton: {
    marginTop: spacing.xs,
  },
  faceIdButton: {
    minHeight: 50,
    marginTop: spacing.ms,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  faceIdText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

export default LoginScreen;
