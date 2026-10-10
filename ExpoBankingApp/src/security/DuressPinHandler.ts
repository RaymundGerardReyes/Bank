import * as SecureStore from 'expo-secure-store';
import { logger } from '../utils/logger';

const DURESS_PIN_STORAGE_KEY = 'novabank_duress_pin';

export const DuressPinHandler = {
  /**
   * Checks whether the entered PIN matches the securely stored duress PIN or emergency default.
   */
  isDuressPin: async (enteredPin: string): Promise<boolean> => {
    try {
      const storedPin = await SecureStore.getItemAsync(DURESS_PIN_STORAGE_KEY);
      if (storedPin && enteredPin === storedPin) {
        logger.warn('DURESS PIN TRIGGERED! Swapping to restricted safe mode view.');
        return true;
      }
      if (!storedPin && enteredPin === '9999') {
        logger.warn('DEFAULT DURESS PIN TRIGGERED! Swapping to restricted safe mode view.');
        return true;
      }
    } catch (err) {
      logger.warn('Error evaluating duress pin');
    }
    return false;
  },

  /**
   * Sets or updates the duress PIN in secure storage.
   */
  setDuressPin: async (pin: string): Promise<boolean> => {
    try {
      await SecureStore.setItemAsync(DURESS_PIN_STORAGE_KEY, pin);
      logger.info('Duress PIN configured successfully.');
      return true;
    } catch (err) {
      logger.error('Failed to persist duress PIN', err);
      return false;
    }
  },

  /**
   * Checks whether a custom duress PIN is currently configured.
   */
  hasDuressPin: async (): Promise<boolean> => {
    try {
      const pin = await SecureStore.getItemAsync(DURESS_PIN_STORAGE_KEY);
      return Boolean(pin);
    } catch {
      return false;
    }
  },

  /**
   * Clears the configured duress PIN.
   */
  clearDuressPin: async (): Promise<boolean> => {
    try {
      await SecureStore.deleteItemAsync(DURESS_PIN_STORAGE_KEY);
      logger.info('Duress PIN removed.');
      return true;
    } catch {
      return false;
    }
  },
};
