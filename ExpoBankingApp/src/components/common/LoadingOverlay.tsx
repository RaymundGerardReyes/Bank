import * as React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay = ({ visible, message = 'Processing...' }: LoadingOverlayProps) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={colors.textInverse} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18, 49, 43, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  message: {
    color: colors.textInverse,
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});
