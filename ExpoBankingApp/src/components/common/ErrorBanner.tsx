import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

// Importing from your existing theme system
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [message, fadeAnim]);

  if (!message) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.message}>{message}</Text>
      
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton} accessibilityRole="button">
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  message: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.danger,
    fontWeight: typography.fontWeight.medium,
  },
  dismissButton: {
    paddingLeft: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dismissText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.danger,
  },
});

export default ErrorBanner;
