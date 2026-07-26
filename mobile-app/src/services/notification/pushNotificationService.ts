import { logger } from '../../utils/logger';

export const pushNotificationService = {
  initialize: async (): Promise<void> => {
    logger.info('FCM Push Notification listener initialized');
  },
  registerToken: async (): Promise<string> => {
    const mockFcmToken = 'fcm_mock_device_token_12345';
    logger.info(`FCM Device Token registered: ${mockFcmToken}`);
    return mockFcmToken;
  },
};
