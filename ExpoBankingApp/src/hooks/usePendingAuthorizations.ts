import { useState, useEffect, useCallback } from 'react';
import { ENV } from '../config/env';
import { tokenStorageService } from '../services/auth/tokenStorageService';
import { pushNotificationService } from '../services/notification/pushNotificationService';

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

  const fetchPending = useCallback(async () => {
    try {
      const token = await tokenStorageService.getAccessToken();
      if (!token) {
        setPendingAuths([]);
        return;
      }

      const response = await fetch(`${ENV.API_BASE_URL}/mobile/authorizations/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setPendingAuths(data.data);
        }
      }
    } catch (e) {
      console.debug("Error fetching pending authorizations", e);
    }
  }, []);

  // Poll for pending authorizations every 3 seconds as fallback & listen for push
  useEffect(() => {
    fetchPending(); // Initial fetch
    const interval = setInterval(fetchPending, 3000);

    // Subscribe to real-time STOMP push notifications for instant wakeup
    const unsubscribe = pushNotificationService.addAuthRequestListener(() => {
      fetchPending();
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [fetchPending]);

  const approveAuthorization = async (intentId: number): Promise<boolean> => {
    setLoading(true);
    try {
      const token = await tokenStorageService.getAccessToken();
      if (!token) return false;

      const response = await fetch(`${ENV.API_BASE_URL}/mobile/authorizations/${intentId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
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

  const denyAuthorization = async (intentId: number): Promise<boolean> => {
    setLoading(true);
    try {
      const token = await tokenStorageService.getAccessToken();
      if (!token) return false;

      const response = await fetch(`${ENV.API_BASE_URL}/mobile/authorizations/${intentId}/deny`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        // Remove from list
        setPendingAuths(prev => prev.filter(a => a.transactionIntentId !== intentId));
        return true;
      }
    } catch (e) {
      console.error("Failed to deny authorization", e);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return { 
    pendingAuths, 
    approveAuthorization, 
    denyAuthorization, 
    refreshPending: fetchPending, 
    loading 
  };
}