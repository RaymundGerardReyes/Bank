import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from './types';

import { AuditLogScreen } from '../screens/admin/AuditLogScreen';
import { AccountStatusManagementScreen } from '../screens/admin/AccountStatusManagementScreen';

import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export const AdminStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AuditLogs"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.bold,
          color: colors.textPrimary,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="AuditLogs" 
        component={AuditLogScreen} 
        options={{ title: 'Audit Logs' }} 
      />
      <Stack.Screen 
        name="AccountStatusManagement" 
        component={AccountStatusManagementScreen} 
        options={{ title: 'Manage Accounts' }} 
      />
    </Stack.Navigator>
  );
};
