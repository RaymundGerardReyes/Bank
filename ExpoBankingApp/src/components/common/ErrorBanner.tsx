import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ErrorBannerProps {
  message?: string | null;
}

export const ErrorBanner = ({ message }: ErrorBannerProps) => {
  if (!message) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.danger,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.md,
    marginBottom: spacing.md,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
  },
});
