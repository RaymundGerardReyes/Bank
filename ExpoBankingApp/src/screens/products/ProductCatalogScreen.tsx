import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { Product } from '../../models/Product';
import { useGetProductsQuery } from '../../state/api/productApi';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    productCode: 'SAVINGS_HIGH_YIELD',
    name: 'High-Yield Savings',
    type: 'SAVINGS',
    interestRate: 4.5,
    active: true,
    description: 'Grow your reserves with compound daily interest. FDIC insured with instant liquidity.',
  },
  {
    id: 2,
    productCode: 'CHECKING_ENTERPRISE',
    name: 'Everyday Checking',
    type: 'CHECKING',
    interestRate: 0.05,
    active: true,
    description: 'Day-to-day liquidity account with zero minimum balance, fee-free debit card, and free ACH.',
  },
  {
    id: 3,
    productCode: 'INVESTMENT_MONEY_MARKET',
    name: 'Prime Money Market',
    type: 'INVESTMENT',
    interestRate: 5.15,
    active: true,
    description: 'Institutional treasury grade yields with automated cash sweep and check-writing privileges.',
  },
  {
    id: 4,
    productCode: 'CD_12_MONTH',
    name: '12-Month Fixed Term CD',
    type: 'SAVINGS',
    interestRate: 4.85,
    active: true,
    description: 'Lock in a fixed return for 12 months with guaranteed yield backed by federal insurance.',
  },
];

export const ProductCatalogScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { data, isLoading, refetch } = useGetProductsQuery();
  const [selectedFilter, setSelectedFilter] = React.useState<'ALL' | 'SAVINGS' | 'CHECKING' | 'INVESTMENT'>('ALL');
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (refetch) await refetch();
    setRefreshing(false);
  };

  const rawProducts = data?.data && data.data.length > 0 ? data.data : FALLBACK_PRODUCTS;

  const filteredProducts = React.useMemo(() => {
    if (selectedFilter === 'ALL') return rawProducts;
    return rawProducts.filter((p) => p.type === selectedFilter);
  }, [rawProducts, selectedFilter]);

  const mapProductToAccountType = (prod: Product) => {
    if (prod.type === 'SAVINGS') return 'SAVINGS';
    if (prod.type === 'INVESTMENT') return 'INVESTMENT';
    return 'CHECKING';
  };

  return (
    <SecureScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Bank Products & Rates</Text>
          <Text style={styles.subtitle}>
            Competitive APYs and FDIC-insured treasury solutions for personal and enterprise banking.
          </Text>
        </View>

        {/* Category Filters */}
        <View style={styles.filterRow}>
          {(['ALL', 'SAVINGS', 'CHECKING', 'INVESTMENT'] as const).map((cat) => {
            const isSelected = selectedFilter === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedFilter(cat)}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                  {cat === 'ALL' ? 'All Plans' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Fetching published rate card...</Text>
          </View>
        ) : (
          <View style={styles.cardsList}>
            {filteredProducts.map((prod) => (
              <View key={prod.productCode} style={styles.productCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Text style={styles.productName}>{prod.name}</Text>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{prod.type}</Text>
                    </View>
                  </View>
                  <View style={styles.rateContainer}>
                    <Text style={styles.rateValue}>{prod.interestRate}%</Text>
                    <Text style={styles.rateLabel}>APY</Text>
                  </View>
                </View>

                <Text style={styles.productDesc}>{prod.description}</Text>

                <View style={styles.perksList}>
                  <View style={styles.perkItem}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                    <Text style={styles.perkText}>FDIC Insured Protection</Text>
                  </View>
                  <View style={styles.perkItem}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                    <Text style={styles.perkText}>Zero Monthly Maintenance Fee</Text>
                  </View>
                  <View style={styles.perkItem}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                    <Text style={styles.perkText}>Instant Digital Account Issuance</Text>
                  </View>
                </View>

                <Button
                  title="Open This Account"
                  onPress={() =>
                    navigation.navigate('OpenAccount', {
                      productType: mapProductToAccountType(prod),
                    })
                  }
                  style={styles.openBtn}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dominant,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.accent,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  filterTextActive: {
    color: colors.dominant,
  },
  loadingBox: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.md,
  },
  cardsList: {
    gap: spacing.lg,
  },
  productCard: {
    backgroundColor: colors.dominant,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  cardHeaderLeft: {
    flex: 1,
    paddingRight: 8,
  },
  productName: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  typeBadgeText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rateContainer: {
    alignItems: 'flex-end',
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  rateValue: {
    color: colors.success,
    fontSize: 20,
    fontWeight: '900',
  },
  rateLabel: {
    color: colors.success,
    fontSize: 9,
    fontWeight: '800',
  },
  productDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginVertical: spacing.sm,
  },
  perksList: {
    gap: 4,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: spacing.md,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  perkText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  openBtn: {
    borderRadius: spacing.borderRadius.md,
    paddingVertical: 14,
  },
});

