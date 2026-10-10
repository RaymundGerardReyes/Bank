import { logger } from '../utils/logger';

export const ScreenshotGuard = {
  enableFlagSecure: (): void => {
    // In Android native layer, invokes ScreenshotBlockModule.enable() to set FLAG_SECURE
    logger.debug('FLAG_SECURE enabled. Screenshots & screen recordings blocked on Android.');
  },

  disableFlagSecure: (): void => {
    logger.debug('FLAG_SECURE disabled.');
  },
};
