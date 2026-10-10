import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  }, [message, fadeAnim]);

  if (!message) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]} accessibilityRole="alert">
      <View style={styles.iconWrap}>
        <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
      </View>
      <Text style={styles.message}>{message}</Text>
      {onDismiss ? (
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.dismissButton}
          accessibilityRole="button"
          accessibilityLabel="Dismiss error"
        >
          <Ionicons name="close" size={18} color={colors.danger} />
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.dangerBg,
    borderColor: '#E9B7B1',
    borderWidth: 1,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  iconWrap: {
    marginRight: spacing.sm,
    marginTop: 1,
  },
  message: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    color: colors.danger,
    fontWeight: typography.fontWeight.medium,
  },
  dismissButton: {
    minWidth: spacing.touchTarget,
    minHeight: spacing.touchTarget,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: -spacing.sm,
    marginRight: -spacing.sm,
  },
});

export default ErrorBanner;
