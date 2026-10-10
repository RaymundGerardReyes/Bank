import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountListScreen } from '../screens/accounts/AccountListScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { NotificationsScreen } from '../screens/dashboard/NotificationsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { TransferFormScreen } from '../screens/transfers/TransferFormScreen';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const getTabIcon = (routeName: keyof MainTabParamList, focused: boolean) => {
  if (routeName === 'Accounts') return focused ? 'wallet' : 'wallet-outline';
  if (routeName === 'Transfers') return focused ? 'swap-horizontal' : 'swap-horizontal-outline';
  if (routeName === 'Notifications') return focused ? 'notifications' : 'notifications-outline';
  if (routeName === 'Profile') return focused ? 'person' : 'person-outline';
  return focused ? 'home' : 'home-outline';
};

export const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.label,
        tabBarIconStyle: styles.icon,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 58 + Math.max(insets.bottom, spacing.sm),
            paddingBottom: Math.max(insets.bottom, spacing.sm),
          },
        ],
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={getTabIcon(route.name as keyof MainTabParamList, focused)}
            size={22}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Accounts" component={AccountListScreen} />
      <Tab.Screen name="Transfers" component={TransferFormScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ tabBarLabel: 'Alerts' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 0,
    shadowOpacity: 0,
    paddingTop: spacing.xs,
  },
  icon: {
    marginTop: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    fontWeight: typography.fontWeight.semibold,
  },
});
