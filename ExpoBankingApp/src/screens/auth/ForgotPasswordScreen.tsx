import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { Input } from '../../components/common/Input';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isSent, setIsSent] = React.useState(false);

  const handleSendReset = async () => {
    setError('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your registered email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // Simulate/Trigger reset flow
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsSent(true);
    } catch {
      setError('Unable to send password reset request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <SecureScreenWrapper style={styles.container}>
        <View style={styles.centeredContent}>
          <View style={styles.successIconBg}>
            <Ionicons name="mail-unread-outline" size={54} color={colors.accent} />
          </View>
          <Text style={styles.successTitle}>Instructions Dispatched</Text>
          <Text style={styles.successDesc}>
            If an account matches <Text style={{ fontWeight: '700', color: colors.accent }}>{email}</Text>, you will receive a cryptographically signed password reset link shortly.
          </Text>

          <View style={styles.securityTipCard}>
            <Ionicons name="shield-checkmark" size={20} color={colors.accent} style={{ marginRight: 8 }} />
            <Text style={styles.securityTipText}>
              Security Notice: Reset tokens expire in 15 minutes. NovaBank staff will never ask for your recovery link or password.
            </Text>
          </View>

          <Button
            title="Return to Sign In"
            onPress={() => navigation.navigate('Login')}
            style={styles.returnBtn}
          />
        </View>
      </SecureScreenWrapper>
    );
  }

  return (
    <SecureScreenWrapper style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={colors.accent} />
            <Text style={styles.backBtnText}>Back to Sign In</Text>
          </TouchableOpacity>

          {/* Header Branding */}
          <View style={styles.headerContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="key-outline" size={36} color={colors.accent} />
            </View>
            <Text style={styles.title}>Account Recovery</Text>
            <Text style={styles.subtitle}>
              Enter your corporate email address to receive secure recovery credentials.
            </Text>
          </View>

          {error ? <ErrorBanner message={error} onDismiss={() => setError('')} /> : null}

          {/* Form Card */}
          <View style={styles.formCard}>
            <Input
              label="Registered Corporate Email"
              placeholder="e.g. employee@novabank.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />

            <Button
              title="Send Recovery Link"
              onPress={handleSendReset}
              loading={loading}
              style={styles.submitBtn}
            />
          </View>

          <View style={styles.footerHelp}>
            <Text style={styles.footerHelpText}>Need corporate assistance? Contact security desk at</Text>
            <Text style={styles.footerHelpEmail}>support@novabank.com</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    flexGrow: 1,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  backBtnText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    color: colors.accent,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
    paddingHorizontal: spacing.md,
  },
  formCard: {
    backgroundColor: colors.dominant,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  submitBtn: {
    borderRadius: spacing.borderRadius.md,
    paddingVertical: 16,
    marginTop: spacing.md,
  },
  footerHelp: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  footerHelpText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  footerHelpEmail: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successIconBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  successTitle: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  successDesc: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  securityTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: spacing.xxl,
  },
  securityTipText: {
    flex: 1,
    color: '#92400E',
    fontSize: 12,
    lineHeight: 17,
  },
  returnBtn: {
    width: '100%',
  },
});

