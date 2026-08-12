.
|-- ExpoBankingApp
|   |-- AGENTS.md
|   |-- App.tsx
|   |-- CLAUDE.md
|   |-- app.json
|   |-- index.ts
|   |-- mobile-app-structure.md
|   |-- package-lock.json
|   |-- package.json
|   |-- src
|   |   |-- app
|   |   |   |-- App.tsx
|   |   |   |-- AppProviders.tsx
|   |   |   |-- ErrorBoundary.tsx
|   |   |   `-- RootNavigator.tsx
|   |   |-- components
|   |   |   |-- accounts
|   |   |   |   `-- AccountBalanceCard.tsx
|   |   |   |-- common
|   |   |   |   |-- Button.tsx
|   |   |   |   |-- Card.tsx
|   |   |   |   |-- ErrorBanner.tsx
|   |   |   |   |-- Input.tsx
|   |   |   |   `-- LoadingOverlay.tsx
|   |   |   |-- security
|   |   |   |   |-- BiometricPrompt.tsx
|   |   |   |   `-- SecureScreenWrapper.tsx
|   |   |   `-- transactions
|   |   |       `-- TransactionListItem.tsx
|   |   |-- config
|   |   |   |-- env.ts
|   |   |   `-- featureFlags.ts
|   |   |-- hooks
|   |   |   |-- useAccounts.ts
|   |   |   |-- useAppLock.ts
|   |   |   |-- useAuth.ts
|   |   |   |-- useBiometric.ts
|   |   |   `-- useTransactions.ts
|   |   |-- mobile-app-structure.md
|   |   |-- models
|   |   |   |-- Account.ts
|   |   |   |-- ApiResponse.ts
|   |   |   |-- Product.ts
|   |   |   |-- Statement.ts
|   |   |   |-- Transaction.ts
|   |   |   `-- User.ts
|   |   |-- navigation
|   |   |   |-- AdminStackNavigator.tsx
|   |   |   |-- AuthNavigator.tsx
|   |   |   |-- MainStackNavigator.tsx
|   |   |   |-- MainTabNavigator.tsx
|   |   |   `-- types.ts
|   |   |-- screens
|   |   |   |-- accounts
|   |   |   |   |-- AccountDetailScreen.tsx
|   |   |   |   |-- AccountListScreen.tsx
|   |   |   |   `-- OpenAccountScreen.tsx
|   |   |   |-- admin
|   |   |   |   |-- AccountStatusManagementScreen.tsx
|   |   |   |   |-- AuditHistoryScreen.tsx
|   |   |   |   `-- AuditLogScreen.tsx
|   |   |   |-- auth
|   |   |   |   |-- BiometricSetupScreen.tsx
|   |   |   |   |-- FaceVerificationScreen.tsx
|   |   |   |   |-- ForgotPasswordScreen.tsx
|   |   |   |   |-- LoginScreen.tsx
|   |   |   |   `-- OtpVerificationScreen.tsx
|   |   |   |-- dashboard
|   |   |   |   |-- DashboardScreen.tsx
|   |   |   |   `-- NotificationsScreen.tsx
|   |   |   |-- products
|   |   |   |   `-- ProductCatalogScreen.tsx
|   |   |   |-- profile
|   |   |   |   |-- DeviceManagementScreen.tsx
|   |   |   |   |-- ProfileScreen.tsx
|   |   |   |   `-- SecuritySettingsScreen.tsx
|   |   |   |-- screens
|   |   |   |   `-- transfers
|   |   |   |       `-- TransferScreen.tsx
|   |   |   |-- statements
|   |   |   |   |-- StatementListScreen.tsx
|   |   |   |   `-- StatementViewerScreen.tsx
|   |   |   |-- transactions
|   |   |   |   |-- TransactionDetailScreen.tsx
|   |   |   |   |-- TransactionHistoryScreen.tsx
|   |   |   |   `-- TransactionsScreen.tsx
|   |   |   `-- transfers
|   |   |       |-- DepositScreen.tsx
|   |   |       |-- ExternalPaymentScreen.tsx
|   |   |       |-- TransferConfirmScreen.tsx
|   |   |       |-- TransferFormScreen.tsx
|   |   |       |-- TransferReviewScreen.tsx
|   |   |       `-- WithdrawScreen.tsx
|   |   |-- security
|   |   |   |-- AutoLockManager.ts
|   |   |   |-- DuressPinHandler.ts
|   |   |   |-- RoleGuard.tsx
|   |   |   |-- ScreenshotGuard.ts
|   |   |   `-- SessionGuard.tsx
|   |   |-- services
|   |   |   |-- account
|   |   |   |   `-- accountService.ts
|   |   |   |-- api
|   |   |   |   |-- apiClient.ts
|   |   |   |   |-- endpoints.ts
|   |   |   |   `-- interceptors
|   |   |   |       |-- authInterceptor.ts
|   |   |   |       |-- correlationIdInterceptor.ts
|   |   |   |       |-- errorInterceptor.ts
|   |   |   |       |-- idempotencyInterceptor.ts
|   |   |   |       `-- loggingInterceptor.ts
|   |   |   |-- auth
|   |   |   |   |-- authService.ts
|   |   |   |   |-- biometricAuthService.ts
|   |   |   |   |-- faceAuthService.ts
|   |   |   |   `-- tokenStorageService.ts
|   |   |   |-- notification
|   |   |   |   |-- frontend_logs.txt
|   |   |   |   |-- notificationService.ts
|   |   |   |   `-- pushNotificationService.ts
|   |   |   |-- security
|   |   |   |   |-- certificatePinningService.ts
|   |   |   |   |-- deviceIntegrityService.ts
|   |   |   |   `-- rootDetectionService.ts
|   |   |   |-- statement
|   |   |   |   `-- statementService.ts
|   |   |   `-- transaction
|   |   |       |-- idempotencyKeyService.ts
|   |   |       `-- transactionService.ts
|   |   |-- state
|   |   |   |-- accountSlice.ts
|   |   |   |-- api
|   |   |   |   |-- accountApi.ts
|   |   |   |   |-- authApi.ts
|   |   |   |   |-- productApi.ts
|   |   |   |   |-- statementApi.ts
|   |   |   |   `-- transactionApi.ts
|   |   |   |-- authSlice.ts
|   |   |   |-- store.ts
|   |   |   |-- transactionSlice.ts
|   |   |   `-- uiSlice.ts
|   |   |-- theme
|   |   |   |-- colors.ts
|   |   |   |-- spacing.ts
|   |   |   `-- typography.ts
|   |   |-- types
|   |   |   `-- declarations.d.ts
|   |   `-- utils
|   |       |-- constants.ts
|   |       |-- formatters.ts
|   |       |-- logger.ts
|   |       `-- validators.ts
|   `-- tsconfig.json
|-- api-gateway-hardening-prompt.md
|-- backend
|   |-- CHANGELOG.md
|   |-- Dockerfile
|   |-- README.md
|   |-- backend-app-structure.md
|   |-- build.gradle
|   |-- build.md
|   |-- checkstyle.xml
|   |-- docker-compose.yml
|   |-- gradlew.bat
|   |-- pom.xml
|   |-- settings.gradle
|   `-- src
|       |-- build.md
|       |-- main
|       |   |-- backend-app-structure.md
|       |   |-- java
|       |   |   |-- com
|       |   |   |   `-- company
|       |   |   |       `-- banking
|       |   |   |           |-- BankingApplication.java
|       |   |   |           |-- account
|       |   |   |           |   |-- api
|       |   |   |           |   |   |-- AccountController.java
|       |   |   |           |   |   `-- dto
|       |   |   |           |   |       |-- AccountResponse.java
|       |   |   |           |   |       |-- AccountSummaryResponse.java
|       |   |   |           |   |       `-- OpenAccountRequest.java
|       |   |   |           |   |-- application
|       |   |   |           |   |   |-- ChangeAccountStatusService.java
|       |   |   |           |   |   |-- GetAccountDetailsService.java
|       |   |   |           |   |   |-- ListCustomerAccountsService.java
|       |   |   |           |   |   |-- OpenAccountService.java
|       |   |   |           |   |   `-- port
|       |   |   |           |   |       |-- in
|       |   |   |           |   |       |   |-- AccountUseCase.java
|       |   |   |           |   |       |   |-- ChangeAccountStatusUseCase.java
|       |   |   |           |   |       |   |-- GetAccountDetailsUseCase.java
|       |   |   |           |   |       |   |-- ListCustomerAccountsUseCase.java
|       |   |   |           |   |       |   `-- OpenAccountUseCase.java
|       |   |   |           |   |       `-- out
|       |   |   |           |   |           `-- AccountPersistencePort.java
|       |   |   |           |   |-- domain
|       |   |   |           |   |   |-- Account.java
|       |   |   |           |   |   |-- AccountBalance.java
|       |   |   |           |   |   |-- AccountLimit.java
|       |   |   |           |   |   `-- AccountPolicy.java
|       |   |   |           |   `-- infrastructure
|       |   |   |           |       |-- AccountJpaRepository.java
|       |   |   |           |       `-- AccountPersistenceAdapter.java
|       |   |   |           |-- admin
|       |   |   |           |   |-- api
|       |   |   |           |   |   `-- AdminAuditController.java
|       |   |   |           |   |-- application
|       |   |   |           |   |   |-- ReviewAuditLogService.java
|       |   |   |           |   |   `-- port
|       |   |   |           |   |       |-- in
|       |   |   |           |   |       |   `-- AdminUseCase.java
|       |   |   |           |   |       `-- out
|       |   |   |           |   |           `-- AuditLogPersistencePort.java
|       |   |   |           |   `-- infrastructure
|       |   |   |           |       |-- AuditLogJpaEntity.java
|       |   |   |           |       |-- AuditLogJpaRepository.java
|       |   |   |           |       `-- AuditLogPersistenceAdapter.java
|       |   |   |           |-- apigateway
|       |   |   |           |   |-- api
|       |   |   |           |   |   |-- ApiKeyController.java
|       |   |   |           |   |   `-- dto
|       |   |   |           |   |       |-- ApiKeyResponse.java
|       |   |   |           |   |       `-- CreateApiKeyRequest.java
|       |   |   |           |   |-- application
|       |   |   |           |   |   |-- CreateApiKeyService.java
|       |   |   |           |   |   `-- port
|       |   |   |           |   |       |-- in
|       |   |   |           |   |       |   `-- CreateApiKeyUseCase.java
|       |   |   |           |   |       `-- out
|       |   |   |           |   |           `-- ApiKeyPersistencePort.java
|       |   |   |           |   |-- domain
|       |   |   |           |   |   `-- ApiKey.java
|       |   |   |           |   |-- infrastructure
|       |   |   |           |   |   |-- ApiKeyJpaAdapter.java
|       |   |   |           |   |   |-- ApiKeyJpaEntity.java
|       |   |   |           |   |   `-- ApiKeyJpaRepository.java
|       |   |   |           |   `-- security
|       |   |   |           |       |-- ApiKeyAuthenticationFilter.java
|       |   |   |           |       `-- CidrWhitelistValidator.java
|       |   |   |           |-- banking
|       |   |   |           |   `-- orchestration
|       |   |   |           |       `-- domain
|       |   |   |           |           `-- RoutingRule.java
|       |   |   |           |-- common
|       |   |   |           |   |-- audit
|       |   |   |           |   |   |-- AuditContext.java
|       |   |   |           |   |   |-- AuditEvent.java
|       |   |   |           |   |   |-- AuditEventPublisher.java
|       |   |   |           |   |   `-- AuditLogRecord.java
|       |   |   |           |   |-- enums
|       |   |   |           |   |   |-- AccountStatus.java
|       |   |   |           |   |   |-- RoleType.java
|       |   |   |           |   |   `-- TransactionType.java
|       |   |   |           |   |-- exception
|       |   |   |           |   |   |-- BusinessException.java
|       |   |   |           |   |   |-- ConflictException.java
|       |   |   |           |   |   |-- ErrorCode.java
|       |   |   |           |   |   |-- ForbiddenException.java
|       |   |   |           |   |   |-- GlobalExceptionHandler.java
|       |   |   |           |   |   `-- NotFoundException.java
|       |   |   |           |   |-- mapper
|       |   |   |           |   |   `-- BaseMapper.java
|       |   |   |           |   |-- response
|       |   |   |           |   |   |-- ApiResponse.java
|       |   |   |           |   |   `-- PagedResponse.java
|       |   |   |           |   `-- util
|       |   |   |           |       |-- DateUtils.java
|       |   |   |           |       |-- IdempotencyKeyUtils.java
|       |   |   |           |       |-- MaskingUtils.java
|       |   |   |           |       `-- MoneyUtils.java
|       |   |   |           |-- config
|       |   |   |           |   |-- ActuatorSecurityConfig.java
|       |   |   |           |   |-- AsyncConfig.java
|       |   |   |           |   |-- CacheConfig.java
|       |   |   |           |   |-- CorsConfig.java
|       |   |   |           |   |-- DataInitializer.java
|       |   |   |           |   |-- JacksonConfig.java
|       |   |   |           |   |-- OpenApiConfig.java
|       |   |   |           |   |-- RateLimitConfig.java
|       |   |   |           |   |-- SecretsConfig.java
|       |   |   |           |   `-- SecurityConfig.java
|       |   |   |           |-- customer
|       |   |   |           |   |-- api
|       |   |   |           |   |   |-- CustomerController.java
|       |   |   |           |   |   `-- dto
|       |   |   |           |   |       |-- CustomerCreateRequest.java
|       |   |   |           |   |       |-- CustomerResponse.java
|       |   |   |           |   |       |-- CustomerUpdateRequest.java
|       |   |   |           |   |       `-- NotificationResponse.java
|       |   |   |           |   |-- application
|       |   |   |           |   |   |-- CreateCustomerService.java
|       |   |   |           |   |   |-- GetCustomerAlertsService.java
|       |   |   |           |   |   |-- GetCustomerProfileService.java
|       |   |   |           |   |   |-- UpdateCustomerProfileService.java
|       |   |   |           |   |   `-- port
|       |   |   |           |   |       |-- in
|       |   |   |           |   |       |   |-- CreateCustomerUseCase.java
|       |   |   |           |   |       |   |-- CustomerUseCase.java
|       |   |   |           |   |       |   |-- GetCustomerAlertsUseCase.java
|       |   |   |           |   |       |   `-- GetCustomerProfileUseCase.java
|       |   |   |           |   |       `-- out
|       |   |   |           |   |           `-- CustomerPersistencePort.java
|       |   |   |           |   |-- domain
|       |   |   |           |   |   |-- Customer.java
|       |   |   |           |   |   |-- CustomerPolicy.java
|       |   |   |           |   |   `-- CustomerProfile.java
|       |   |   |           |   `-- infrastructure
|       |   |   |           |       |-- CustomerJpaRepository.java
|       |   |   |           |       `-- CustomerPersistenceAdapter.java
|       |   |   |           |-- legacy
|       |   |   |           |   |-- README.md
|       |   |   |           |   `-- v1-deprecated
|       |   |   |           |-- notification
|       |   |   |           |   |-- api
|       |   |   |           |   |   |-- NotificationController.java
|       |   |   |           |   |   `-- dto
|       |   |   |           |   |       `-- NotificationResponse.java
|       |   |   |           |   |-- application
|       |   |   |           |   |   |-- SendOtpNotificationService.java
|       |   |   |           |   |   |-- SendStatementReadyNotificationService.java
|       |   |   |           |   |   |-- SendTransactionAlertService.java
|       |   |   |           |   |   `-- port
|       |   |   |           |   |       `-- out
|       |   |   |           |   |           |-- EmailPort.java
|       |   |   |           |   |           |-- PushNotificationPort.java
|       |   |   |           |   |           `-- SmsPort.java
|       |   |   |           |   `-- infrastructure
|       |   |   |           |       |-- EmailProviderAdapter.java
|       |   |   |           |       |-- PushNotificationAdapter.java
|       |   |   |           |       `-- SmsProviderAdapter.java
|       |   |   |           |-- orchestration
|       |   |   |           |   |-- api
|       |   |   |           |   |   |-- OrchestrationController.java
|       |   |   |           |   |   `-- dto
|       |   |   |           |   |       |-- OrchestrationRequest.java
|       |   |   |           |   |       `-- OrchestrationResponse.java
|       |   |   |           |   |-- application
|       |   |   |           |   |   |-- PaymentOrchestrationService.java
|       |   |   |           |   |   `-- port
|       |   |   |           |   |       |-- in
|       |   |   |           |   |       |   `-- PaymentOrchestrationUseCase.java
|       |   |   |           |   |       `-- out
|       |   |   |           |   |           |-- MultiRailGatewayPort.java
|       |   |   |           |   |           `-- RoutingRulePersistencePort.java
|       |   |   |           |   |-- domain
|       |   |   |           |   |   |-- PaymentGateway.java
|       |   |   |           |   |   `-- PaymentRail.java
|       |   |   |           |   `-- infrastructure
|       |   |   |           |       |-- MultiRailGatewayAdapter.java
|       |   |   |           |       |-- RoutingRuleJpaAdapter.java
|       |   |   |           |       `-- RoutingRuleJpaRepository.java
|       |   |   |           |-- product
|       |   |   |           |   |-- api
|       |   |   |           |   |   `-- ProductController.java
|       |   |   |           |   |-- application
|       |   |   |           |   |   |-- GetProductCatalogService.java
|       |   |   |           |   |   `-- port
|       |   |   |           |   |       |-- in
|       |   |   |           |   |       |   `-- ProductUseCase.java
|       |   |   |           |   |       `-- out
|       |   |   |           |   |           `-- ProductPersistencePort.java
|       |   |   |           |   |-- domain
|       |   |   |           |   |   |-- BankProduct.java
|       |   |   |           |   |   `-- ProductType.java
|       |   |   |           |   `-- infrastructure
|       |   |   |           |       |-- ProductJpaRepository.java
|       |   |   |           |       `-- ProductPersistenceAdapter.java
|       |   |   |           |-- reporting
|       |   |   |           |   |-- api
|       |   |   |           |   |   `-- ReportingController.java
|       |   |   |           |   |-- application
|       |   |   |           |   |   |-- GenerateMonthlyReportService.java
|       |   |   |           |   |   `-- port
|       |   |   |           |   |       |-- in
|       |   |   |           |   |       |   `-- ReportingUseCase.java
|       |   |   |           |   |       `-- out
|       |   |   |           |   |           `-- ReportingPersistencePort.java
|       |   |   |           |   |-- domain
|       |   |   |           |   |   `-- ReportRequest.java
|       |   |   |           |   `-- infrastructure
|       |   |   |           |       `-- ReportingPersistenceAdapter.java
|       |   |   |           |-- security
|       |   |   |           |   |-- auth
|       |   |   |           |   |   |-- ApplicationSecurityBeansConfig.java
|       |   |   |           |   |   |-- AuthenticationController.java
|       |   |   |           |   |   |-- AuthenticationService.java
|       |   |   |           |   |   |-- AuthorizationService.java
|       |   |   |           |   |   |-- CustomUserDetailsService.java
|       |   |   |           |   |   |-- LoginAttemptService.java
|       |   |   |           |   |   `-- dto
|       |   |   |           |   |       |-- AuthenticationRequest.java
|       |   |   |           |   |       |-- AuthenticationResponse.java
|       |   |   |           |   |       `-- OtpRequest.java
|       |   |   |           |   |-- jwt
|       |   |   |           |   |   |-- JwtAuthenticationFilter.java
|       |   |   |           |   |   |-- JwtClaimsFactory.java
|       |   |   |           |   |   |-- JwtTokenProvider.java
|       |   |   |           |   |   `-- TokenBlacklistService.java
|       |   |   |           |   |-- mfa
|       |   |   |           |   |   |-- DeviceTrustService.java
|       |   |   |           |   |   |-- OtpService.java
|       |   |   |           |   |   `-- OtpVerificationService.java
|       |   |   |           |   `-- policy
|       |   |   |           |       |-- AccessPolicy.java
|       |   |   |           |       |-- PasswordPolicy.java
|       |   |   |           |       `-- SegregationOfDutiesPolicy.java
|       |   |   |           |-- statement
|       |   |   |           |   |-- api
|       |   |   |           |   |   |-- StatementController.java
|       |   |   |           |   |   `-- dto
|       |   |   |           |   |       `-- StatementResponse.java
|       |   |   |           |   |-- application
|       |   |   |           |   |   |-- GenerateStatementService.java
|       |   |   |           |   |   |-- GetStatementService.java
|       |   |   |           |   |   `-- port
|       |   |   |           |   |       |-- in
|       |   |   |           |   |       |   `-- StatementUseCase.java
|       |   |   |           |   |       `-- out
|       |   |   |           |   |           |-- StatementGeneratorPort.java
|       |   |   |           |   |           `-- StatementPersistencePort.java
|       |   |   |           |   |-- domain
|       |   |   |           |   |   `-- Statement.java
|       |   |   |           |   `-- infrastructure
|       |   |   |           |       |-- PdfStatementGenerator.java
|       |   |   |           |       |-- StatementJpaRepository.java
|       |   |   |           |       `-- StatementPersistenceAdapter.java
|       |   |   |           |-- transaction
|       |   |   |           |   |-- api
|       |   |   |           |   |   |-- TransactionController.java
|       |   |   |           |   |   |-- TransferController.java
|       |   |   |           |   |   `-- dto
|       |   |   |           |   |       |-- DepositRequest.java
|       |   |   |           |   |       |-- DisputeReasonRequest.java
|       |   |   |           |   |       |-- ExternalPaymentRequest.java
|       |   |   |           |   |       |-- InternalTransferRequest.java
|       |   |   |           |   |       |-- ReceiptNotificationRequest.java
|       |   |   |           |   |       |-- TransactionResponse.java
|       |   |   |           |   |       `-- WithdrawRequest.java
|       |   |   |           |   |-- application
|       |   |   |           |   |   |-- DepositService.java
|       |   |   |           |   |   |-- DisputeTransactionService.java
|       |   |   |           |   |   |-- ExternalPaymentService.java
|       |   |   |           |   |   |-- GetTransactionHistoryService.java
|       |   |   |           |   |   |-- IdempotencyGuardService.java
|       |   |   |           |   |   |-- InternalTransferService.java
|       |   |   |           |   |   |-- ReverseTransactionService.java
|       |   |   |           |   |   |-- ScheduledTransferService.java
|       |   |   |           |   |   |-- WithdrawService.java
|       |   |   |           |   |   `-- port
|       |   |   |           |   |       |-- in
|       |   |   |           |   |       |   |-- DepositUseCase.java
|       |   |   |           |   |       |   |-- ExternalPaymentUseCase.java
|       |   |   |           |   |       |   |-- GetTransactionHistoryUseCase.java
|       |   |   |           |   |       |   |-- TransactionUseCase.java
|       |   |   |           |   |       |   `-- WithdrawUseCase.java
|       |   |   |           |   |       `-- out
|       |   |   |           |   |           |-- FraudScreeningPort.java
|       |   |   |           |   |           |-- LedgerPersistencePort.java
|       |   |   |           |   |           `-- PaymentGatewayPort.java
|       |   |   |           |   |-- domain
|       |   |   |           |   |   |-- EntryType.java
|       |   |   |           |   |   |-- LedgerEntry.java
|       |   |   |           |   |   |-- SufficientFundsPolicy.java
|       |   |   |           |   |   |-- Transaction.java
|       |   |   |           |   |   |-- TransactionStatus.java
|       |   |   |           |   |   `-- TransferPolicy.java
|       |   |   |           |   `-- infrastructure
|       |   |   |           |       |-- FraudScreeningAdapter.java
|       |   |   |           |       |-- LedgerEntryJpaRepository.java
|       |   |   |           |       |-- LedgerJpaAdapter.java
|       |   |   |           |       |-- LedgerJpaRepository.java
|       |   |   |           |       |-- PaymentGatewayAdapter.java
|       |   |   |           |       `-- TransactionJpaRepository.java
|       |   |   |           `-- web
|       |   |   |               |-- advice
|       |   |   |               |   `-- ResponseSanitizerAdvice.java
|       |   |   |               |-- filter
|       |   |   |               |   |-- CorrelationIdFilter.java
|       |   |   |               |   |-- RateLimitFilter.java
|       |   |   |               |   |-- RequestLoggingFilter.java
|       |   |   |               |   `-- SecurityHeadersFilter.java
|       |   |   |               `-- interceptor
|       |   |   |                   `-- AuditInterceptor.java
|       |   |   `-- structure.md
|       |   `-- resources
|       |       |-- application-dev.yml
|       |       |-- application-prod.yml
|       |       |-- application-staging.yml
|       |       |-- application-test.yml
|       |       |-- application.yml
|       |       |-- banner.txt
|       |       |-- db
|       |       |   `-- migration
|       |       |       |-- V10__relax_legacy_api_keys_constraints.sql
|       |       |       |-- V12__add_kyc_fields_to_customers.sql
|       |       |       |-- V13__add_card_details_to_accounts.sql
|       |       |       |-- V1__init_schema.sql
|       |       |       |-- V2__accounts_and_balances.sql
|       |       |       |-- V3__transactions_and_ledger.sql
|       |       |       |-- V4__products_and_statements.sql
|       |       |       |-- V5__api_gateway_and_security.sql
|       |       |       |-- V6__orchestration_and_routing.sql
|       |       |       |-- V7__payroll_and_ledger.sql
|       |       |       |-- V8__add_transaction_dispute_columns.sql
|       |       |       `-- V9__api_gateway_enforcement.sql
|       |       `-- logback-spring.xml
|       `-- test
|           |-- java
|           |   `-- com
|           |       `-- company
|           |           `-- banking
|           |               |-- account
|           |               |-- customer
|           |               |-- integration
|           |               |   |-- AccountApiIT.java
|           |               |   `-- TransferFlowIT.java
|           |               |-- security
|           |               `-- transaction
|           `-- resources
|               `-- application-test.yml
|-- banking-backend-hardened-architecture.md
|-- codebase-infrastructure.md
|-- development-progress.md
|-- docs
|   |-- api-contracts.md
|   |-- architecture.md
|   |-- decisions
|   |   |-- ADR-0001-modular-monolith.md
|   |   |-- ADR-0002-jwt-vs-session.md
|   |   `-- ADR-0003-ledger-design.md
|   |-- deprecation-policy.md
|   |-- incident-runbook.md
|   |-- sequence-flows.md
|   `-- threat-model.md
|-- hardened-backend-implementation.md
|-- infra
|   |-- docker
|   |   `-- docker-compose.override.yml
|   |-- k8s
|   |   |-- deployment.yaml
|   |   |-- hpa.yaml
|   |   |-- ingress.yaml
|   |   `-- service.yaml
|   |-- loadbalancer
|   |   |-- lb-health-check.md
|   |   `-- upstream-pool.md
|   |-- nginx
|   |   |-- conf.d
|   |   |   |-- api.conf
|   |   |   `-- security-headers.conf
|   |   |-- nginx.conf
|   |   `-- tls
|   |       `-- README.md
|   `-- terraform
|-- mobile-app-react-native-architecture.md
|-- money-movement-feature-extension-prompt.md
|-- scaffold-mobile.sh
|-- scaffold-web.sh
|-- scaffold.sh
|-- scripts
|   |-- db-migrate.sh
|   `-- run-local.sh
|-- web-app
|   |-- README.md
|   |-- next-env.d.ts
|   |-- next.config.ts
|   |-- package-lock.json
|   |-- package.json
|   |-- postcss.config.mjs
|   |-- src
|   |   |-- app
|   |   |   |-- (admin)
|   |   |   |   |-- account-status
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- audit
|   |   |   |   |   `-- page.tsx
|   |   |   |   `-- layout.tsx
|   |   |   |-- (auth)
|   |   |   |   |-- login
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- otp
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- passkey-setup
|   |   |   |   |   `-- page.tsx
|   |   |   |   `-- register
|   |   |   |       `-- page.tsx
|   |   |   |-- (dashboard)
|   |   |   |   |-- accounts
|   |   |   |   |   |-- [accountId]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- api
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- layout.tsx
|   |   |   |   |-- products
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- profile
|   |   |   |   |   |-- devices
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- page.tsx
|   |   |   |   |   `-- security
|   |   |   |   |       `-- page.tsx
|   |   |   |   |-- statements
|   |   |   |   |   |-- [accountNumber]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- transactions
|   |   |   |   |   |-- deposit
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- external-payment
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- history
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- withdraw
|   |   |   |   |       `-- page.tsx
|   |   |   |   `-- transfers
|   |   |   |       |-- confirm
|   |   |   |       |   `-- page.tsx
|   |   |   |       |-- page.tsx
|   |   |   |       `-- review
|   |   |   |           `-- page.tsx
|   |   |   |-- api
|   |   |   |   |-- auth
|   |   |   |   |   |-- login
|   |   |   |   |   |   `-- route.ts
|   |   |   |   |   |-- logout
|   |   |   |   |   |   `-- route.ts
|   |   |   |   |   `-- refresh
|   |   |   |   |       `-- route.ts
|   |   |   |   |-- health
|   |   |   |   |   `-- route.ts
|   |   |   |   `-- proxy
|   |   |   |       |-- accounts
|   |   |   |       |   `-- route.ts
|   |   |   |       |-- apikeys
|   |   |   |       |   |-- [id]
|   |   |   |       |   |   `-- [action]
|   |   |   |       |   |       `-- route.ts
|   |   |   |       |   `-- route.ts
|   |   |   |       |-- auth
|   |   |   |       |   |-- login
|   |   |   |       |   |   `-- route.ts
|   |   |   |       |   |-- logout
|   |   |   |       |   |   `-- route.ts
|   |   |   |       |   |-- otp
|   |   |   |       |   |   |-- send
|   |   |   |       |   |   |   `-- route.ts
|   |   |   |       |   |   `-- verify
|   |   |   |       |   |       `-- route.ts
|   |   |   |       |   |-- refresh
|   |   |   |       |   |   `-- route.ts
|   |   |   |       |   `-- register
|   |   |   |       |       `-- route.ts
|   |   |   |       |-- gateway-test
|   |   |   |       |   `-- route.ts
|   |   |   |       |-- products
|   |   |   |       |   `-- route.ts
|   |   |   |       |-- statements
|   |   |   |       |   |-- account
|   |   |   |       |   |   `-- [accountNumber]
|   |   |   |       |   |       `-- route.ts
|   |   |   |       |   `-- route.ts
|   |   |   |       |-- transactions
|   |   |   |       |   |-- history
|   |   |   |       |   |   `-- [accountNumber]
|   |   |   |       |   |       `-- route.ts
|   |   |   |       |   |-- receipt
|   |   |   |       |   |   `-- route.ts
|   |   |   |       |   `-- route.ts
|   |   |   |       `-- transfers
|   |   |   |           |-- internal
|   |   |   |           |   `-- route.ts
|   |   |   |           `-- route.ts
|   |   |   |-- developers
|   |   |   |   |-- [...slug]
|   |   |   |   |   `-- page.tsx
|   |   |   |   `-- page.tsx
|   |   |   |-- error.tsx
|   |   |   |-- globals.css
|   |   |   |-- icon.svg
|   |   |   |-- layout.tsx
|   |   |   |-- not-found.tsx
|   |   |   `-- page.tsx
|   |   |-- components
|   |   |   |-- accounts
|   |   |   |   `-- AccountBalanceCard.tsx
|   |   |   |-- api
|   |   |   |   |-- ApiKeyManager.tsx
|   |   |   |   `-- DomainLibrary.tsx
|   |   |   |-- common
|   |   |   |   |-- Button.tsx
|   |   |   |   |-- Card.tsx
|   |   |   |   |-- ErrorBanner.tsx
|   |   |   |   |-- Input.tsx
|   |   |   |   `-- LoadingOverlay.tsx
|   |   |   |-- docs
|   |   |   |   `-- ApiReferenceViewer.tsx
|   |   |   |-- security
|   |   |   |   |-- MaskedValue.tsx
|   |   |   |   `-- PasskeyPrompt.tsx
|   |   |   `-- transactions
|   |   |       `-- TransactionListItem.tsx
|   |   |-- config
|   |   |   |-- env.ts
|   |   |   `-- featureFlags.ts
|   |   |-- hooks
|   |   |   |-- useAccounts.ts
|   |   |   |-- useAuth.ts
|   |   |   |-- useIdleTimeout.ts
|   |   |   `-- useTransactions.ts
|   |   |-- middleware.ts
|   |   |-- models
|   |   |   |-- Account.ts
|   |   |   |-- ApiResponse.ts
|   |   |   |-- Product.ts
|   |   |   |-- Statement.ts
|   |   |   |-- Transaction.ts
|   |   |   `-- User.ts
|   |   |-- providers
|   |   |   `-- Providers.tsx
|   |   |-- security
|   |   |   |-- RoleGuard.tsx
|   |   |   |-- SessionGuard.tsx
|   |   |   |-- csp.ts
|   |   |   `-- rateLimiter.ts
|   |   |-- services
|   |   |   |-- account
|   |   |   |   `-- accountService.ts
|   |   |   |-- api
|   |   |   |   |-- endpoints.ts
|   |   |   |   |-- httpClient.ts
|   |   |   |   `-- interceptors
|   |   |   |       |-- correlationIdInterceptor.ts
|   |   |   |       |-- errorInterceptor.ts
|   |   |   |       `-- idempotencyInterceptor.ts
|   |   |   |-- auth
|   |   |   |   |-- authService.ts
|   |   |   |   |-- passkeyService.ts
|   |   |   |   `-- sessionService.ts
|   |   |   |-- docs
|   |   |   |   |-- apiTestRunner.ts
|   |   |   |   `-- openApiService.ts
|   |   |   |-- statement
|   |   |   |   `-- statementService.ts
|   |   |   `-- transaction
|   |   |       |-- idempotencyKeyService.ts
|   |   |       `-- transactionService.ts
|   |   |-- state
|   |   |   |-- authStore.ts
|   |   |   |-- queryClient.ts
|   |   |   `-- uiStore.ts
|   |   |-- utils
|   |   |   |-- constants.ts
|   |   |   |-- formatters.ts
|   |   |   |-- logger.ts
|   |   |   `-- validators.ts
|   |   `-- web-app-structure.md
|   |-- src.7z
|   |-- tailwind.config.ts
|   |-- tests
|   |   |-- e2e
|   |   |   |-- login.spec.ts
|   |   |   |-- statements.spec.ts
|   |   |   `-- transfer.spec.ts
|   |   `-- unit
|   |       `-- services
|   |           |-- authService.test.ts
|   |           `-- transactionService.test.ts
|   |-- tsconfig.json
|   `-- web-app-structure.md
`-- web-frontend-nextjs-architecture.md

266 directories, 506 files
