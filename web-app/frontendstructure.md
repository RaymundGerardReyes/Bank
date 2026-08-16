.
|-- Dockerfile
|-- README.md
|-- frontendstructure.md
|-- next-env.d.ts
|-- next.config.ts
|-- package-lock.json
|-- package.json
|-- postcss.config.mjs
|-- scripts
|   `-- clean.mjs
|-- src
|   |-- app
|   |   |-- (admin)
|   |   |   |-- account-status
|   |   |   |   `-- page.tsx
|   |   |   |-- audit
|   |   |   |   `-- page.tsx
|   |   |   `-- layout.tsx
|   |   |-- (auth)
|   |   |   |-- forgot-password
|   |   |   |   `-- page.tsx
|   |   |   |-- login
|   |   |   |   `-- page.tsx
|   |   |   |-- otp
|   |   |   |   `-- page.tsx
|   |   |   |-- passkey-setup
|   |   |   |   `-- page.tsx
|   |   |   |-- register
|   |   |   |   `-- page.tsx
|   |   |   `-- reset-password
|   |   |       `-- page.tsx
|   |   |-- (dashboard)
|   |   |   |-- accounts
|   |   |   |   |-- [accountId]
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- new
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
|   |   |   |   |-- receipt
|   |   |   |   |   `-- [txRef]
|   |   |   |   |       `-- page.tsx
|   |   |   |   `-- withdraw
|   |   |   |       `-- page.tsx
|   |   |   `-- transfers
|   |   |       |-- bank
|   |   |       |   `-- page.tsx
|   |   |       |-- confirm
|   |   |       |   `-- page.tsx
|   |   |       |-- internal
|   |   |       |   `-- page.tsx
|   |   |       |-- page.tsx
|   |   |       |-- qr
|   |   |       |   `-- page.tsx
|   |   |       `-- review
|   |   |           `-- page.tsx
|   |   |-- (merchant)
|   |   |   |-- balances
|   |   |   |   `-- page.tsx
|   |   |   |-- layout.tsx
|   |   |   |-- merchant-dashboard
|   |   |   |   `-- page.tsx
|   |   |   |-- payments
|   |   |   |   |-- [intentId]
|   |   |   |   |   `-- page.tsx
|   |   |   |   `-- page.tsx
|   |   |   |-- qr-payments
|   |   |   |   |-- create
|   |   |   |   |   `-- page.tsx
|   |   |   |   `-- page.tsx
|   |   |   |-- refunds
|   |   |   |   `-- page.tsx
|   |   |   `-- settlements
|   |   |       `-- page.tsx
|   |   |-- (ops)
|   |   |   |-- complaints
|   |   |   |   `-- page.tsx
|   |   |   |-- compliance
|   |   |   |   |-- evidence
|   |   |   |   |   `-- page.tsx
|   |   |   |   `-- page.tsx
|   |   |   |-- fraud
|   |   |   |   |-- [caseId]
|   |   |   |   |   `-- page.tsx
|   |   |   |   `-- page.tsx
|   |   |   |-- layout.tsx
|   |   |   |-- merchants
|   |   |   |   |-- [merchantId]
|   |   |   |   |   `-- page.tsx
|   |   |   |   `-- page.tsx
|   |   |   |-- ops-dashboard
|   |   |   |   `-- page.tsx
|   |   |   |-- ops-payments
|   |   |   |   `-- page.tsx
|   |   |   `-- ops-settlements
|   |   |       |-- exceptions
|   |   |       |   `-- page.tsx
|   |   |       `-- page.tsx
|   |   |-- api
|   |   |   |-- auth
|   |   |   |   |-- forgot-password
|   |   |   |   |   `-- route.ts
|   |   |   |   |-- login
|   |   |   |   |   `-- route.ts
|   |   |   |   |-- logout
|   |   |   |   |   `-- route.ts
|   |   |   |   |-- refresh
|   |   |   |   |   `-- route.ts
|   |   |   |   `-- reset-password
|   |   |   |       `-- route.ts
|   |   |   |-- health
|   |   |   |   `-- route.ts
|   |   |   `-- proxy
|   |   |       |-- [...path]
|   |   |       |   `-- route.ts
|   |   |       |-- accounts
|   |   |       |   `-- route.ts
|   |   |       |-- apikeys
|   |   |       |   |-- [id]
|   |   |       |   |   `-- [action]
|   |   |       |   |       `-- route.ts
|   |   |       |   `-- route.ts
|   |   |       |-- auth
|   |   |       |   |-- forgot-password
|   |   |       |   |   `-- route.ts
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
|   |   |       |   |-- register
|   |   |       |   |   `-- route.ts
|   |   |       |   `-- reset-password
|   |   |       |       `-- route.ts
|   |   |       |-- gateway
|   |   |       |   |-- complaints
|   |   |       |   |   |-- [...slug]
|   |   |       |   |   |   `-- route.ts
|   |   |       |   |   `-- route.ts
|   |   |       |   |-- fraud-cases
|   |   |       |   |   `-- [...slug]
|   |   |       |   |       `-- route.ts
|   |   |       |   |-- merchants
|   |   |       |   |   |-- [...slug]
|   |   |       |   |   |   `-- route.ts
|   |   |       |   |   `-- route.ts
|   |   |       |   |-- payments
|   |   |       |   |   `-- route.ts
|   |   |       |   |-- qr-payments
|   |   |       |   |   `-- [...slug]
|   |   |       |   |       `-- route.ts
|   |   |       |   |-- settlement-exceptions
|   |   |       |   |   `-- [...slug]
|   |   |       |   |       `-- route.ts
|   |   |       |   `-- settlement-windows
|   |   |       |       `-- route.ts
|   |   |       |-- gateway-test
|   |   |       |   `-- route.ts
|   |   |       |-- governance
|   |   |       |   `-- requirements
|   |   |       |       |-- [...slug]
|   |   |       |       |   `-- route.ts
|   |   |       |       `-- route.ts
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
|   |   |-- icon.svg
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
|   |   |-- gateway
|   |   |   |-- DataTable.tsx
|   |   |   |-- MerchantLifecycleStepper.tsx
|   |   |   |-- MoneyDisplay.tsx
|   |   |   |-- PaymentStatusBadge.tsx
|   |   |   `-- QrPaymentCard.tsx
|   |   |-- payments
|   |   |   |-- PasskeyAuthorization.tsx
|   |   |   |-- RecipientVerification.tsx
|   |   |   |-- TransactionError.tsx
|   |   |   |-- TransactionLayout.tsx
|   |   |   |-- TransactionProcessing.tsx
|   |   |   |-- TransactionProgress.tsx
|   |   |   |-- TransactionReceipt.tsx
|   |   |   |-- TransactionReview.tsx
|   |   |   `-- TransactionUnknown.tsx
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
|   |   |-- GatewayModels.ts
|   |   |-- Product.ts
|   |   |-- Statement.ts
|   |   |-- Transaction.ts
|   |   |-- TransactionTypes.ts
|   |   `-- User.ts
|   |-- providers
|   |   `-- Providers.tsx
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
|   |   |-- gateway
|   |   |   |-- fraudService.ts
|   |   |   |-- governanceService.ts
|   |   |   |-- merchantService.ts
|   |   |   |-- paymentService.ts
|   |   |   `-- settlementService.ts
|   |   |-- statement
|   |   |   `-- statementService.ts
|   |   `-- transaction
|   |       |-- idempotencyKeyService.ts
|   |       `-- transactionService.ts
|   |-- state
|   |   |-- authStore.ts
|   |   |-- queryClient.ts
|   |   `-- uiStore.ts
|   |-- utils
|   |   |-- constants.ts
|   |   |-- formatters.ts
|   |   |-- logger.ts
|   |   `-- validators.ts
|   `-- web-app-structure.md
|-- tailwind.config.ts
|-- tests
|   |-- e2e
|   |   |-- login.spec.ts
|   |   |-- statements.spec.ts
|   |   `-- transfer.spec.ts
|   `-- unit
|       |-- components
|       |   |-- qrTransfer.test.tsx
|       |   `-- transfers.test.tsx
|       `-- services
|           |-- authService.test.ts
|           |-- merchantService.test.ts
|           |-- paymentService.test.ts
|           `-- transactionService.test.ts
|-- tsconfig.json
`-- web-app-structure.md

141 directories, 192 files
