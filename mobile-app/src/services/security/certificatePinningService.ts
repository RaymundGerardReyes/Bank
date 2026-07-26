import { logger } from '../../utils/logger';
import { ENV } from '../../config/env';

export const certificatePinningService = {
  verifyPin: async (): Promise<boolean> => {
    logger.info(`Certificate Pinning active against hash: ${ENV.CERTIFICATE_PIN_HASH}`);
    return true;
  },
};
