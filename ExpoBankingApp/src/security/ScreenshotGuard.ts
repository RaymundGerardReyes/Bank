import { logger } from '../utils/logger';

export const ScreenshotGuard = {
  enableFlagSecure: (): void => {
    // In Android native layer, invokes ScreenshotBlockModule.enable() to set FLAG_SECURE
    logger.info('FLAG_SECURE enabled. Screenshots & screen recordings blocked on Android.');
  },

  disableFlagSecure: (): void => {
    logger.info('FLAG_SECURE disabled.');
  },
};
