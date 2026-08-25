import { useState, useEffect } from 'react';

import { ENV } from '../config/env';

export interface PendingAuthorization {
  transactionIntentId: number;
  challenge: string;
  authType: string;
  ipAddress: string;
  amount: number;
  sourceAccount: string;
  destinationAccount: string;
  createdAt: string;
  expiresAt: string;
}

export function usePendingAuthorizations() {
  const [pendingAuths, setPendingAuths] = useState<PendingAuthorization[]>([]);
  const [loading, setLoading] = useState(false);

  // Poll for pending authorizations every 3 seconds
  useEffect(() => {
    const fetchPending = async () => {
      try {
        // In a real app, this would use a secure fetch with Bearer token
        const response = await fetch(`${ENV.API_BASE_URL}/mobile/authorizations/pending`, {
          headers: {
            'Authorization': 'Bearer ' + 'MOCK_TOKEN' // Using mock or stored token
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setPendingAuths(data.data);
          }
        }
      } catch (e) {
        console.debug("Error fetching pending authorizations", e);
      }
    };

    const interval = setInterval(fetchPending, 3000);
    fetchPending(); // Initial fetch
    
    return () => clearInterval(interval);
  }, []);

  const approveAuthorization = async (intentId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${ENV.API_BASE_URL}/mobile/authorizations/${intentId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + 'MOCK_TOKEN'
        }
      });
      if (response.ok) {
        // Remove from list
        setPendingAuths(prev => prev.filter(a => a.transactionIntentId !== intentId));
        return true;
      }
    } catch (e) {
      console.error("Failed to approve authorization", e);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return { pendingAuths, approveAuthorization, loading };
}
