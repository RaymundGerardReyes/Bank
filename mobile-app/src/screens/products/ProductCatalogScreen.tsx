import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGetProductsQuery } from '../../state/api/productApi';
import { Product } from '../../models/Product';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const ProductCatalogScreen = () => {
  const { data } = useGetProductsQuery();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bank Products & Rates</Text>
      {data?.data.map((prod: Product) => (
        <View key={prod.productCode} style={styles.card}>
          <Text style={styles.name}>{prod.name}</Text>
          <Text style={styles.rate}>{prod.interestRate}% Interest Rate</Text>
          <Text style={styles.desc}>{prod.description}</Text>
        </View>
      ))}
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
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  rate: {
    color: colors.accent,
    fontSize: 14,
    marginVertical: 2,
  },
  desc: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
