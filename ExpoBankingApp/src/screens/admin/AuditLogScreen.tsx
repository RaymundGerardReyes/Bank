import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RoleGuard } from '../../security/RoleGuard';
import { UserRole } from '../../models/User';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const AuditLogScreen = () => {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.TELLER]}>
      <View style={styles.container}>
        <Text style={styles.title}>System Audit Log</Text>
        <Text style={styles.log}>[ADMIN] Querying audit logs from /api/v1/admin/audit...</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  log: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
