# React Native (TypeScript) Mobile Banking App — Android-First Architecture

## Alignment With Backend

This mobile architecture is derived directly from the implemented Spring Boot backend endpoints and security model: JWT stateless authentication with `/api/v1/auth/login`, OTP/MFA verification, correlation-ID tracing via `X-Request-Id`, idempotency-key-protected money movement (`/api/v1/transfers/internal`, `/api/v1/transactions/deposit|withdraw|external-payment`), account and customer management (`/api/v1/accounts`, `/api/v1/customers`), statements (`/api/v1/statements/*`), and role-based access (`CUSTOMER`, `ADMIN`, `TELLER`).[file:36] Every mobile module below maps one-to-one to an already-implemented backend module, so no client feature exists without a corresponding, hardened server capability.

## Technology Choices (Android-First)

- **Framework:** React Native (bare workflow, not Expo Go) with TypeScript, chosen for direct native module access needed for biometrics, secure storage, and root/tamper detection on Android.
- **Navigation:** React Navigation (native-stack + bottom-tabs) for a native Android look and feel.
- **State management:** Redux Toolkit + RTK Query, giving typed API cache, retries, and optimistic UI without hand-rolled fetch logic.
- **Secure storage:** `react-native-keychain` / Android Keystore-backed encrypted storage for refresh tokens — never AsyncStorage for anything security-sensitive.
- **Biometrics:** `react-native-biometrics` (Android BiometricPrompt) for app unlock and transaction confirmation.
- **Networking:** Axios with interceptors bound to the same `X-Request-Id` correlation pattern used server-side.
- **Push notifications:** Firebase Cloud Messaging (FCM), matching the backend's `PushNotificationAdapter`.[file:36]

## Mobile-Specific Features the App Must Have

These features are initiative-driven additions beyond a plain CRUD client, chosen because the backend already supports or anticipates them:

- **Biometric app unlock and transaction step-up authentication** using Android BiometricPrompt before any transfer, withdrawal, or external payment is submitted — mirrors backend MFA/OTP enforcement.[file:36]
- **Client-generated idempotency keys (UUID v4)** attached to every money-movement request, generated once per user action and reused on retry, matching `IdempotencyKeyUtils` and `IdempotencyGuardService` on the backend.[file:36]
- **Root/jailbreak and tamper detection** (`react-native-device-info` + root-check libs) that blocks login on compromised Android devices — a control a Principal Security Engineer would require before trusting a banking client.
- **Certificate pinning** (`react-native-ssl-pinning` or OkHttp pinning) against the Nginx gateway's TLS certificate, protecting against MITM even on rooted proxies.
- **Correlation ID propagation** — every API call attaches a locally generated `X-Request-Id` so client and server logs can be joined for support/incident investigations.
- **Session auto-lock and refresh-token rotation** — app locks after inactivity and rotates refresh tokens using the backend's `TokenBlacklistService` on logout/lock.[file:36]
- **Offline-aware read caching** for account summaries and statements (RTK Query cache) with clear "last synced" indicators, since balances must never be shown as authoritative when stale.
- **Push-driven transaction alerts** wired to backend `SendTransactionAlertService` / FCM adapter, with deep links straight into the relevant transaction detail screen.
- **In-app PDF statement viewer** consuming `/api/v1/statements/account/{accountNumber}` without ever writing the PDF to unencrypted shared storage.
- **Admin/Teller conditional UI** — the same app codebase renders extra screens (audit review, account status change) only when the JWT role claim is `ADMIN` or `TELLER`, matching backend RBAC.[file:36]
- **Screenshot/screen-recording blocking** on sensitive screens (balances, statements, OTP entry) using `FLAG_SECURE` on Android.
- **Panic/duress PIN** (optional but recommended) — a secondary PIN that logs into a limited-view "safe mode" account state, a common fintech-hardening feature.

## System Design & Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────┐
│                     Android Device Runtime                      │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                React Native (TypeScript) App               │  │
│  │                                                             │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐ │  │
│  │  │  UI Layer   │  │  Navigation  │  │  Screen Guards     │ │  │
│  │  │  screens/   │  │  React Nav   │  │  (role/session)    │ │  │
│  │  │  components/│  │              │  │                    │ │  │
│  │  └──────┬──────┘  └──────┬───────┘  └─────────┬──────────┘ │  │
│  │         │                │                     │            │  │
│  │  ┌──────▼────────────────▼─────────────────────▼─────────┐ │  │
│  │  │            State Layer (Redux Toolkit + RTK Query)      │ │  │
│  │  │   authSlice · accountSlice · transactionSlice · uiSlice │ │  │
│  │  └──────────────────────────┬───────────────────────────┘ │  │
│  │                             │                               │  │
│  │  ┌──────────────────────────▼───────────────────────────┐  │  │
│  │  │                  Services Layer                       │  │  │
│  │  │  apiClient (Axios) · authService · accountService      │  │  │
│  │  │  transactionService · statementService · notifService  │  │  │
│  │  └──────┬──────────────────────────────────┬─────────────┘  │  │
│  │         │                                  │                 │  │
│  │  ┌──────▼──────────┐            ┌──────────▼─────────────┐  │  │
│  │  │  Security Layer  │            │   Interceptors          │  │  │
│  │  │  Keychain/Keystore│           │  X-Request-Id injector  │  │  │
│  │  │  BiometricPrompt  │           │  JWT attach/refresh     │  │  │
│  │  │  Cert Pinning     │           │  Idempotency-Key header │  │  │
│  │  │  Root Detection   │           │  Error normalizer        │  │  │
│  │  └──────────────────┘            └──────────────────────────┘  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬─────────────────────────────────┘
                                   │ HTTPS (TLS 1.2+/1.3, pinned cert)
                                   ▼
                    ┌──────────────────────────────┐
                    │   Nginx Gateway / Load Balancer│
                    │   Rate limiting · X-Request-Id │
                    └───────────────┬────────────────┘
                                    ▼
                    ┌──────────────────────────────┐
                    │   Spring Boot Banking Backend  │
                    │   /api/v1/auth, /accounts,     │
                    │   /transfers, /transactions,   │
                    │   /statements, /admin, /products│
                    └──────────────────────────────┘
```

### Client Request Lifecycle (Mirrors Backend Logic Flow)

```text
User Action (e.g., tap "Send Transfer")
   ↓
Screen-level form validation (Zod / Yup schema)
   ↓
Biometric step-up prompt (for money-moving actions)
   ↓
Generate/reuse Idempotency-Key (UUID v4, stored per draft)
   ↓
RTK Query mutation triggers Axios request
   ↓
Interceptor attaches: JWT Bearer token, X-Request-Id, Idempotency-Key
   ↓
Certificate-pinned HTTPS call → Nginx Gateway → Spring Boot
   ↓
Response (ApiResponse<T> envelope) parsed
   ↓
On 401 → silent refresh-token rotation → retry once
   ↓
On success → Redux cache updated, UI re-renders
   ↓
On business error (ErrorCode) → mapped to localized UI message
   ↓
Audit breadcrumb logged locally (non-sensitive) for support diagnostics
```

## Recommended Mobile Tree Diagram

```text
mobile-app/
├── android/
│   ├── app/
│   │   ├── build.gradle
│   │   ├── proguard-rules.pro
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/com/company/banking/
│   │       │   ├── MainActivity.kt
│   │       │   ├── MainApplication.kt
│   │       │   └── security/
│   │       │       ├── RootDetectionModule.kt
│   │       │       └── ScreenshotBlockModule.kt
│   │       └── res/
│   │           ├── values/strings.xml
│   │           └── mipmap/
│   ├── build.gradle
│   ├── gradle.properties
│   └── settings.gradle
│
├── ios/
│   └── (kept minimal/placeholder — Android is primary target)
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── AppProviders.tsx
│   │   ├── RootNavigator.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── navigation/
│   │   ├── AuthNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   ├── AdminStackNavigator.tsx
│   │   └── types.ts
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── OtpVerificationScreen.tsx
│   │   │   ├── BiometricSetupScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardScreen.tsx
│   │   │   └── NotificationsScreen.tsx
│   │   ├── accounts/
│   │   │   ├── AccountListScreen.tsx
│   │   │   ├── AccountDetailScreen.tsx
│   │   │   └── OpenAccountScreen.tsx
│   │   ├── transfers/
│   │   │   ├── TransferFormScreen.tsx
│   │   │   ├── TransferReviewScreen.tsx
│   │   │   ├── TransferConfirmScreen.tsx (biometric step-up)
│   │   │   ├── DepositScreen.tsx
│   │   │   ├── WithdrawScreen.tsx
│   │   │   └── ExternalPaymentScreen.tsx
│   │   ├── transactions/
│   │   │   ├── TransactionHistoryScreen.tsx
│   │   │   └── TransactionDetailScreen.tsx
│   │   ├── statements/
│   │   │   ├── StatementListScreen.tsx
│   │   │   └── StatementViewerScreen.tsx
│   │   ├── products/
│   │   │   └── ProductCatalogScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── SecuritySettingsScreen.tsx
│   │   │   └── DeviceManagementScreen.tsx
│   │   └── admin/
│   │       ├── AuditLogScreen.tsx
│   │       └── AccountStatusManagementScreen.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── LoadingOverlay.tsx
│   │   │   └── ErrorBanner.tsx
│   │   ├── accounts/
│   │   │   └── AccountBalanceCard.tsx
│   │   ├── transactions/
│   │   │   └── TransactionListItem.tsx
│   │   └── security/
│   │       ├── BiometricPrompt.tsx
│   │       └── SecureScreenWrapper.tsx
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── apiClient.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── authInterceptor.ts
│   │   │   │   ├── correlationIdInterceptor.ts
│   │   │   │   ├── idempotencyInterceptor.ts
│   │   │   │   └── errorInterceptor.ts
│   │   │   └── endpoints.ts
│   │   ├── auth/
│   │   │   ├── authService.ts
│   │   │   ├── tokenStorageService.ts
│   │   │   └── biometricAuthService.ts
│   │   ├── account/
│   │   │   └── accountService.ts
│   │   ├── transaction/
│   │   │   ├── transactionService.ts
│   │   │   └── idempotencyKeyService.ts
│   │   ├── statement/
│   │   │   └── statementService.ts
│   │   ├── notification/
│   │   │   └── pushNotificationService.ts
│   │   └── security/
│   │       ├── rootDetectionService.ts
│   │       ├── certificatePinningService.ts
│   │       └── deviceIntegrityService.ts
│   │
│   ├── state/
│   │   ├── store.ts
│   │   ├── authSlice.ts
│   │   ├── accountSlice.ts
│   │   ├── transactionSlice.ts
│   │   ├── uiSlice.ts
│   │   └── api/
│   │       ├── authApi.ts
│   │       ├── accountApi.ts
│   │       ├── transactionApi.ts
│   │       ├── statementApi.ts
│   │       └── productApi.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── Account.ts
│   │   ├── Transaction.ts
│   │   ├── Statement.ts
│   │   ├── Product.ts
│   │   └── ApiResponse.ts
│   │
│   ├── security/
│   │   ├── SessionGuard.tsx
│   │   ├── RoleGuard.tsx
│   │   ├── AutoLockManager.ts
│   │   ├── ScreenshotGuard.ts
│   │   └── DuressPinHandler.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBiometric.ts
│   │   ├── useAccounts.ts
│   │   ├── useTransactions.ts
│   │   └── useAppLock.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts (currency, dates)
│   │   ├── validators.ts (Zod schemas)
│   │   ├── logger.ts
│   │   └── constants.ts
│   │
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   │
│   └── config/
│       ├── env.ts
│       └── featureFlags.ts
│
├── __tests__/
│   ├── services/
│   │   ├── authService.test.ts
│   │   └── transactionService.test.ts
│   └── screens/
│       └── TransferFormScreen.test.tsx
│
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── jest.config.js
├── package.json
└── README.md
```

## Module-to-Backend Mapping

| Mobile Module | Backend Endpoint / Component | Notes |
|---|---|---|
| `services/auth/authService.ts` | `POST /api/v1/auth/login`, `JwtTokenProvider` | Stores access + refresh token via Keystore |
| `screens/auth/OtpVerificationScreen.tsx` | `OtpService`, `OtpVerificationService` | MFA step for login/high-risk actions |
| `services/account/accountService.ts` | `/api/v1/accounts`, `AccountController` | List, detail, open account |
| `services/transaction/transactionService.ts` | `/api/v1/transfers/internal`, `/transactions/deposit\|withdraw\|external-payment` | Requires Idempotency-Key header |
| `services/statement/statementService.ts` | `/api/v1/statements/generate`, `/statements/account/{accountNumber}` | In-app PDF viewer, no unencrypted disk writes |
| `screens/admin/AuditLogScreen.tsx` | `/api/v1/admin/audit`, `ROLE_ADMIN` gate | Rendered only for Admin/Teller JWT roles |
| `screens/products/ProductCatalogScreen.tsx` | `/api/v1/products`, `GetProductCatalogService` | Cached read-only catalog |
| `services/notification/pushNotificationService.ts` | `PushNotificationAdapter` (FCM) | Deep-links into transaction detail |

## Security Layer Detail

The `security/` module is the mobile equivalent of the backend's `security/` package and must be treated with the same rigor:

- `SessionGuard.tsx` blocks navigation to any authenticated screen until a valid, non-expired JWT and a passed biometric/auto-lock check exist.
- `RoleGuard.tsx` reads the decoded JWT role claim client-side only for UI gating — the backend remains the sole authority (`@PreAuthorize`) for actual enforcement, since client-side checks are never trusted for security decisions.
- `AutoLockManager.ts` listens to `AppState` changes and forces re-authentication after a configurable inactivity window.
- `ScreenshotGuard.ts` toggles Android's `FLAG_SECURE` when entering balance, statement, or OTP screens.
- `DuressPinHandler.ts` optionally swaps the session into a restricted "safe view" when a duress PIN is entered instead of the real PIN.

## Updated Mobile Scaffold Script (`scaffold-mobile.sh`)

```bash
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
```

### Robustness Improvements in This Script vs. a Basic Scaffold

- `set -euo pipefail` ensures the script halts immediately on any missing path or command failure instead of producing a partially-built tree silently.
- Every file-creation loop re-verifies its parent directory with `mkdir -p "$(dirname "$file")"`, so reordering or trimming the `dirs` array can never cause a silent `touch` failure.
- Android native Kotlin security modules (`RootDetectionModule.kt`, `ScreenshotBlockModule.kt`) are scaffolded alongside the JS/TS layer, reflecting that root detection and `FLAG_SECURE` must be implemented as native modules, not pure JavaScript.
- Interceptors are split into individually testable files (`authInterceptor.ts`, `correlationIdInterceptor.ts`, `idempotencyInterceptor.ts`, `errorInterceptor.ts`) instead of one monolithic Axios config, mirroring the backend's filter-chain separation for the same debuggability reasons.
- A dedicated `services/security/` folder isolates root detection, certificate pinning, and device integrity checks from business services, so a security audit can review that folder in isolation.
- `__tests__/` is scaffolded from day one with both service-level and screen-level test placeholders, avoiding the common anti-pattern of bolting tests on after the fact.

## Conclusion

This mobile architecture keeps the client thin and untrusted by design — every financial rule, balance check, and authorization decision still lives in the hardened Spring Boot backend — while giving the Android app the specific defenses (biometric step-up, root detection, certificate pinning, idempotency keys, screenshot blocking) that a banking client must carry on the device itself.[file:36]
