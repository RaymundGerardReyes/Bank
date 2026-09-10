import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { MainStackParamList } from './types';

// Main Bottom Tab Bar
import { MainTabNavigator } from './MainTabNavigator';

// Flow & Detail Screen Imports
import { AccountDetailScreen } from '../screens/accounts/AccountDetailScreen';
import { OpenAccountScreen } from '../screens/accounts/OpenAccountScreen';
import { AuditLogScreen } from '../screens/admin/AuditLogScreen';
import { ProductCatalogScreen } from '../screens/products/ProductCatalogScreen';
import { DeviceManagementScreen } from '../screens/profile/DeviceManagementScreen';
import { SecuritySettingsScreen } from '../screens/profile/SecuritySettingsScreen';
import { StatementListScreen } from '../screens/statements/StatementListScreen';
import { StatementViewerScreen } from '../screens/statements/StatementViewerScreen';
import { TransactionDetailScreen } from '../screens/transactions/TransactionDetailScreen';
import { TransactionHistoryScreen } from '../screens/transactions/TransactionHistoryScreen';
import { DepositScreen } from '../screens/transfers/DepositScreen';
import { ExternalPaymentScreen } from '../screens/transfers/ExternalPaymentScreen';
import { TransferConfirmScreen } from '../screens/transfers/TransferConfirmScreen';
import { TransferReviewScreen } from '../screens/transfers/TransferReviewScreen';
import { WithdrawScreen } from '../screens/transfers/WithdrawScreen';

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

            {/* 2. Account Screens */}
            <Stack.Screen
                name="AccountDetail"
                component={AccountDetailScreen}
                options={{ title: 'Account Details' }}
            />
            <Stack.Screen
                name="OpenAccount"
                component={OpenAccountScreen}
                options={{ title: 'Open New Account' }}
            />
            <Stack.Screen
                name="ProductCatalog"
                component={ProductCatalogScreen}
                options={{ title: 'Products & Rates' }}
            />

            {/* 3. Money Movement Screens */}
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
                name="Withdraw"
                component={WithdrawScreen}
                options={{ title: 'Withdraw Cash' }}
            />
            <Stack.Screen
                name="ExternalPayment"
                component={ExternalPaymentScreen}
                options={{ title: 'Wire Transfer' }}
            />

            {/* 4. Ledger & Statements */}
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

            {/* 5. Security & Governance */}
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
            <Stack.Screen
                name="AuditLogs"
                component={AuditLogScreen}
                options={{ title: 'Audit Trail' }}
            />
        </Stack.Navigator>
    );
};