import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '../state/store';
import { ErrorBoundary } from './ErrorBoundary';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ErrorBoundary>
      <Provider store={store}>{children}</Provider>
    </ErrorBoundary>
  );
};
