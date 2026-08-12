import notifee, { AndroidImportance } from '@notifee/react-native';
import { Client } from '@stomp/stompjs';
import { ENV } from '../../config/env';
import { navigate } from '../../navigation/navigationUtils';
import { accountApi } from '../../state/api/accountApi';
import { transactionApi } from '../../state/api/transactionApi';
import { store } from '../../state/store';
import { logger } from '../../utils/logger';

let stompClient: Client | null = null;

export const pushNotificationService = {
  initialize: async (userIdentifier?: string): Promise<void> => {
    logger.info('Initializing Enterprise STOMP WebSocket connection...');
    await notifee.requestPermission();

    // Prevent duplicate connections by deactivating any hanging client
    if (stompClient && stompClient.connected) {
      await stompClient.deactivate();
    }

    const wsUrl = ENV.API_BASE_URL.replace('http', 'ws').replace('/api/v1', '/ws');

    stompClient = new Client({
      brokerURL: wsUrl,
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        logger.info('[STOMP] Connected securely to Spring Boot Broker.');

        // This dynamically targets the exact user who just logged in
        const topic = userIdentifier ? `/topic/user_${userIdentifier}` : '/topic/global';

        stompClient?.subscribe(topic, async (message) => {
          const payload = JSON.parse(message.body);
          logger.info('[STOMP] Real-time payload intercepted:', payload);

          // Force the UI to refresh immediately
          store.dispatch(transactionApi.util.invalidateTags(['Transactions']));
          store.dispatch(accountApi.util.invalidateTags(['Accounts']));

          // Throw the Native OS Push Banner
          const channelId = await notifee.createChannel({
            id: 'enterprise_alerts',
            name: 'Enterprise Security Alerts',
            importance: AndroidImportance.HIGH,
          });

          await notifee.displayNotification({
            title: payload.title,
            body: payload.body,
            data: { route: payload.route },
            android: {
              channelId,
              smallIcon: 'ic_launcher',
              pressAction: { id: 'default' },
            },
          });
        });
      },
      onStompError: (frame: any) => {
        logger.error('[STOMP] Broker reported error: ' + frame.headers['message']);
      }
    });

    stompClient.activate();

    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === 1 && detail.notification?.data?.route) {
        const targetRoute = detail.notification.data.route;
        if (targetRoute === '/transactions/history') navigate('Transactions');
        else if (targetRoute === '/notifications') navigate('Notifications');
      }
    });
  },

  disconnect: () => {
    if (stompClient) {
      stompClient.deactivate();
      logger.info('[STOMP] Disconnected from broker.');
    }
  }
};