.
|-- app
|   |-- App.tsx
|   |-- AppProviders.tsx
|   |-- ErrorBoundary.tsx
|   `-- RootNavigator.tsx
|-- components
|   |-- accounts
|   |   `-- AccountBalanceCard.tsx
|   |-- common
|   |   |-- Button.tsx
|   |   |-- Card.tsx
|   |   |-- ErrorBanner.tsx
|   |   |-- Input.tsx
|   |   `-- LoadingOverlay.tsx
|   |-- security
|   |   |-- BiometricPrompt.tsx
|   |   `-- SecureScreenWrapper.tsx
|   `-- transactions
|       `-- TransactionListItem.tsx
|-- config
|   |-- env.ts
|   `-- featureFlags.ts
|-- hooks
|   |-- useAccounts.ts
|   |-- useAppLock.ts
|   |-- useAuth.ts
|   |-- useBiometric.ts
|   `-- useTransactions.ts
|-- mobile-app-structure.md
|-- models
|   |-- Account.ts
|   |-- ApiResponse.ts
|   |-- Product.ts
|   |-- Statement.ts
|   |-- Transaction.ts
|   `-- User.ts
|-- navigation
|   |-- AdminStackNavigator.tsx
|   |-- AuthNavigator.tsx
|   |-- MainStackNavigator.tsx
|   |-- MainTabNavigator.tsx
|   `-- types.ts
|-- screens
|   |-- accounts
|   |   |-- AccountDetailScreen.tsx
|   |   |-- AccountListScreen.tsx
|   |   `-- OpenAccountScreen.tsx
|   |-- admin
|   |   |-- AccountStatusManagementScreen.tsx
|   |   `-- AuditLogScreen.tsx
|   |-- auth
|   |   |-- BiometricSetupScreen.tsx
|   |   |-- FaceVerificationScreen.tsx
|   |   |-- ForgotPasswordScreen.tsx
|   |   |-- LoginScreen.tsx
|   |   `-- OtpVerificationScreen.tsx
|   |-- dashboard
|   |   |-- DashboardScreen.tsx
|   |   `-- NotificationsScreen.tsx
|   |-- products
|   |   `-- ProductCatalogScreen.tsx
|   |-- profile
|   |   |-- DeviceManagementScreen.tsx
|   |   |-- ProfileScreen.tsx
|   |   `-- SecuritySettingsScreen.tsx
|   |-- statements
|   |   |-- StatementListScreen.tsx
|   |   `-- StatementViewerScreen.tsx
|   |-- transactions
|   |   |-- TransactionDetailScreen.tsx
|   |   `-- TransactionHistoryScreen.tsx
|   `-- transfers
|       |-- DepositScreen.tsx
|       |-- ExternalPaymentScreen.tsx
|       |-- TransferConfirmScreen.tsx
|       |-- TransferFormScreen.tsx
|       |-- TransferReviewScreen.tsx
|       `-- WithdrawScreen.tsx
|-- security
|   |-- AutoLockManager.ts
|   |-- DuressPinHandler.ts
|   |-- RoleGuard.tsx
|   |-- ScreenshotGuard.ts
|   `-- SessionGuard.tsx
|-- services
|   |-- account
|   |   `-- accountService.ts
|   |-- api
|   |   |-- apiClient.ts
|   |   |-- endpoints.ts
|   |   `-- interceptors
|   |       |-- authInterceptor.ts
|   |       |-- correlationIdInterceptor.ts
|   |       |-- errorInterceptor.ts
|   |       |-- idempotencyInterceptor.ts
|   |       `-- loggingInterceptor.ts
|   |-- auth
|   |   |-- authService.ts
|   |   |-- biometricAuthService.ts
|   |   |-- faceAuthService.ts
|   |   `-- tokenStorageService.ts
|   |-- notification
|   |   `-- pushNotificationService.ts
|   |-- security
|   |   |-- certificatePinningService.ts
|   |   |-- deviceIntegrityService.ts
|   |   `-- rootDetectionService.ts
|   |-- statement
|   |   `-- statementService.ts
|   `-- transaction
|       |-- idempotencyKeyService.ts
|       `-- transactionService.ts
|-- state
|   |-- accountSlice.ts
|   |-- api
|   |   |-- accountApi.ts
|   |   |-- authApi.ts
|   |   |-- productApi.ts
|   |   |-- statementApi.ts
|   |   `-- transactionApi.ts
|   |-- authSlice.ts
|   |-- store.ts
|   |-- transactionSlice.ts
|   `-- uiSlice.ts
|-- theme
|   |-- colors.ts
|   |-- spacing.ts
|   `-- typography.ts
|-- types
|   `-- declarations.d.ts
`-- utils
    |-- constants.ts
    |-- formatters.ts
    |-- logger.ts
    `-- validators.ts

35 directories, 100 files
