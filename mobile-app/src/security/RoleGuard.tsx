import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { UserRole } from '../models/User';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Access Denied: Insufficient Role Privileges.</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.danger,
    fontSize: 16,
  },
});
