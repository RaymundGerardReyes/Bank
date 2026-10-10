import { NativeModules } from 'react-native';

export enum EventType {
  DISMISSED = 0,
  PRESS = 1,
  ACTION_PRESS = 2,
  DELIVERED = 3,
  TRIGGER_NOTIFICATION_CREATED = 4,
}

export enum AndroidImportance {
  UNKNOWN = 0,
  DEFAULT = 3,
  HIGH = 4,
  LOW = 2,
  MIN = 1,
  NONE = 0,
}

export interface NotificationChannel {
  id: string;
  name: string;
  importance?: AndroidImportance;
  [key: string]: any;
}

export interface NotificationPayload {
  title?: string;
  body?: string;
  data?: Record<string, any>;
  android?: any;
  ios?: any;
  [key: string]: any;
}

// Check whether the native Notifee module is available
const isNativeNotifeeAvailable = (): boolean => {
  try {
    return Boolean(
      NativeModules &&
      (NativeModules.NotifeeApiModule || NativeModules.Notifee)
    );
  } catch {
    return false;
  }
};

let realNotifee: any = null;

if (isNativeNotifeeAvailable()) {
  try {
    // Dynamically require only when native module exists so Expo Go never throws on import
    realNotifee = require('@notifee/react-native').default;
  } catch (err) {
    console.warn('[notifeeSafe] Failed to load real Notifee module, falling back to safe mock:', err);
    realNotifee = null;
  }
}

const mockNotifee = {
  requestPermission: async () => {
    return { authorizationStatus: 1 };
  },
  createChannel: async (channel: NotificationChannel) => {
    console.log('[Notifee SafeFallback] createChannel:', channel.id);
    return channel.id || 'default';
  },
  displayNotification: async (notification: NotificationPayload) => {
    console.log('[Notifee SafeFallback] displayNotification:', notification.title, '-', notification.body);
    return 'mock-notification-id';
  },
  onBackgroundEvent: (callback: (event: any) => Promise<void>) => {
    console.log('[Notifee SafeFallback] onBackgroundEvent listener registered');
    return () => {};
  },
  onForegroundEvent: (callback: (event: any) => void) => {
    console.log('[Notifee SafeFallback] onForegroundEvent listener registered');
    return () => {};
  },
  cancelNotification: async (id: string) => {},
  cancelAllNotifications: async () => {},
  getBadgeCount: async () => 0,
  setBadgeCount: async (count: number) => {},
};

const notifee = realNotifee || mockNotifee;

export default notifee;

