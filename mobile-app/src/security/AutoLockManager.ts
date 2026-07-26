import { store } from '../state/store';
import { setLocked } from '../state/authSlice';
import { ENV } from '../config/env';

let inactivityTimer: ReturnType<typeof setTimeout> | null = null;

export const AutoLockManager = {
  resetTimer: (): void => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      store.dispatch(setLocked(true));
    }, ENV.AUTO_LOCK_TIMEOUT_MS);
  },

  stopTimer: (): void => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
  },
};
