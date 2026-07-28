import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '../state/store';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './ErrorBoundary';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        {/* These two providers MUST wrap your navigation! */}
        <SafeAreaProvider>
          <NavigationContainer>
            {children}
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
};
