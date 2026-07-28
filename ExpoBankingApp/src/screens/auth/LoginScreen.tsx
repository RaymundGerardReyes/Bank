import * as React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const LoginScreen = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Invalid credentials.');
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
        <View style={styles.headerContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>MB</Text>
          </View>
          <Text style={styles.title}>Mobile Banking</Text>
          <Text style={styles.subtitle}>Secure, Fast, and Reliable</Text>
        </View>

        <View style={styles.formContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <Input
            label="Email Address"
            placeholder="user@example.com"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            label="Password"
            placeholder="••••••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dominant, // 60% White
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    backgroundColor: colors.secondary, // 30% Soft Blue
    borderRadius: spacing.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    color: colors.accent, // 10% Deep Navy Text
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: colors.dominant,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.secondary, // 30% Soft Blue Border
  },
  title: {
    color: colors.accent, // 10% Deep Navy for High Contrast
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.secondary, // 30% Soft Blue for subtitles
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontWeight: '500',
  },
  button: {
    marginTop: spacing.md,
    backgroundColor: colors.accent, // 10% Deep Navy for primary action
  },
});

export default LoginScreen;