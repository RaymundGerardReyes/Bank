#!/usr/bin/env bash
set -euo pipefail

root="mobile-app"
src="$root/src"
android_pkg="$root/android/app/src/main/java/com/company/banking"

dirs=(
  "$root/android/app/src/main/res/values"
  "$root/android/app/src/main/res/mipmap"
  "$android_pkg/security"
  "$root/ios"

  "$src/app"
  "$src/navigation"

  "$src/screens/auth"
  "$src/screens/dashboard"
  "$src/screens/accounts"
  "$src/screens/transfers"
  "$src/screens/transactions"
  "$src/screens/statements"
  "$src/screens/products"
  "$src/screens/profile"
  "$src/screens/admin"

  "$src/components/common"
  "$src/components/accounts"
  "$src/components/transactions"
  "$src/components/security"

  "$src/services/api/interceptors"
  "$src/services/auth"
  "$src/services/account"
  "$src/services/transaction"
  "$src/services/statement"
  "$src/services/notification"
  "$src/services/security"

  "$src/state/api"
  "$src/models"
  "$src/security"
  "$src/hooks"
  "$src/utils"
  "$src/theme"
  "$src/config"

  "$root/__tests__/services"
  "$root/__tests__/screens"
)

for dir in "${dirs[@]}"; do
  mkdir -p "$dir"
done

files=(
  # Android native
  "$root/android/app/build.gradle"
  "$root/android/app/proguard-rules.pro"
  "$root/android/app/src/main/AndroidManifest.xml"
  "$android_pkg/MainActivity.kt"
  "$android_pkg/MainApplication.kt"
  "$android_pkg/security/RootDetectionModule.kt"
  "$android_pkg/security/ScreenshotBlockModule.kt"
  "$root/android/app/src/main/res/values/strings.xml"
  "$root/android/build.gradle"
  "$root/android/gradle.properties"
  "$root/android/settings.gradle"

  # App shell
  "$src/app/App.tsx"
  "$src/app/AppProviders.tsx"
  "$src/app/RootNavigator.tsx"
  "$src/app/ErrorBoundary.tsx"

  # Navigation
  "$src/navigation/AuthNavigator.tsx"
  "$src/navigation/MainTabNavigator.tsx"
  "$src/navigation/AdminStackNavigator.tsx"
  "$src/navigation/types.ts"

  # Auth screens
  "$src/screens/auth/LoginScreen.tsx"
  "$src/screens/auth/OtpVerificationScreen.tsx"
  "$src/screens/auth/BiometricSetupScreen.tsx"
  "$src/screens/auth/ForgotPasswordScreen.tsx"

  # Dashboard
  "$src/screens/dashboard/DashboardScreen.tsx"
  "$src/screens/dashboard/NotificationsScreen.tsx"

  # Accounts
  "$src/screens/accounts/AccountListScreen.tsx"
  "$src/screens/accounts/AccountDetailScreen.tsx"
  "$src/screens/accounts/OpenAccountScreen.tsx"

  # Transfers
  "$src/screens/transfers/TransferFormScreen.tsx"
  "$src/screens/transfers/TransferReviewScreen.tsx"
  "$src/screens/transfers/TransferConfirmScreen.tsx"
  "$src/screens/transfers/DepositScreen.tsx"
  "$src/screens/transfers/WithdrawScreen.tsx"
  "$src/screens/transfers/ExternalPaymentScreen.tsx"

  # Transactions
  "$src/screens/transactions/TransactionHistoryScreen.tsx"
  "$src/screens/transactions/TransactionDetailScreen.tsx"

  # Statements
  "$src/screens/statements/StatementListScreen.tsx"
  "$src/screens/statements/StatementViewerScreen.tsx"

  # Products
  "$src/screens/products/ProductCatalogScreen.tsx"

  # Profile
  "$src/screens/profile/ProfileScreen.tsx"
  "$src/screens/profile/SecuritySettingsScreen.tsx"
  "$src/screens/profile/DeviceManagementScreen.tsx"

  # Admin
  "$src/screens/admin/AuditLogScreen.tsx"
  "$src/screens/admin/AccountStatusManagementScreen.tsx"

  # Components
  "$src/components/common/Button.tsx"
  "$src/components/common/Input.tsx"
  "$src/components/common/Card.tsx"
  "$src/components/common/LoadingOverlay.tsx"
  "$src/components/common/ErrorBanner.tsx"
  "$src/components/accounts/AccountBalanceCard.tsx"
  "$src/components/transactions/TransactionListItem.tsx"
  "$src/components/security/BiometricPrompt.tsx"
  "$src/components/security/SecureScreenWrapper.tsx"

  # Services
  "$src/services/api/apiClient.ts"
  "$src/services/api/interceptors/authInterceptor.ts"
  "$src/services/api/interceptors/correlationIdInterceptor.ts"
  "$src/services/api/interceptors/idempotencyInterceptor.ts"
  "$src/services/api/interceptors/errorInterceptor.ts"
  "$src/services/api/endpoints.ts"
  "$src/services/auth/authService.ts"
  "$src/services/auth/tokenStorageService.ts"
  "$src/services/auth/biometricAuthService.ts"
  "$src/services/account/accountService.ts"
  "$src/services/transaction/transactionService.ts"
  "$src/services/transaction/idempotencyKeyService.ts"
  "$src/services/statement/statementService.ts"
  "$src/services/notification/pushNotificationService.ts"
  "$src/services/security/rootDetectionService.ts"
  "$src/services/security/certificatePinningService.ts"
  "$src/services/security/deviceIntegrityService.ts"

  # State
  "$src/state/store.ts"
  "$src/state/authSlice.ts"
  "$src/state/accountSlice.ts"
  "$src/state/transactionSlice.ts"
  "$src/state/uiSlice.ts"
  "$src/state/api/authApi.ts"
  "$src/state/api/accountApi.ts"
  "$src/state/api/transactionApi.ts"
  "$src/state/api/statementApi.ts"
  "$src/state/api/productApi.ts"

  # Models
  "$src/models/User.ts"
  "$src/models/Account.ts"
  "$src/models/Transaction.ts"
  "$src/models/Statement.ts"
  "$src/models/Product.ts"
  "$src/models/ApiResponse.ts"

  # Security
  "$src/security/SessionGuard.tsx"
  "$src/security/RoleGuard.tsx"
  "$src/security/AutoLockManager.ts"
  "$src/security/ScreenshotGuard.ts"
  "$src/security/DuressPinHandler.ts"

  # Hooks
  "$src/hooks/useAuth.ts"
  "$src/hooks/useBiometric.ts"
  "$src/hooks/useAccounts.ts"
  "$src/hooks/useTransactions.ts"
  "$src/hooks/useAppLock.ts"

  # Utils / theme / config
  "$src/utils/formatters.ts"
  "$src/utils/validators.ts"
  "$src/utils/logger.ts"
  "$src/utils/constants.ts"
  "$src/theme/colors.ts"
  "$src/theme/typography.ts"
  "$src/theme/spacing.ts"
  "$src/config/env.ts"
  "$src/config/featureFlags.ts"

  # Tests
  "$root/__tests__/services/authService.test.ts"
  "$root/__tests__/services/transactionService.test.ts"
  "$root/__tests__/screens/TransferFormScreen.test.tsx"

  # Root config files
  "$root/.env.example"
  "$root/.eslintrc.js"
  "$root/.prettierrc"
  "$root/tsconfig.json"
  "$root/babel.config.js"
  "$root/metro.config.js"
  "$root/jest.config.js"
  "$root/package.json"
  "$root/README.md"
)

for file in "${files[@]}"; do
  if [ ! -f "$file" ]; then
    mkdir -p "$(dirname "$file")"
    touch "$file"
  fi
done

echo "React Native TypeScript (Android-first) banking mobile scaffold completed successfully."
echo "Reminder: configure certificate pinning against the Nginx gateway TLS cert and enable ProGuard/R8 obfuscation before release builds."