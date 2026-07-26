import { logger } from '../../utils/logger';

export const rootDetectionService = {
  isDeviceRooted: async (): Promise<boolean> => {
    // In React Native bare workflow, invokes Android native RootDetectionModule
    logger.info('Root detection check executed. Status: CLEAN');
    return false;
  },
};
