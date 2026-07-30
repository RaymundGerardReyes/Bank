import React, { useEffect } from 'react';
import { pushNotificationService } from '../services/notification/pushNotificationService';
import { AppProviders } from './AppProviders';
import { RootNavigator } from './RootNavigator';

export const App = () => {
  // Mount the FCM listeners immediately upon application boot
  useEffect(() => {
    pushNotificationService.initialize();
  }, []);

  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
};

export default App;