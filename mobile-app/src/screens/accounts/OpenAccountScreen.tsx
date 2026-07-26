import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { accountService } from '../../services/account/accountService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const OpenAccountScreen = () => {
  const [accountType, setAccountType] = React.useState('CHECKING');
  const [deposit, setDeposit] = React.useState('100');
  const [loading, setLoading] = React.useState(false);

  const handleOpen = async () => {
    setLoading(true);
    try {
      await accountService.openAccount(accountType, parseFloat(deposit));
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Open New Account</Text>
      <Input label="Account Type (CHECKING / SAVINGS)" value={accountType} onChangeText={setAccountType} />
      <Input label="Initial Deposit Amount" value={deposit} onChangeText={setDeposit} keyboardType="numeric" />
      <Button title="Open Account Now" onPress={handleOpen} loading={loading} />
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
});
