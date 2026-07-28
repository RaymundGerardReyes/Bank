import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface SessionGuardProps {
  children: React.ReactNode;
}

export const SessionGuard = ({ children }: SessionGuardProps) => {
  const { isAuthenticated, isLocked } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Session expired. Please log in.</Text>
      </View>
    );
  }

  if (isLocked) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>App locked due to inactivity. Enter PIN or Biometrics.</Text>
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
    color: colors.textSecondary,
    fontSize: 16,
  },
});
