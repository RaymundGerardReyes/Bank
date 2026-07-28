import { useRoute } from '@react-navigation/native';
import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const StatementViewerScreen = () => {
  const route = useRoute<any>();
  const { statement } = route.params || {};

  return (
    <SecureScreenWrapper style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>Secure Document Viewer</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ENCRYPTED</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.documentFrame}>
          {/* Simulated PDF Watermark/Content */}
          <Text style={styles.watermark}>CONFIDENTIAL</Text>

          <View style={styles.docHeader}>
            <Text style={styles.bankName}>HARDBANK INC.</Text>
            <Text style={styles.docPeriod}>{statement?.statementPeriod || 'Account Statement'}</Text>
          </View>

          <View style={styles.docBody}>
            <Text style={styles.mockContent}>Account Number: {statement?.accountNumber}</Text>
            <Text style={styles.mockContent}>Date Range: {statement?.startDate} to {statement?.endDate}</Text>
            <View style={styles.mockDivider} />
            <Text style={styles.mockInfo}>
              This document is rendered securely in-memory. Download and sharing capabilities are disabled by policy to prevent unauthorized data extraction.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SecureScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F', // Deep navy background framing the document
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.accent,
    padding: spacing.lg,
    paddingTop: 60, // Adjust for notch
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  toolbarTitle: {
    color: colors.dominant,
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: colors.dominant,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scroll: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  documentFrame: {
    width: '100%',
    minHeight: 500,
    backgroundColor: colors.dominant, // 60% White "Paper"
    borderRadius: spacing.borderRadius.md,
    padding: spacing.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    fontSize: 48,
    color: colors.surface,
    fontWeight: '900',
    transform: [{ rotate: '-45deg' }],
    opacity: 0.5,
    zIndex: 0,
  },
  docHeader: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
    paddingBottom: spacing.md,
    marginBottom: spacing.lg,
    zIndex: 1,
  },
  bankName: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  docPeriod: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  docBody: {
    zIndex: 1,
  },
  mockContent: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  mockDivider: {
    height: 1,
    backgroundColor: colors.secondary,
    marginVertical: spacing.xl,
    opacity: 0.5,
  },
  mockInfo: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'justify',
  },
});