import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from './types';

import { AuditLogScreen } from '../screens/admin/AuditLogScreen';
import { AccountStatusManagementScreen } from '../screens/admin/AccountStatusManagementScreen';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export const AdminStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AuditLogs"
      screenOptions={{
        headerStyle: { backgroundColor: '#FFD700' }, // Gold header for admin screens
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
