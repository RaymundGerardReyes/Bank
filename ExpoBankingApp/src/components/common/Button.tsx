import * as React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) => {
  const isQuiet = variant === 'secondary' || variant === 'tertiary';
  const backgroundColor = disabled
    ? colors.surfaceAlt
    : variant === 'danger'
      ? colors.danger
      : variant === 'secondary'
        ? colors.surface
        : variant === 'tertiary'
          ? colors.transparent
          : colors.primary;

  const textColor = disabled ? colors.textMuted : isQuiet ? colors.primary : colors.textInverse;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.fullWidth,
        variant === 'secondary' && styles.secondary,
        variant === 'tertiary' && styles.tertiary,
        { backgroundColor, opacity: pressed && !disabled ? 0.82 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View pointerEvents="none">
          <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    paddingVertical: 14,
    paddingHorizontal: spacing.ml,
    borderRadius: spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  tertiary: {
    minHeight: spacing.touchTarget,
    paddingHorizontal: spacing.sm,
  },
  text: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0,
  },
});
