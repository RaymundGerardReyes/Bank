import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { AuthNavigator } from '../navigation/AuthNavigator';
import { MainTabNavigator } from '../navigation/MainTabNavigator';
import { SessionGuard } from '../security/SessionGuard';

export const RootNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return (
    <SessionGuard>
      <MainTabNavigator />
    </SessionGuard>
  );
};
