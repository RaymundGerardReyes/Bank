import notifee, { EventType } from '@notifee/react-native';
import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';

// 1. Legacy Root App Import (Proven to work based on your legacy file)
import App from './App';

// 2. Static ES6 Import for the Headless Task to bypass Metro's nullthrows bug
import DirectMessagingService from './src/services/notification/DirectMessagingService';

// 3. Register Headless Background STOMP Task safely
AppRegistry.registerHeadlessTask('DirectMessagingService', () => DirectMessagingService);

// 4. Register Notifee Background Event Listener
notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
        console.log('[NOTIFEE] User tapped notification in background', detail.notification);
        // Deep linking will automatically be handled when the UI boots and reads initial state
    }
});

// 5. Standard Expo Boot
registerRootComponent(App);