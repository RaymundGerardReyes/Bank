import { navigate } from '../../navigation/navigationUtils';
import { accountApi } from '../../state/api/accountApi';
import { transactionApi } from '../../state/api/transactionApi';
import { store } from '../../state/store';
import { logger } from '../../utils/logger';
import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const pushNotificationService = {
  initialize: async (): Promise<void> => {
    logger.info('Initializing Enterprise FCM Push Notification Architecture...');

    // =========================================================================
    // STEP 10: USER INTERACTION (App launched from background/quit state)
    // In a live build using @react-native-firebase/messaging, this maps to:
    // messaging().onNotificationOpenedApp(remoteMessage => { ... })
    // =========================================================================
    const handleNotificationInteraction = (remoteMessage: any) => {
      logger.info('[FCM] User tapped notification. Payload intercepted:', remoteMessage);

      // STEP 11: RETRIEVE LATEST DATA (Data Synchronization)
      // We instruct RTK Query to instantly drop its cache. 
      // The moment the screen mounts, it will fetch the fresh settled balances from Spring Boot.
      logger.info('[FCM] Invalidating local cache to retrieve latest banking data...');
      store.dispatch(transactionApi.util.invalidateTags(['Transactions']));
      store.dispatch(accountApi.util.invalidateTags(['Accounts']));

      // STEP 12: UPDATE THE INTERFACE (Deep Linking)
      // The backend sent { "route": "/transactions/history" } in the payload data
      const targetRoute = remoteMessage?.data?.route;

      if (targetRoute === '/transactions/history') {
        navigate('Transactions');
      } else if (targetRoute === '/notifications') {
        navigate('Notifications');
      }
    };

    // =========================================================================
    // FOREGROUND HANDLER (App is already open and running)
    // messaging().onMessage(async remoteMessage => { ... })
    // =========================================================================
    const handleForegroundMessage = (remoteMessage: any) => {
      logger.info('[FCM] Foreground notification received. Silent sync initiated.');
      // Silently sync data without interrupting the user's current flow
      store.dispatch(transactionApi.util.invalidateTags(['Transactions']));
      store.dispatch(accountApi.util.invalidateTags(['Accounts']));
    };

    // Note: Mock invocation of handlers for structural demonstration
    // handleNotificationInteraction({ data: { route: '/transactions/history' } });
  },

  // Step 1: Register the Device
  registerToken: async (): Promise<string> => {
    const mockFcmToken = `fcm_token_${Math.random().toString(36).substring(2, 15)}`;
    logger.info(`FCM Device Registration Token generated: ${mockFcmToken}`);
    return mockFcmToken;
  },

  // Step 2 & 3: Store and Associate Token
  syncTokenWithBackend: async (token: string): Promise<void> => {
    try {
      await apiClient.post(ENDPOINTS.CUSTOMERS.DEVICE_TOKEN, { fcmToken: token });
      logger.info('FCM Token securely transmitted and associated with enterprise backend.');
    } catch (error) {
      logger.error('Failed to sync FCM token with backend', error);
    }
  }
};