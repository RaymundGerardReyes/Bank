import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Text } from 'react-native';
import { MainTabParamList } from './types';

// Tab Screen Imports
import { AccountListScreen } from '../screens/accounts/AccountListScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { NotificationsScreen } from '../screens/dashboard/NotificationsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { TransferFormScreen } from '../screens/transfers/TransferFormScreen';

import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          paddingBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: colors.dominant,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          height: 65,
          paddingTop: 8,
        },
        tabBarIcon: ({ color }) => {
          let iconName = '🏠';
          if (route.name === 'Dashboard') iconName = '🏠';
          else if (route.name === 'Accounts') iconName = '🏦';
          else if (route.name === 'Transfers') iconName = '💸';
          else if (route.name === 'Notifications') iconName = '🔔';
          else if (route.name === 'Profile') iconName = '👤';

          return <Text style={{ fontSize: 20, color }}>{iconName}</Text>;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Accounts" component={AccountListScreen} options={{ title: 'Accounts' }} />
      <Tab.Screen name="Transfers" component={TransferFormScreen} options={{ title: 'Move Money' }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Alerts' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};