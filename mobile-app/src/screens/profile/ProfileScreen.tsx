import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.role}>Role: {user?.role}</Text>
      <Button title="Sign Out" onPress={logout} variant="danger" style={styles.btn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  role: {
    color: colors.accent,
    fontSize: 14,
    marginBottom: spacing.xl,
  },
  btn: {
    marginTop: spacing.lg,
  },
});
