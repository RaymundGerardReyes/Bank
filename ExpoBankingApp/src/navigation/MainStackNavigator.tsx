import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { MainStackParamList } from './types';

// Main Bottom Tab Bar
import { MainTabNavigator } from './MainTabNavigator';

// Flow & Detail Screen Imports
import { DeviceManagementScreen } from '../screens/profile/DeviceManagementScreen';
import { SecuritySettingsScreen } from '../screens/profile/SecuritySettingsScreen';
import { StatementListScreen } from '../screens/statements/StatementListScreen';
import { StatementViewerScreen } from '../screens/statements/StatementViewerScreen';
import { TransactionDetailScreen } from '../screens/transactions/TransactionDetailScreen';
import { TransactionHistoryScreen } from '../screens/transactions/TransactionHistoryScreen';
import { DepositScreen } from '../screens/transfers/DepositScreen';
import { TransferConfirmScreen } from '../screens/transfers/TransferConfirmScreen';
import { TransferReviewScreen } from '../screens/transfers/TransferReviewScreen';

import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: colors.dominant },
                headerTintColor: colors.accent,
                headerTitleStyle: { fontWeight: '800' },
                headerShadowVisible: false,
            }}
        >
            {/* 1. Primary Bottom Tabs Container */}
            <Stack.Screen
                name="MainTabs"
                component={MainTabNavigator}
                options={{ headerShown: false }}
            />

            {/* 2. Registered Stack Flow Screens */}
            <Stack.Screen
                name="TransferReview"
                component={TransferReviewScreen}
                options={{ title: 'Review Transfer' }}
            />
            <Stack.Screen
                name="TransferConfirm"
                component={TransferConfirmScreen}
                options={{ title: 'Authorize Transaction' }}
            />
            <Stack.Screen
                name="Deposit"
                component={DepositScreen}
                options={{ title: 'Deposit Cash' }}
            />
            <Stack.Screen
                name="Transactions"
                component={TransactionHistoryScreen}
                options={{ title: 'Account History' }}
            />
            <Stack.Screen
                name="TransactionDetail"
                component={TransactionDetailScreen}
                options={{ title: 'Transaction Receipt' }}
            />
            <Stack.Screen
                name="Statements"
                component={StatementListScreen}
                options={{ title: 'Account Statements' }}
            />
            <Stack.Screen
                name="StatementViewer"
                component={StatementViewerScreen}
                options={{ title: 'Encrypted PDF Viewer' }}
            />
            <Stack.Screen
                name="SecuritySettings"
                component={SecuritySettingsScreen}
                options={{ title: 'Security Controls' }}
            />
            <Stack.Screen
                name="DeviceManagement"
                component={DeviceManagementScreen}
                options={{ title: 'Trusted Devices' }}
            />
        </Stack.Navigator>
    );
};