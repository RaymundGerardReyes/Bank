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
  const { sourceAccountNumber, destinationAccountNumber, amount, description, idempotencyKey } = route.params || {};

  // Formats PANs cleanly for reading
  const displaySource = sourceAccountNumber?.match(/.{1,4}/g)?.join(' ') || sourceAccountNumber;
  const displayDest = destinationAccountNumber?.match(/.{1,4}/g)?.join(' ') || destinationAccountNumber;

  return (
    <SecureScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Review Transfer</Text>
        <Text style={styles.subtitle}>Verify details before biometric authorization.</Text>
      </View>

      <View style={styles.receiptCard}>
        <View style={styles.row}>
          <Text style={styles.label}>From Account</Text>
          <Text style={styles.value}>{displaySource}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>To Account</Text>
          <Text style={styles.value}>{displayDest}</Text>
        </View>
        {description ? (
          <View style={styles.row}>
            <Text style={styles.label}>Memo</Text>
            <Text style={styles.value}>{description}</Text>
          </View>
        ) : null}

        <View style={styles.dashedDivider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{formatCurrency(amount, 'USD')}</Text>
        </View>
      </View>

      <Text style={styles.idempotencyText}>Trace Ref: {idempotencyKey?.split('-')[0]}</Text>

      <View style={styles.footer}>
        <Button title="Authorize with Passkey" onPress={() => navigation.navigate('TransferConfirm', route.params)} />
      </View>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dominant },
  header: { padding: spacing.lg, marginTop: spacing.md, marginBottom: spacing.sm },
  title: { color: colors.accent, fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: colors.textSecondary, fontSize: 15, fontWeight: '600', marginTop: 4 },
  receiptCard: { marginHorizontal: spacing.lg, backgroundColor: colors.surface, padding: spacing.xl, borderRadius: spacing.borderRadius.lg, borderWidth: 1, borderColor: `${colors.secondary}40` },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  label: { color: colors.textSecondary, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { color: colors.accent, fontSize: 14, fontWeight: '800' },
  dashedDivider: { height: 1, borderWidth: 1, borderColor: colors.secondary, borderStyle: 'dashed', marginVertical: spacing.lg, opacity: 0.4 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: colors.accent, fontSize: 16, fontWeight: '900' },
  totalValue: { color: colors.accent, fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  idempotencyText: { color: colors.textMuted, fontSize: 10, textAlign: 'center', marginTop: spacing.xl, fontFamily: 'monospace', fontWeight: '700' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, backgroundColor: colors.dominant, borderTopWidth: 1, borderColor: `${colors.secondary}30` },
});