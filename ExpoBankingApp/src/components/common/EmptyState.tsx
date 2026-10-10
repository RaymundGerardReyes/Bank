import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
  onActionPress?: () => void;
}

export const EmptyState = ({ title, message, icon, actionLabel, onAction, onActionPress }: EmptyStateProps) => (
  <View style={styles.container}>
    {icon ? (
      <View style={styles.iconMark}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
    ) : (
      <View style={styles.mark} />
    )}
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {actionLabel && (onAction || onActionPress) ? (
      <Button title={actionLabel} onPress={(onAction || onActionPress)!} variant="secondary" style={styles.action} />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  mark: {
    width: 36,
    height: 4,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: colors.accent,
    marginBottom: spacing.md,
  },
  iconMark: {
    width: 48,
    height: 48,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  action: {
    marginTop: spacing.lg,
  },
});
