import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { navigationRef } from '../navigation/navigationUtils'; // <-- IMPORT REF
import { store } from '../state/store';
import { ErrorBoundary } from './ErrorBoundary';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SafeAreaProvider>
          {/* Attach the global ref to the NavigationContainer */}
          <NavigationContainer ref={navigationRef}>
            {children}
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
};