import notifee, { AndroidImportance } from '@notifee/react-native';
import { Client } from '@stomp/stompjs';
import { ENV } from '../../config/env';
import { tokenStorageService } from '../auth/tokenStorageService';

// FIX 1: Explicitly define the return type of the function as Promise<void>
export default async function DirectMessagingService(taskData: any): Promise<void> {
    console.log('[HEADLESS STOMP] Background messaging service awakened.');

    const token = await tokenStorageService.getAccessToken();
    if (!token) {
        console.warn('[HEADLESS STOMP] No auth token found. Terminating task.');
        return;
    }

    const userIdentifier = "user@example.com";

    const wsUrl = ENV.API_BASE_URL.replace('http', 'ws').replace('/api/v1', '/ws');

    const client = new Client({
        brokerURL: wsUrl,
        forceBinaryWSFrames: true,
        appendMissingNULLonIncoming: true,
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('[HEADLESS STOMP] Background socket securely established.');

            client.subscribe(`/topic/user_${userIdentifier}`, async (message) => {

                const payload = JSON.parse(message.body);
                console.log('[HEADLESS STOMP] Incoming background payload:', payload);

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
            console.error('[HEADLESS STOMP] Error:', frame.headers['message']);
        }
    });

    client.activate();

    // FIX 2: Explicitly cast the Promise as <void> to satisfy React Native's strict Task type
    return new Promise<void>(() => { });
}