import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

// Importing from your existing theme system
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

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
    // Uses your theme files, with standard fallback hex codes just in case
    backgroundColor: colors?.errorBackground || '#FEE2E2', 
    borderColor: colors?.error || '#EF4444',
    borderWidth: 1,
    borderRadius: spacing?.sm || 8,
    padding: spacing?.md || 16,
    marginBottom: spacing?.md || 16,
  },
  message: {
    flex: 1,
    ...(typography?.body || { fontSize: 14 }),
    color: colors?.errorText || '#B91C1C',
  },
  dismissButton: {
    paddingLeft: spacing?.sm || 8,
    paddingVertical: spacing?.xs || 4,
  },
  dismissText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors?.errorText || '#B91C1C',
  },
});

export default ErrorBanner;
