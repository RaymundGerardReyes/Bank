import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';

import { AdminStackNavigator } from '../navigation/AdminStackNavigator';
import { AuthNavigator } from '../navigation/AuthNavigator';
import { MainStackNavigator } from '../navigation/MainStackNavigator';
import { SessionGuard } from '../security/SessionGuard';
import { RootState } from '../state/store';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="App">
          {() => (
            <SessionGuard>
              {user?.role === 'ADMIN' ? (
                <AdminStackNavigator />
              ) : (
                <MainStackNavigator />
              )}
            </SessionGuard>
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};