import { rootDetectionService } from './rootDetectionService';
import { certificatePinningService } from './certificatePinningService';

export const deviceIntegrityService = {
  verifyEnvironment: async (): Promise<{ isSecure: boolean; reason?: string }> => {
    const isRooted = await rootDetectionService.isDeviceRooted();
    if (isRooted) {
      return { isSecure: false, reason: 'Device is rooted or jailbroken.' };
    }

    const isPinned = await certificatePinningService.verifyPin();
    if (!isPinned) {
      return { isSecure: false, reason: 'TLS Certificate pinning validation failed.' };
    }

    return { isSecure: true };
  },
};
