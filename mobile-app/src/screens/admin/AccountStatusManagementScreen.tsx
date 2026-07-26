import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RoleGuard } from '../../security/RoleGuard';
import { UserRole } from '../../models/User';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const AccountStatusManagementScreen = () => {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.TELLER]}>
      <View style={styles.container}>
        <Text style={styles.title}>Account Status Override</Text>
        <Text style={styles.info}>Freeze, Unfreeze, or Close accounts by Account Number.</Text>
      </View>
    </RoleGuard>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  info: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
