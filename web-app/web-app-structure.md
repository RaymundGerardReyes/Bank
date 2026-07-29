.
|-- README.md
|-- next-env.d.ts
|-- next.config.ts
|-- package-lock.json
|-- package.json
|-- postcss.config.mjs
|-- src
|   |-- app
|   |   |-- (admin)
|   |   |   |-- account-status
|   |   |   |   `-- page.tsx
|   |   |   |-- audit
|   |   |   |   `-- page.tsx
|   |   |   `-- layout.tsx
|   |   |-- (auth)
|   |   |   |-- login
|   |   |   |   `-- page.tsx
|   |   |   |-- otp
|   |   |   |   `-- page.tsx
|   |   |   |-- passkey-setup
|   |   |   |   `-- page.tsx
|   |   |   `-- register
|   |   |       `-- page.tsx
|   |   |-- (dashboard)
|   |   |   |-- accounts
|   |   |   |   |-- [accountId]
|   |   |   |   |   `-- page.tsx
|   |   |   |   `-- page.tsx
|   |   |   |-- api
|   |   |   |   `-- page.tsx
|   |   |   |-- layout.tsx
|   |   |   |-- products
|   |   |   |   `-- page.tsx
|   |   |   |-- profile
|   |   |   |   |-- devices
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- page.tsx
|   |   |   |   `-- security
|   |   |   |       `-- page.tsx
|   |   |   |-- statements
|   |   |   |   |-- [accountNumber]
|   |   |   |   |   `-- page.tsx
|   |   |   |   `-- page.tsx
|   |   |   |-- transactions
|   |   |   |   |-- deposit
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- external-payment
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- history
|   |   |   |   |   `-- page.tsx
|   |   |   |   `-- withdraw
|   |   |   |       `-- page.tsx
|   |   |   `-- transfers
|   |   |       |-- confirm
|   |   |       |   `-- page.tsx
|   |   |       |-- page.tsx
|   |   |       `-- review
|   |   |           `-- page.tsx
|   |   |-- api
|   |   |   |-- auth
|   |   |   |   |-- login
|   |   |   |   |   `-- route.ts
|   |   |   |   |-- logout
|   |   |   |   |   `-- route.ts
|   |   |   |   `-- refresh
|   |   |   |       `-- route.ts
|   |   |   |-- health
|   |   |   |   `-- route.ts
|   |   |   `-- proxy
|   |   |       |-- accounts
|   |   |       |   `-- route.ts
|   |   |       |-- apikeys
|   |   |       |   |-- [id]
|   |   |       |   |   `-- [action]
|   |   |       |   |       `-- route.ts
|   |   |       |   `-- route.ts
|   |   |       |-- auth
|   |   |       |   |-- login
|   |   |       |   |   `-- route.ts
|   |   |       |   |-- logout
|   |   |       |   |   `-- route.ts
|   |   |       |   |-- otp
|   |   |       |   |   |-- send
|   |   |       |   |   |   `-- route.ts
|   |   |       |   |   `-- verify
|   |   |       |   |       `-- route.ts
|   |   |       |   |-- refresh
|   |   |       |   |   `-- route.ts
|   |   |       |   `-- register
|   |   |       |       `-- route.ts
|   |   |       |-- gateway-test
|   |   |       |   `-- route.ts
|   |   |       |-- products
|   |   |       |   `-- route.ts
|   |   |       |-- statements
|   |   |       |   |-- account
|   |   |       |   |   `-- [accountNumber]
|   |   |       |   |       `-- route.ts
|   |   |       |   `-- route.ts
|   |   |       |-- transactions
|   |   |       |   |-- history
|   |   |       |   |   `-- [accountNumber]
|   |   |       |   |       `-- route.ts
|   |   |       |   |-- receipt
|   |   |       |   |   `-- route.ts
|   |   |       |   `-- route.ts
|   |   |       `-- transfers
|   |   |           |-- internal
|   |   |           |   `-- route.ts
|   |   |           `-- route.ts
|   |   |-- developers
|   |   |   |-- [...slug]
|   |   |   |   `-- page.tsx
|   |   |   `-- page.tsx
|   |   |-- error.tsx
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   |-- not-found.tsx
|   |   `-- page.tsx
|   |-- components
|   |   |-- accounts
|   |   |   `-- AccountBalanceCard.tsx
|   |   |-- api
|   |   |   |-- ApiKeyManager.tsx
|   |   |   `-- DomainLibrary.tsx
|   |   |-- common
|   |   |   |-- Button.tsx
|   |   |   |-- Card.tsx
|   |   |   |-- ErrorBanner.tsx
|   |   |   |-- Input.tsx
|   |   |   `-- LoadingOverlay.tsx
|   |   |-- docs
|   |   |   `-- ApiReferenceViewer.tsx
|   |   |-- security
|   |   |   |-- MaskedValue.tsx
|   |   |   `-- PasskeyPrompt.tsx
|   |   `-- transactions
|   |       `-- TransactionListItem.tsx
|   |-- config
|   |   |-- env.ts
|   |   `-- featureFlags.ts
|   |-- hooks
|   |   |-- useAccounts.ts
|   |   |-- useAuth.ts
|   |   |-- useIdleTimeout.ts
|   |   `-- useTransactions.ts
|   |-- middleware.ts
|   |-- models
|   |   |-- Account.ts
|   |   |-- ApiResponse.ts
|   |   |-- Product.ts
|   |   |-- Statement.ts
|   |   |-- Transaction.ts
|   |   `-- User.ts
|   |-- security
|   |   |-- RoleGuard.tsx
|   |   |-- SessionGuard.tsx
|   |   |-- csp.ts
|   |   `-- rateLimiter.ts
|   |-- services
|   |   |-- account
|   |   |   `-- accountService.ts
|   |   |-- api
|   |   |   |-- endpoints.ts
|   |   |   |-- httpClient.ts
|   |   |   `-- interceptors
|   |   |       |-- correlationIdInterceptor.ts
|   |   |       |-- errorInterceptor.ts
|   |   |       `-- idempotencyInterceptor.ts
|   |   |-- auth
|   |   |   |-- authService.ts
|   |   |   |-- passkeyService.ts
|   |   |   `-- sessionService.ts
|   |   |-- docs
|   |   |   |-- apiTestRunner.ts
|   |   |   `-- openApiService.ts
|   |   |-- statement
|   |   |   `-- statementService.ts
|   |   `-- transaction
|   |       |-- idempotencyKeyService.ts
|   |       `-- transactionService.ts
|   |-- state
|   |   |-- authStore.ts
|   |   |-- queryClient.ts
|   |   `-- uiStore.ts
|   |-- theme
|   |   |-- globals.css
|   |   `-- tailwind.config.ts
|   |-- utils
|   |   |-- constants.ts
|   |   |-- formatters.ts
|   |   |-- logger.ts
|   |   `-- validators.ts
|   `-- web-app-structure.md
|-- src.7z
|-- tailwind.config.ts
|-- tests
|   |-- e2e
|   |   |-- login.spec.ts
|   |   |-- statements.spec.ts
|   |   `-- transfer.spec.ts
|   `-- unit
|       `-- services
|           |-- authService.test.ts
|           `-- transactionService.test.ts
|-- tsconfig.json
`-- web-app-structure.md

86 directories, 121 files
