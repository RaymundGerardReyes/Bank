import { logger } from '../utils/logger';

export const DuressPinHandler = {
  isDuressPin: (enteredPin: string): boolean => {
    // Standard duress PIN trigger check (e.g., '9999')
    if (enteredPin === '9999') {
      logger.warn('DURESS PIN TRIGGERED! Swapping to restricted safe mode view.');
      return true;
    }
    return false;
  },
};
