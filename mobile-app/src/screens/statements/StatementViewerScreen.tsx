import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const StatementViewerScreen = () => {
  return (
    <SecureScreenWrapper style={styles.container}>
      <Text style={styles.title}>PDF Statement Viewer</Text>
      <Text style={styles.info}>Rendering encrypted PDF stream directly in-memory...</Text>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  info: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
