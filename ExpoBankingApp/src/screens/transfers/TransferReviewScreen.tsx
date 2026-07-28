import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';

export const TransferReviewScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  // Extract the dynamic data passed from the Form Screen
  const { sourceAccountNumber, destinationAccountNumber, amount, description, idempotencyKey } = route.params || {};

  const handleConfirmNavigate = () => {
    navigation.navigate('TransferConfirm', route.params);
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <Text style={styles.title}>Review Transfer</Text>
      <Text style={styles.warningText}>Please verify the details below before authorizing.</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>From Account:</Text>
          <Text style={styles.value}>{sourceAccountNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>To Account:</Text>
          <Text style={styles.value}>{destinationAccountNumber}</Text>
        </View>
        {description ? (
          <View style={styles.row}>
            <Text style={styles.label}>Memo:</Text>
            <Text style={styles.value}>{description}</Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>{formatCurrency(amount, 'USD')}</Text>
        </View>
      </View>

      <Text style={styles.idempotencyText}>Trace Ref: {idempotencyKey?.split('-')[0]}</Text>

      <Button
        title="Proceed to Biometric Authorization"
        onPress={handleConfirmNavigate}
        style={styles.btn}
      />
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.dominant,
  },
  title: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  warningText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.secondary,
    marginVertical: spacing.md,
  },
  totalLabel: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '800',
  },
  totalValue: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: '800',
  },
  idempotencyText: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  btn: {
    marginTop: 'auto',
  },
});