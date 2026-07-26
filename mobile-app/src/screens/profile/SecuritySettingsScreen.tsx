import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const SecuritySettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Security Controls</Text>
      <Button title="Manage Biometrics" onPress={() => {}} style={styles.item} />
      <Button title="Change Password / PIN" onPress={() => {}} style={styles.item} />
      <Button title="Set Panic / Duress PIN" onPress={() => {}} variant="secondary" style={styles.item} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  item: {
    marginBottom: spacing.md,
  },
});
