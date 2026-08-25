import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { usePendingAuthorizations, PendingAuthorization } from '../../hooks/usePendingAuthorizations';

export const PushAuthorizationModal: React.FC = () => {
  const { pendingAuths, approveAuthorization, loading } = usePendingAuthorizations();

  if (pendingAuths.length === 0) return null;

  const request = pendingAuths[0]; // Process one at a time

  const handleApprove = async () => {
    await approveAuthorization(request.transactionIntentId);
  };

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Authorize Transfer</Text>
          <Text style={styles.subtitle}>Please review the details to verify this was you.</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>Amount</Text>
              <Text style={styles.valueAmount}>₱{request.amount?.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>From Account</Text>
              <Text style={styles.value}>{request.sourceAccount}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>To Account</Text>
              <Text style={styles.value}>{request.destinationAccount}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>IP Address</Text>
              <Text style={styles.value}>{request.ipAddress}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Time Requested</Text>
              <Text style={styles.value}>{new Date(request.createdAt).toLocaleString()}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleApprove}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Confirm & Authorize</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  valueAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  }
});
