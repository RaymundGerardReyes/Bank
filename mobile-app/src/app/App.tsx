import * as React from 'react';
import { AppProviders } from './AppProviders';
import { RootNavigator } from './RootNavigator';

export const App = () => {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
};

export default App;
