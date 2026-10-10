import * as SecureStore from 'expo-secure-store';
import { store } from '../state/store';
import { setLocked } from '../state/authSlice';
import { ENV } from '../config/env';

const AUTO_LOCK_STORAGE_KEY = 'novabank_auto_lock_timeout_ms';
let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
let currentTimeoutMs: number = ENV.AUTO_LOCK_TIMEOUT_MS;

// Initialize timeout from storage asynchronously
(async () => {
  try {
    const stored = await SecureStore.getItemAsync(AUTO_LOCK_STORAGE_KEY);
    if (stored) {
      currentTimeoutMs = parseInt(stored, 10);
    }
  } catch {
    // Keep default ENV.AUTO_LOCK_TIMEOUT_MS
  }
})();

export const AutoLockManager = {
  getTimeoutMs: async (): Promise<number> => {
    try {
      const stored = await SecureStore.getItemAsync(AUTO_LOCK_STORAGE_KEY);
      if (stored) {
        currentTimeoutMs = parseInt(stored, 10);
        return currentTimeoutMs;
      }
    } catch {
      // fallback
    }
    return currentTimeoutMs;
  },

  setTimeoutMs: async (timeoutMs: number): Promise<void> => {
    currentTimeoutMs = timeoutMs;
    try {
      await SecureStore.setItemAsync(AUTO_LOCK_STORAGE_KEY, timeoutMs.toString());
    } catch {
      // ignore
    }
    AutoLockManager.resetTimer();
  },

  resetTimer: (): void => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      store.dispatch(setLocked(true));
    }, currentTimeoutMs);
  },

  stopTimer: (): void => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
  },
};
