import { createNavigationContainerRef } from '@react-navigation/native';
import { logger } from '../utils/logger';

// Creates a global reference to the React Navigation instance
export const navigationRef = createNavigationContainerRef<any>();

export const navigate = (name: string, params?: any) => {
    if (navigationRef.isReady()) {
        logger.info(`[NAVIGATION] FCM routing triggered. Navigating to ${name}...`);
        (navigationRef as any).navigate(name, params);
    } else {
        logger.warn('[NAVIGATION] Navigation ref not ready. Unable to route from FCM.');
    }
};