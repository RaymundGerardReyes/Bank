import { logger } from '../../utils/logger';

export const biometricAuthService = {
  isSupported: async (): Promise<boolean> => {
    // In React Native bare workflow, use react-native-biometrics
    return true;
  },
  authenticate: async (promptMessage: string = 'Authenticate to complete transaction'): Promise<boolean> => {
    logger.info(`Biometric prompt shown: ${promptMessage}`);
    // Simulate Android BiometricPrompt prompt
    return true;
  },
};
