#!/usr/bin/env bash
set -euo pipefail

root="web-app"
src="$root/src"

dirs=(
  # Root
  "$root"
  # App router
  "$src/app/(auth)/login"
  "$src/app/(auth)/otp"
  "$src/app/(auth)/passkey-setup"
  "$src/app/(dashboard)/accounts/[accountId]"
  "$src/app/(dashboard)/transfers/review"
  "$src/app/(dashboard)/transfers/confirm"
  "$src/app/(dashboard)/transactions/deposit"
  "$src/app/(dashboard)/transactions/withdraw"
  "$src/app/(dashboard)/transactions/external-payment"
  "$src/app/(dashboard)/transactions/history"
  "$src/app/(dashboard)/statements/[accountNumber]"
  "$src/app/(dashboard)/products"
  "$src/app/(dashboard)/profile/security"
  "$src/app/(dashboard)/profile/devices"
  "$src/app/(admin)/audit"
  "$src/app/(admin)/account-status"
  "$src/app/developers/[...slug]"
  "$src/app/api/auth/login"
  "$src/app/api/auth/refresh"
  "$src/app/api/auth/logout"
  "$src/app/api/proxy/accounts"
  "$src/app/api/proxy/transfers"
  "$src/app/api/proxy/transactions"
  "$src/app/api/proxy/statements"
  "$src/app/api/proxy/products"
  "$src/app/api/health"
  # Components
  "$src/components/common"
  "$src/components/accounts"
  "$src/components/transactions"
  "$src/components/security"
  "$src/components/docs"
  # Services
  "$src/services/api/interceptors"
  "$src/services/auth"
  "$src/services/account"
  "$src/services/transaction"
  "$src/services/statement"
  "$src/services/docs"
  # State
  "$src/state"
  # Models
  "$src/models"
  # Security
  "$src/security"
  # Hooks
  "$src/hooks"
  # Utils / theme / config
  "$src/utils"
  "$src/theme"
  "$src/config"
  # Tests
  "$root/tests/unit/services"
  "$root/tests/e2e"
)

for dir in "${dirs[@]}"; do
  mkdir -p "$dir"
done

files=(
  # Root config
  "$root/.env.example"
  "$root/.eslintrc.json"
  "$root/.prettierrc"
  "$root/tsconfig.json"
  "$root/next.config.ts"
  "$root/package.json"
  "$root/README.md"
  "$root/src/middleware.ts"

  # App shell
  "$src/app/layout.tsx"
  "$src/app/error.tsx"
  "$src/app/not-found.tsx"
  "$src/app/globals.css"

  # Auth routes
  "$src/app/(auth)/login/page.tsx"
  "$src/app/(auth)/otp/page.tsx"
  "$src/app/(auth)/passkey-setup/page.tsx"

  # Dashboard routes
  "$src/app/(dashboard)/layout.tsx"
  "$src/app/(dashboard)/accounts/page.tsx"
  "$src/app/(dashboard)/accounts/[accountId]/page.tsx"
  "$src/app/(dashboard)/transfers/page.tsx"
  "$src/app/(dashboard)/transfers/review/page.tsx"
  "$src/app/(dashboard)/transfers/confirm/page.tsx"
  "$src/app/(dashboard)/transactions/deposit/page.tsx"
  "$src/app/(dashboard)/transactions/withdraw/page.tsx"
  "$src/app/(dashboard)/transactions/external-payment/page.tsx"
  "$src/app/(dashboard)/transactions/history/page.tsx"
  "$src/app/(dashboard)/statements/page.tsx"
  "$src/app/(dashboard)/statements/[accountNumber]/page.tsx"
  "$src/app/(dashboard)/products/page.tsx"
  "$src/app/(dashboard)/profile/page.tsx"
  "$src/app/(dashboard)/profile/security/page.tsx"
  "$src/app/(dashboard)/profile/devices/page.tsx"

  # Admin routes
  "$src/app/(admin)/layout.tsx"
  "$src/app/(admin)/audit/page.tsx"
  "$src/app/(admin)/account-status/page.tsx"

  # Developer API docs gateway
  "$src/app/developers/page.tsx"
  "$src/app/developers/[...slug]/page.tsx"

  # Route Handlers (BFF layer)
  "$src/app/api/auth/login/route.ts"
  "$src/app/api/auth/refresh/route.ts"
  "$src/app/api/auth/logout/route.ts"
  "$src/app/api/proxy/accounts/route.ts"
  "$src/app/api/proxy/transfers/route.ts"
  "$src/app/api/proxy/transactions/route.ts"
  "$src/app/api/proxy/statements/route.ts"
  "$src/app/api/proxy/products/route.ts"
  "$src/app/api/health/route.ts"

  # Components
  "$src/components/common/Button.tsx"
  "$src/components/common/Input.tsx"
  "$src/components/common/Card.tsx"
  "$src/components/common/LoadingOverlay.tsx"
  "$src/components/common/ErrorBanner.tsx"
  "$src/components/accounts/AccountBalanceCard.tsx"
  "$src/components/transactions/TransactionListItem.tsx"
  "$src/components/security/PasskeyPrompt.tsx"
  "$src/components/security/MaskedValue.tsx"
  "$src/components/docs/ApiReferenceViewer.tsx"

  # Services
  "$src/services/api/httpClient.ts"
  "$src/services/api/endpoints.ts"
  "$src/services/api/interceptors/correlationIdInterceptor.ts"
  "$src/services/api/interceptors/idempotencyInterceptor.ts"
  "$src/services/api/interceptors/errorInterceptor.ts"
  "$src/services/auth/authService.ts"
  "$src/services/auth/sessionService.ts"
  "$src/services/auth/passkeyService.ts"
  "$src/services/account/accountService.ts"
  "$src/services/transaction/transactionService.ts"
  "$src/services/transaction/idempotencyKeyService.ts"
  "$src/services/statement/statementService.ts"
  "$src/services/docs/openApiService.ts"

  # State
  "$src/state/queryClient.ts"
  "$src/state/uiStore.ts"
  "$src/state/authStore.ts"

  # Models
  "$src/models/User.ts"
  "$src/models/Account.ts"
  "$src/models/Transaction.ts"
  "$src/models/Statement.ts"
  "$src/models/Product.ts"
  "$src/models/ApiResponse.ts"

  # Security
  "$src/security/RoleGuard.tsx"
  "$src/security/SessionGuard.tsx"
  "$src/security/csp.ts"
  "$src/security/rateLimiter.ts"

  # Hooks
  "$src/hooks/useAuth.ts"
  "$src/hooks/useAccounts.ts"
  "$src/hooks/useTransactions.ts"
  "$src/hooks/useIdleTimeout.ts"

  # Utils / theme / config
  "$src/utils/formatters.ts"
  "$src/utils/validators.ts"
  "$src/utils/logger.ts"
  "$src/utils/constants.ts"
  "$src/theme/tailwind.config.ts"
  "$src/theme/globals.css"
  "$src/config/env.ts"
  "$src/config/featureFlags.ts"

  # Tests
  "$root/tests/unit/services/authService.test.ts"
  "$root/tests/unit/services/transactionService.test.ts"
  "$root/tests/e2e/login.spec.ts"
  "$root/tests/e2e/transfer.spec.ts"
  "$root/tests/e2e/statements.spec.ts"
)

for file in "${files[@]}"; do
  if [ ! -f "$file" ]; then
    mkdir -p "$(dirname "$file")"
    touch "$file"
  fi
done

echo "Next.js TypeScript + Tailwind CSS banking web frontend scaffold completed successfully."
echo "Reminder: run 'pnpm install' then configure .env.example with the backend API base URL and Route Handler secrets before starting the dev server."
echo "Reminder: the /developers API documentation route must be disabled or role-gated in production environments."
