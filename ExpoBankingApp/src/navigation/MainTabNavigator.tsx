import { Ionicons } from '@expo/vector-icons'; // <-- Premium Icon Set
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountListScreen } from '../screens/accounts/AccountListScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { NotificationsScreen } from '../screens/dashboard/NotificationsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { TransferFormScreen } from '../screens/transfers/TransferFormScreen';
import { colors } from '../theme/colors';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  const insets = useSafeAreaInsets(); // Grabs exact Android Nav Bar height

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: false, // Cleaner look without text clutter
        tabBarStyle: {
          backgroundColor: colors.dominant,
          position: 'absolute',
          bottom: Math.max(insets.bottom, 16), // Elevate above Android Nav Bar
          left: 16,
          right: 16,
          height: 64,
          borderRadius: 32, // Perfect pill shape
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: any = 'home';
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Accounts') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'Transfers') iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          else if (route.name === 'Notifications') iconName = focused ? 'notifications' : 'notifications-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <Ionicons name={iconName} size={22} color={color} />
              {focused && <Text style={styles.label}>{route.name.substring(0, 4)}</Text>}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Accounts" component={AccountListScreen} />
      <Tab.Screen name="Transfers" component={TransferFormScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  iconActive: {
    backgroundColor: '#F0F9FF', // Subtle blue highlight
  },
  label: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
  }
});