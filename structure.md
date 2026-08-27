.
|-- CHANGELOG.md
|-- ExpoBankingApp
|   |-- AGENTS.md
|   |-- App.tsx
|   |-- CLAUDE.md
|   |-- app.json
|   |-- assets
|   |   |-- adaptive-icon.png
|   |   |-- favicon.png
|   |   |-- icon.png
|   |   `-- splash-icon.png
|   |-- babel.config.js
|   |-- index.ts
|   |-- mobile-app-structure.md
|   |-- package-lock.json
|   |-- package.json
|   |-- plugins
|   |   `-- withNotifeeMaven.js
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
|   |   |   |   |-- PushAuthorizationModal.tsx
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
|   |   |   |-- usePendingAuthorizations.ts
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
|   |   |   |-- navigationUtils.ts
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
|   |   |   |   |-- DirectMessagingService.ts
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
|   |-- structure-mobileapp.md
|   `-- tsconfig.json
|-- PORT_REGISTRY.md
|-- api-gateway-hardening-prompt.md
|-- architecture_review.md
|-- backend
|   |-- Backend.logs
|   |-- CHANGELOG.md
|   |-- Dockerfile
|   |-- README.md
|   |-- backend-app-structure.md
|   |-- backendstructure.md
|   |-- build.gradle
|   |-- build.md
|   |-- checkstyle.xml
|   |-- dev.bat
|   |-- docker-compose.yml
|   |-- fix-backend-tests.mjs
|   |-- gradlew
|   |-- gradlew.bat
|   |-- hs_err_pid3708.log
|   |-- hs_err_pid5552.log
|   |-- logs.log
|   |-- logs.md
|   |-- pom.xml
|   |-- settings.gradle
|   |-- src
|   |   |-- build.md
|   |   |-- e2eTest
|   |   |   `-- java
|   |   |       `-- com
|   |   |           `-- company
|   |   |               `-- banking
|   |   |                   |-- apigateway
|   |   |                   |-- integration
|   |   |                   `-- payment
|   |   |-- integrationTest
|   |   |   `-- java
|   |   |       `-- com
|   |   |           `-- company
|   |   |               `-- banking
|   |   |                   |-- apigateway
|   |   |                   |   |-- api
|   |   |                   |   `-- security
|   |   |                   |-- integration
|   |   |                   |-- payment
|   |   |                   |-- security
|   |   |                   |   `-- auth
|   |   |                   |-- settlement
|   |   |                   `-- transaction
|   |   |-- main
|   |   |   |-- backend-app-structure.md
|   |   |   |-- java
|   |   |   |   |-- com
|   |   |   |   |   `-- company
|   |   |   |   |       `-- banking
|   |   |   |   |           |-- BankingApplication.java
|   |   |   |   |           |-- account
|   |   |   |   |           |   |-- api
|   |   |   |   |           |   |   |-- AccountController.java
|   |   |   |   |           |   |   `-- dto
|   |   |   |   |           |   |       |-- AccountResponse.java
|   |   |   |   |           |   |       |-- AccountSummaryResponse.java
|   |   |   |   |           |   |       |-- OpenAccountRequest.java
|   |   |   |   |           |   |       `-- UpdateAccountSettingsRequest.java
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- AccountProvisioningService.java
|   |   |   |   |           |   |   |-- ChangeAccountStatusService.java
|   |   |   |   |           |   |   |-- GetAccountDetailsService.java
|   |   |   |   |           |   |   |-- GlobalAccountLockGuard.java
|   |   |   |   |           |   |   |-- ListCustomerAccountsService.java
|   |   |   |   |           |   |   |-- OpenAccountService.java
|   |   |   |   |           |   |   |-- UpdateAccountSettingsService.java
|   |   |   |   |           |   |   |-- port
|   |   |   |   |           |   |   |   |-- in
|   |   |   |   |           |   |   |   |   |-- AccountUseCase.java
|   |   |   |   |           |   |   |   |   |-- ChangeAccountStatusUseCase.java
|   |   |   |   |           |   |   |   |   |-- GetAccountDetailsUseCase.java
|   |   |   |   |           |   |   |   |   |-- ListCustomerAccountsUseCase.java
|   |   |   |   |           |   |   |   |   |-- OpenAccountUseCase.java
|   |   |   |   |           |   |   |   |   `-- UpdateAccountSettingsUseCase.java
|   |   |   |   |           |   |   |   `-- out
|   |   |   |   |           |   |   |       `-- AccountPersistencePort.java
|   |   |   |   |           |   |   `-- provisioning
|   |   |   |   |           |   |       |-- AccountNumberGenerator.java
|   |   |   |   |           |   |       |-- CardProvisioner.java
|   |   |   |   |           |   |       `-- ParentAccountValidator.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   |-- Account.java
|   |   |   |   |           |   |   |-- AccountBalance.java
|   |   |   |   |           |   |   |-- AccountLimit.java
|   |   |   |   |           |   |   `-- AccountPolicy.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       |-- AccountJpaRepository.java
|   |   |   |   |           |       `-- AccountPersistenceAdapter.java
|   |   |   |   |           |-- admin
|   |   |   |   |           |   |-- api
|   |   |   |   |           |   |   `-- AdminAuditController.java
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- KycApprovalService.java
|   |   |   |   |           |   |   |-- ReviewAuditLogService.java
|   |   |   |   |           |   |   `-- port
|   |   |   |   |           |   |       |-- in
|   |   |   |   |           |   |       |   |-- AdminUseCase.java
|   |   |   |   |           |   |       |   `-- KycApprovalUseCase.java
|   |   |   |   |           |   |       `-- out
|   |   |   |   |           |   |           `-- AuditLogPersistencePort.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       |-- AuditLogJpaEntity.java
|   |   |   |   |           |       |-- AuditLogJpaRepository.java
|   |   |   |   |           |       `-- AuditLogPersistenceAdapter.java
|   |   |   |   |           |-- aml
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- AmlCaseService.java
|   |   |   |   |           |   |   `-- TransactionMonitoringService.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   |-- AccountHold.java
|   |   |   |   |           |   |   |-- AmlAlert.java
|   |   |   |   |           |   |   |-- AmlCase.java
|   |   |   |   |           |   |   `-- SuspiciousTransactionReport.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       `-- AmlAlertJpaRepository.java
|   |   |   |   |           |-- apigateway
|   |   |   |   |           |   |-- api
|   |   |   |   |           |   |   |-- ApiKeyController.java
|   |   |   |   |           |   |   |-- LocalWebhookSimulatorController.java
|   |   |   |   |           |   |   |-- WebhookController.java
|   |   |   |   |           |   |   `-- dto
|   |   |   |   |           |   |       |-- ApiKeyResponse.java
|   |   |   |   |           |   |       `-- CreateApiKeyRequest.java
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- ApiClientService.java
|   |   |   |   |           |   |   |-- CreateApiKeyService.java
|   |   |   |   |           |   |   |-- WebhookDispatcherService.java
|   |   |   |   |           |   |   |-- WebhookManagementService.java
|   |   |   |   |           |   |   `-- port
|   |   |   |   |           |   |       |-- in
|   |   |   |   |           |   |       |   `-- CreateApiKeyUseCase.java
|   |   |   |   |           |   |       `-- out
|   |   |   |   |           |   |           `-- ApiKeyPersistencePort.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   |-- ApiAuditEvent.java
|   |   |   |   |           |   |   |-- ApiClient.java
|   |   |   |   |           |   |   |-- ApiKey.java
|   |   |   |   |           |   |   |-- WebhookDelivery.java
|   |   |   |   |           |   |   `-- WebhookEndpoint.java
|   |   |   |   |           |   |-- infrastructure
|   |   |   |   |           |   |   |-- ApiAuditEventJpaRepository.java
|   |   |   |   |           |   |   |-- ApiClientJpaRepository.java
|   |   |   |   |           |   |   |-- ApiKeyJpaAdapter.java
|   |   |   |   |           |   |   |-- ApiKeyJpaEntity.java
|   |   |   |   |           |   |   |-- ApiKeyJpaRepository.java
|   |   |   |   |           |   |   |-- WebhookDeliveryJpaRepository.java
|   |   |   |   |           |   |   `-- WebhookEndpointJpaRepository.java
|   |   |   |   |           |   |-- presentation
|   |   |   |   |           |   |   `-- DynamicQrController.java
|   |   |   |   |           |   `-- security
|   |   |   |   |           |       |-- ApiAuditLoggingFilter.java
|   |   |   |   |           |       |-- ApiGatewayIdempotencyInterceptor.java
|   |   |   |   |           |       |-- ApiKeyAuthenticationFilter.java
|   |   |   |   |           |       |-- ApiKeyAuthenticationToken.java
|   |   |   |   |           |       |-- ApiSignatureFilter.java
|   |   |   |   |           |       |-- CidrWhitelistValidator.java
|   |   |   |   |           |       |-- GatewayRateLimitFilter.java
|   |   |   |   |           |       `-- SandboxRoutingAspect.java
|   |   |   |   |           |-- banking
|   |   |   |   |           |   `-- orchestration
|   |   |   |   |           |       `-- domain
|   |   |   |   |           |           `-- RoutingRule.java
|   |   |   |   |           |-- common
|   |   |   |   |           |   |-- audit
|   |   |   |   |           |   |   |-- AuditContext.java
|   |   |   |   |           |   |   |-- AuditEvent.java
|   |   |   |   |           |   |   |-- AuditEventPublisher.java
|   |   |   |   |           |   |   `-- AuditLogRecord.java
|   |   |   |   |           |   |-- enums
|   |   |   |   |           |   |   |-- AccountStatus.java
|   |   |   |   |           |   |   |-- RoleType.java
|   |   |   |   |           |   |   `-- TransactionType.java
|   |   |   |   |           |   |-- exception
|   |   |   |   |           |   |   |-- BusinessException.java
|   |   |   |   |           |   |   |-- ConflictException.java
|   |   |   |   |           |   |   |-- ErrorCode.java
|   |   |   |   |           |   |   |-- ForbiddenException.java
|   |   |   |   |           |   |   |-- GlobalExceptionHandler.java
|   |   |   |   |           |   |   `-- NotFoundException.java
|   |   |   |   |           |   |-- mapper
|   |   |   |   |           |   |   `-- BaseMapper.java
|   |   |   |   |           |   |-- resilience
|   |   |   |   |           |   |   |-- CriticalBusinessService.java
|   |   |   |   |           |   |   |-- CriticalBusinessServiceJpaRepository.java
|   |   |   |   |           |   |   |-- PaymentFailoverService.java
|   |   |   |   |           |   |   `-- ResilienceEngine.java
|   |   |   |   |           |   |-- response
|   |   |   |   |           |   |   |-- ApiResponse.java
|   |   |   |   |           |   |   `-- PagedResponse.java
|   |   |   |   |           |   `-- util
|   |   |   |   |           |       |-- DateUtils.java
|   |   |   |   |           |       |-- IdempotencyKeyUtils.java
|   |   |   |   |           |       |-- MaskingUtils.java
|   |   |   |   |           |       `-- MoneyUtils.java
|   |   |   |   |           |-- complaint
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   `-- CustomerComplaintService.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   `-- CustomerComplaint.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       `-- CustomerComplaintJpaRepository.java
|   |   |   |   |           |-- config
|   |   |   |   |           |   |-- ActuatorSecurityConfig.java
|   |   |   |   |           |   |-- AsyncConfig.java
|   |   |   |   |           |   |-- CacheConfig.java
|   |   |   |   |           |   |-- CorsConfig.java
|   |   |   |   |           |   |-- DataInitializer.java
|   |   |   |   |           |   |-- FilterRegistrationConfig.java
|   |   |   |   |           |   |-- JacksonConfig.java
|   |   |   |   |           |   |-- OpenApiConfig.java
|   |   |   |   |           |   |-- RateLimitConfig.java
|   |   |   |   |           |   |-- SecretsConfig.java
|   |   |   |   |           |   |-- SecurityConfig.java
|   |   |   |   |           |   `-- WebSocketConfig.java
|   |   |   |   |           |-- customer
|   |   |   |   |           |   |-- api
|   |   |   |   |           |   |   |-- CustomerController.java
|   |   |   |   |           |   |   `-- dto
|   |   |   |   |           |   |       |-- CustomerCreateRequest.java
|   |   |   |   |           |   |       |-- CustomerResponse.java
|   |   |   |   |           |   |       |-- CustomerUpdateRequest.java
|   |   |   |   |           |   |       `-- NotificationResponse.java
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- CreateCustomerService.java
|   |   |   |   |           |   |   |-- GetCustomerAlertsService.java
|   |   |   |   |           |   |   |-- GetCustomerProfileService.java
|   |   |   |   |           |   |   |-- UpdateCustomerProfileService.java
|   |   |   |   |           |   |   `-- port
|   |   |   |   |           |   |       |-- in
|   |   |   |   |           |   |       |   |-- CreateCustomerUseCase.java
|   |   |   |   |           |   |       |   |-- CustomerUseCase.java
|   |   |   |   |           |   |       |   |-- GetCustomerAlertsUseCase.java
|   |   |   |   |           |   |       |   `-- GetCustomerProfileUseCase.java
|   |   |   |   |           |   |       `-- out
|   |   |   |   |           |   |           `-- CustomerPersistencePort.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   |-- Customer.java
|   |   |   |   |           |   |   |-- CustomerPolicy.java
|   |   |   |   |           |   |   `-- CustomerProfile.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       |-- CustomerJpaRepository.java
|   |   |   |   |           |       `-- CustomerPersistenceAdapter.java
|   |   |   |   |           |-- fraud
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   `-- FraudManagementService.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   |-- DeviceRisk.java
|   |   |   |   |           |   |   `-- FraudCase.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       |-- DeviceRiskJpaRepository.java
|   |   |   |   |           |       `-- FraudCaseJpaRepository.java
|   |   |   |   |           |-- governance
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- RegulatoryGovernanceService.java
|   |   |   |   |           |   |   `-- RegulatoryReportingService.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   |-- ComplianceEvidenceRecord.java
|   |   |   |   |           |   |   `-- RegulatoryRequirement.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       |-- ComplianceEvidenceRecordJpaRepository.java
|   |   |   |   |           |       `-- RegulatoryRequirementJpaRepository.java
|   |   |   |   |           |-- legacy
|   |   |   |   |           |   |-- README.md
|   |   |   |   |           |   `-- v1-deprecated
|   |   |   |   |           |-- merchant
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   `-- MerchantApplicationService.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   `-- Merchant.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       `-- MerchantJpaRepository.java
|   |   |   |   |           |-- notification
|   |   |   |   |           |   |-- api
|   |   |   |   |           |   |   |-- NotificationController.java
|   |   |   |   |           |   |   `-- dto
|   |   |   |   |           |   |       `-- NotificationResponse.java
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- SendOtpNotificationService.java
|   |   |   |   |           |   |   |-- SendStatementReadyNotificationService.java
|   |   |   |   |           |   |   |-- SendTransactionAlertService.java
|   |   |   |   |           |   |   `-- port
|   |   |   |   |           |   |       `-- out
|   |   |   |   |           |   |           |-- EmailPort.java
|   |   |   |   |           |   |           |-- PushNotificationPort.java
|   |   |   |   |           |   |           `-- SmsPort.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       |-- EmailProviderAdapter.java
|   |   |   |   |           |       |-- PushNotificationAdapter.java
|   |   |   |   |           |       `-- SmsProviderAdapter.java
|   |   |   |   |           |-- orchestration
|   |   |   |   |           |   |-- api
|   |   |   |   |           |   |   |-- OrchestrationController.java
|   |   |   |   |           |   |   `-- dto
|   |   |   |   |           |   |       |-- OrchestrationRequest.java
|   |   |   |   |           |   |       `-- OrchestrationResponse.java
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- PaymentOrchestrationService.java
|   |   |   |   |           |   |   |-- ReconciliationService.java
|   |   |   |   |           |   |   `-- port
|   |   |   |   |           |   |       |-- in
|   |   |   |   |           |   |       |   `-- PaymentOrchestrationUseCase.java
|   |   |   |   |           |   |       `-- out
|   |   |   |   |           |   |           |-- MultiRailGatewayPort.java
|   |   |   |   |           |   |           |-- PaymentRailConfigurationPort.java
|   |   |   |   |           |   |           `-- RoutingRulePersistencePort.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   |-- PaymentGateway.java
|   |   |   |   |           |   |   |-- PaymentRail.java
|   |   |   |   |           |   |   `-- PaymentRailConfiguration.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       |-- MultiRailGatewayAdapter.java
|   |   |   |   |           |       |-- PaymentRailConfigurationJpaAdapter.java
|   |   |   |   |           |       |-- PaymentRailConfigurationJpaRepository.java
|   |   |   |   |           |       |-- RoutingRuleJpaAdapter.java
|   |   |   |   |           |       `-- RoutingRuleJpaRepository.java
|   |   |   |   |           |-- payment
|   |   |   |   |           |   |-- api
|   |   |   |   |           |   |   |-- CheckoutSessionController.java
|   |   |   |   |           |   |   |-- InstitutionPaymentController.java
|   |   |   |   |           |   |   |-- MerchantGatewayController.java
|   |   |   |   |           |   |   |-- PaymentGatewayController.java
|   |   |   |   |           |   |   |-- PaymentIntentController.java
|   |   |   |   |           |   |   |-- PaymentWebhookController.java
|   |   |   |   |           |   |   |-- PublicCheckoutController.java
|   |   |   |   |           |   |   `-- dto
|   |   |   |   |           |   |       |-- AuthorizeCheckoutRequest.java
|   |   |   |   |           |   |       |-- CheckoutSessionRequest.java
|   |   |   |   |           |   |       |-- CheckoutSessionResponse.java
|   |   |   |   |           |   |       |-- CreatePaymentIntentRequest.java
|   |   |   |   |           |   |       |-- CreatePaymentSessionRequest.java
|   |   |   |   |           |   |       |-- ExternalCheckoutRequest.java
|   |   |   |   |           |   |       |-- InitiatePaymentRequest.java
|   |   |   |   |           |   |       |-- InitiatePaymentResponse.java
|   |   |   |   |           |   |       |-- LineItemDto.java
|   |   |   |   |           |   |       |-- PaymentReceiptData.java
|   |   |   |   |           |   |       |-- PaymentSessionApiResponse.java
|   |   |   |   |           |   |       |-- PaymentSessionResponse.java
|   |   |   |   |           |   |       |-- PublicCheckoutSessionResponse.java
|   |   |   |   |           |   |       |-- SelectPaymentMethodRequest.java
|   |   |   |   |           |   |       |-- SessionValidationResponse.java
|   |   |   |   |           |   |       `-- merchant
|   |   |   |   |           |   |           |-- MerchantCheckoutRequest.java
|   |   |   |   |           |   |           |-- MerchantPaymentResponse.java
|   |   |   |   |           |   |           `-- MerchantRefundRequest.java
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- CheckoutPaymentConfirmationService.java
|   |   |   |   |           |   |   |-- CheckoutPaymentMethodService.java
|   |   |   |   |           |   |   |-- CheckoutSessionService.java
|   |   |   |   |           |   |   |-- DynamicQrService.java
|   |   |   |   |           |   |   |-- GatewayDisputeService.java
|   |   |   |   |           |   |   |-- InstitutionCallbackService.java
|   |   |   |   |           |   |   |-- InstitutionPaymentService.java
|   |   |   |   |           |   |   |-- InternalAccountAuthorizationService.java
|   |   |   |   |           |   |   |-- InternalPaymentExecutionService.java
|   |   |   |   |           |   |   |-- MerchantWebhookDeliveryService.java
|   |   |   |   |           |   |   |-- PaymentEventOutboxRelay.java
|   |   |   |   |           |   |   |-- PaymentEventOutboxService.java
|   |   |   |   |           |   |   |-- PaymentIdempotencyService.java
|   |   |   |   |           |   |   |-- PaymentIntentOrchestrationService.java
|   |   |   |   |           |   |   |-- PaymentIntentService.java
|   |   |   |   |           |   |   |-- PaymentMessagingService.java
|   |   |   |   |           |   |   |-- PaymentReconciliationService.java
|   |   |   |   |           |   |   |-- PaymentStateMachineService.java
|   |   |   |   |           |   |   |-- PaymentWebhookService.java
|   |   |   |   |           |   |   |-- PublicCheckoutService.java
|   |   |   |   |           |   |   |-- WebhookIdempotencyService.java
|   |   |   |   |           |   |   `-- port
|   |   |   |   |           |   |       `-- out
|   |   |   |   |           |   |           `-- ExternalPaymentGateway.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   |-- CheckoutPaymentMethod.java
|   |   |   |   |           |   |   |-- CheckoutSession.java
|   |   |   |   |           |   |   |-- CheckoutSessionStateTransitionPolicy.java
|   |   |   |   |           |   |   |-- CheckoutSessionStatus.java
|   |   |   |   |           |   |   |-- DynamicQrPayment.java
|   |   |   |   |           |   |   |-- GatewayDispute.java
|   |   |   |   |           |   |   |-- HierarchicalLimitValidator.java
|   |   |   |   |           |   |   |-- InboundWebhookEvent.java
|   |   |   |   |           |   |   |-- Institution.java
|   |   |   |   |           |   |   |-- InstitutionCallbackLog.java
|   |   |   |   |           |   |   |-- InstitutionCallbackPayload.java
|   |   |   |   |           |   |   |-- PaymentAttempt.java
|   |   |   |   |           |   |   |-- PaymentAuthorization.java
|   |   |   |   |           |   |   |-- PaymentAuthorizationStatus.java
|   |   |   |   |           |   |   |-- PaymentChannel.java
|   |   |   |   |           |   |   |-- PaymentEvent.java
|   |   |   |   |           |   |   |-- PaymentEventOutbox.java
|   |   |   |   |           |   |   |-- PaymentEventOutboxStatus.java
|   |   |   |   |           |   |   |-- PaymentEventType.java
|   |   |   |   |           |   |   |-- PaymentIntent.java
|   |   |   |   |           |   |   |-- PaymentIntentStatus.java
|   |   |   |   |           |   |   |-- PaymentMessage.java
|   |   |   |   |           |   |   |-- PaymentMethod.java
|   |   |   |   |           |   |   |-- PaymentParticipant.java
|   |   |   |   |           |   |   |-- PaymentProvider.java
|   |   |   |   |           |   |   |-- PaymentReceiptPolicy.java
|   |   |   |   |           |   |   |-- PaymentSession.java
|   |   |   |   |           |   |   |-- PaymentSessionStatus.java
|   |   |   |   |           |   |   |-- PaymentStateTransitionPolicy.java
|   |   |   |   |           |   |   |-- Refund.java
|   |   |   |   |           |   |   `-- exception
|   |   |   |   |           |   |       `-- PaymentRequiredException.java
|   |   |   |   |           |   |-- gateway
|   |   |   |   |           |   |   |-- DefaultExternalPaymentGateway.java
|   |   |   |   |           |   |   |-- ExternalPaymentGateway.java
|   |   |   |   |           |   |   |-- PaymentWebhookVerifier.java
|   |   |   |   |           |   |   `-- dto
|   |   |   |   |           |   |       |-- ExternalCheckoutRequest.java
|   |   |   |   |           |   |       |-- GatewayPaymentStatus.java
|   |   |   |   |           |   |       `-- PaymentSession.java
|   |   |   |   |           |   |-- infrastructure
|   |   |   |   |           |   |   |-- CheckoutSessionJpaRepository.java
|   |   |   |   |           |   |   |-- DynamicQrPaymentJpaRepository.java
|   |   |   |   |           |   |   |-- GatewayDisputeJpaRepository.java
|   |   |   |   |           |   |   |-- InboundWebhookEventJpaRepository.java
|   |   |   |   |           |   |   |-- InstitutionCallbackLogJpaRepository.java
|   |   |   |   |           |   |   |-- InstitutionJpaRepository.java
|   |   |   |   |           |   |   |-- PaymentAttemptJpaRepository.java
|   |   |   |   |           |   |   |-- PaymentAuthorizationJpaRepository.java
|   |   |   |   |           |   |   |-- PaymentEventJpaRepository.java
|   |   |   |   |           |   |   |-- PaymentEventOutboxJpaRepository.java
|   |   |   |   |           |   |   |-- PaymentIntentJpaRepository.java
|   |   |   |   |           |   |   |-- PaymentMessageJpaRepository.java
|   |   |   |   |           |   |   |-- PaymentParticipantJpaRepository.java
|   |   |   |   |           |   |   |-- PaymentSessionJpaRepository.java
|   |   |   |   |           |   |   `-- RefundJpaRepository.java
|   |   |   |   |           |   `-- routing
|   |   |   |   |           |       |-- ConfigurablePaymentRouter.java
|   |   |   |   |           |       `-- PaymentRouter.java
|   |   |   |   |           |-- product
|   |   |   |   |           |   |-- api
|   |   |   |   |           |   |   `-- ProductController.java
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- GetProductCatalogService.java
|   |   |   |   |           |   |   `-- port
|   |   |   |   |           |   |       |-- in
|   |   |   |   |           |   |       |   `-- ProductUseCase.java
|   |   |   |   |           |   |       `-- out
|   |   |   |   |           |   |           `-- ProductPersistencePort.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   |-- BankProduct.java
|   |   |   |   |           |   |   `-- ProductType.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       |-- ProductJpaRepository.java
|   |   |   |   |           |       `-- ProductPersistenceAdapter.java
|   |   |   |   |           |-- reporting
|   |   |   |   |           |   |-- api
|   |   |   |   |           |   |   `-- ReportingController.java
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- GenerateMonthlyReportService.java
|   |   |   |   |           |   |   `-- port
|   |   |   |   |           |   |       |-- in
|   |   |   |   |           |   |       |   `-- ReportingUseCase.java
|   |   |   |   |           |   |       `-- out
|   |   |   |   |           |   |           `-- ReportingPersistencePort.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   `-- ReportRequest.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       `-- ReportingPersistenceAdapter.java
|   |   |   |   |           |-- security
|   |   |   |   |           |   |-- auth
|   |   |   |   |           |   |   |-- ApplicationSecurityBeansConfig.java
|   |   |   |   |           |   |   |-- AuthenticationController.java
|   |   |   |   |           |   |   |-- AuthenticationService.java
|   |   |   |   |           |   |   |-- AuthorizationService.java
|   |   |   |   |           |   |   |-- CustomUserDetailsService.java
|   |   |   |   |           |   |   |-- LoginAttemptService.java
|   |   |   |   |           |   |   |-- PasswordResetTokenService.java
|   |   |   |   |           |   |   |-- WebAuthnSecurityConfig.java
|   |   |   |   |           |   |   |-- domain
|   |   |   |   |           |   |   |   `-- WebAuthnCredential.java
|   |   |   |   |           |   |   |-- dto
|   |   |   |   |           |   |   |   |-- AuthenticationRequest.java
|   |   |   |   |           |   |   |   |-- AuthenticationResponse.java
|   |   |   |   |           |   |   |   |-- FaceVerificationRequest.java
|   |   |   |   |           |   |   |   |-- ForgotPasswordRequest.java
|   |   |   |   |           |   |   |   |-- OtpRequest.java
|   |   |   |   |           |   |   |   `-- ResetPasswordRequest.java
|   |   |   |   |           |   |   `-- infrastructure
|   |   |   |   |           |   |       `-- WebAuthnCredentialRepository.java
|   |   |   |   |           |   |-- jwt
|   |   |   |   |           |   |   |-- JwtAuthenticationFilter.java
|   |   |   |   |           |   |   |-- JwtClaimsFactory.java
|   |   |   |   |           |   |   |-- JwtTokenProvider.java
|   |   |   |   |           |   |   `-- TokenBlacklistService.java
|   |   |   |   |           |   |-- mfa
|   |   |   |   |           |   |   |-- DeviceTrustService.java
|   |   |   |   |           |   |   |-- OtpService.java
|   |   |   |   |           |   |   `-- OtpVerificationService.java
|   |   |   |   |           |   `-- policy
|   |   |   |   |           |       |-- AccessPolicy.java
|   |   |   |   |           |       |-- PasswordPolicy.java
|   |   |   |   |           |       `-- SegregationOfDutiesPolicy.java
|   |   |   |   |           |-- settlement
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- AdvancedSettlementService.java
|   |   |   |   |           |   |   |-- InternalSettlementExecutionService.java
|   |   |   |   |           |   |   |-- MerchantSettlementService.java
|   |   |   |   |           |   |   |-- SettlementBatchService.java
|   |   |   |   |           |   |   |-- SettlementEligibilityService.java
|   |   |   |   |           |   |   |-- SettlementInstructionService.java
|   |   |   |   |           |   |   `-- SettlementReconciliationService.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   |-- MerchantBalance.java
|   |   |   |   |           |   |   |-- SettlementBatch.java
|   |   |   |   |           |   |   |-- SettlementException.java
|   |   |   |   |           |   |   |-- SettlementInstruction.java
|   |   |   |   |           |   |   `-- SettlementWindow.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       |-- MerchantBalanceJpaRepository.java
|   |   |   |   |           |       |-- SettlementBatchJpaRepository.java
|   |   |   |   |           |       |-- SettlementExceptionJpaRepository.java
|   |   |   |   |           |       |-- SettlementInstructionJpaRepository.java
|   |   |   |   |           |       `-- SettlementWindowJpaRepository.java
|   |   |   |   |           |-- statement
|   |   |   |   |           |   |-- api
|   |   |   |   |           |   |   |-- StatementController.java
|   |   |   |   |           |   |   `-- dto
|   |   |   |   |           |   |       `-- StatementResponse.java
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- GenerateStatementService.java
|   |   |   |   |           |   |   |-- GetStatementService.java
|   |   |   |   |           |   |   `-- port
|   |   |   |   |           |   |       |-- in
|   |   |   |   |           |   |       |   `-- StatementUseCase.java
|   |   |   |   |           |   |       `-- out
|   |   |   |   |           |   |           |-- StatementGeneratorPort.java
|   |   |   |   |           |   |           `-- StatementPersistencePort.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   `-- Statement.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       |-- PdfStatementGenerator.java
|   |   |   |   |           |       |-- StatementJpaRepository.java
|   |   |   |   |           |       `-- StatementPersistenceAdapter.java
|   |   |   |   |           |-- transaction
|   |   |   |   |           |   |-- api
|   |   |   |   |           |   |   |-- MobileAuthorizationController.java
|   |   |   |   |           |   |   |-- TransactionController.java
|   |   |   |   |           |   |   |-- TransactionIntentController.java
|   |   |   |   |           |   |   |-- TransferController.java
|   |   |   |   |           |   |   `-- dto
|   |   |   |   |           |   |       |-- DepositRequest.java
|   |   |   |   |           |   |       |-- DisputeReasonRequest.java
|   |   |   |   |           |   |       |-- ExternalPaymentRequest.java
|   |   |   |   |           |   |       |-- InternalTransferRequest.java
|   |   |   |   |           |   |       |-- ReceiptNotificationRequest.java
|   |   |   |   |           |   |       |-- TransactionResponse.java
|   |   |   |   |           |   |       `-- WithdrawRequest.java
|   |   |   |   |           |   |-- application
|   |   |   |   |           |   |   |-- DepositService.java
|   |   |   |   |           |   |   |-- DisputeTransactionService.java
|   |   |   |   |           |   |   |-- ExternalPaymentService.java
|   |   |   |   |           |   |   |-- GetTransactionHistoryService.java
|   |   |   |   |           |   |   |-- IdempotencyGuardService.java
|   |   |   |   |           |   |   |-- InternalTransferService.java
|   |   |   |   |           |   |   |-- ReverseTransactionService.java
|   |   |   |   |           |   |   |-- ScheduledTransferService.java
|   |   |   |   |           |   |   |-- TransactionAccountResolver.java
|   |   |   |   |           |   |   |-- TransactionAuthorizationService.java
|   |   |   |   |           |   |   |-- TransferCompletedEvent.java
|   |   |   |   |           |   |   |-- TransferNotificationListener.java
|   |   |   |   |           |   |   |-- WithdrawService.java
|   |   |   |   |           |   |   |-- ZeroBalanceSweepService.java
|   |   |   |   |           |   |   `-- port
|   |   |   |   |           |   |       |-- in
|   |   |   |   |           |   |       |   |-- DepositUseCase.java
|   |   |   |   |           |   |       |   |-- ExternalPaymentUseCase.java
|   |   |   |   |           |   |       |   |-- GetTransactionHistoryUseCase.java
|   |   |   |   |           |   |       |   |-- TransactionUseCase.java
|   |   |   |   |           |   |       |   `-- WithdrawUseCase.java
|   |   |   |   |           |   |       `-- out
|   |   |   |   |           |   |           |-- FraudScreeningPort.java
|   |   |   |   |           |   |           |-- LedgerPersistencePort.java
|   |   |   |   |           |   |           `-- PaymentGatewayPort.java
|   |   |   |   |           |   |-- domain
|   |   |   |   |           |   |   |-- AuthorizationAttempt.java
|   |   |   |   |           |   |   |-- DisputeCase.java
|   |   |   |   |           |   |   |-- EntryType.java
|   |   |   |   |           |   |   |-- LedgerEntry.java
|   |   |   |   |           |   |   |-- SufficientFundsPolicy.java
|   |   |   |   |           |   |   |-- Transaction.java
|   |   |   |   |           |   |   |-- TransactionIntent.java
|   |   |   |   |           |   |   |-- TransactionIntentStatus.java
|   |   |   |   |           |   |   |-- TransactionStatus.java
|   |   |   |   |           |   |   `-- TransferPolicy.java
|   |   |   |   |           |   `-- infrastructure
|   |   |   |   |           |       |-- AuthorizationAttemptJpaRepository.java
|   |   |   |   |           |       |-- DisputeCaseJpaRepository.java
|   |   |   |   |           |       |-- FraudScreeningAdapter.java
|   |   |   |   |           |       |-- LedgerEntryJpaRepository.java
|   |   |   |   |           |       |-- LedgerJpaAdapter.java
|   |   |   |   |           |       |-- LedgerJpaRepository.java
|   |   |   |   |           |       |-- PaymentGatewayAdapter.java
|   |   |   |   |           |       |-- TransactionIntentJpaRepository.java
|   |   |   |   |           |       `-- TransactionJpaRepository.java
|   |   |   |   |           `-- web
|   |   |   |   |               |-- advice
|   |   |   |   |               |   `-- ResponseSanitizerAdvice.java
|   |   |   |   |               |-- filter
|   |   |   |   |               |   |-- BffIdentityFilter.java
|   |   |   |   |               |   |-- CorrelationIdFilter.java
|   |   |   |   |               |   |-- RateLimitFilter.java
|   |   |   |   |               |   |-- RequestLoggingFilter.java
|   |   |   |   |               |   `-- SecurityHeadersFilter.java
|   |   |   |   |               `-- interceptor
|   |   |   |   |                   `-- AuditInterceptor.java
|   |   |   |   `-- structure.md
|   |   |   `-- resources
|   |   |       |-- application-dev.yml
|   |   |       |-- application-prod.yml
|   |   |       |-- application-staging.yml
|   |   |       |-- application-test.yml
|   |   |       |-- application.yml
|   |   |       |-- banner.txt
|   |   |       |-- db
|   |   |       |   `-- migration
|   |   |       |       |-- V10__relax_legacy_api_keys_constraints.sql
|   |   |       |       |-- V12__add_kyc_fields_to_customers.sql
|   |   |       |       |-- V13__add_card_details_to_accounts.sql
|   |   |       |       |-- V14__add_cdd_and_lock_fields_to_customers.sql
|   |   |       |       |-- V15__add_aml_schema.sql
|   |   |       |       |-- V16__add_vam_limits_and_permissions.sql
|   |   |       |       |-- V17__add_api_key_account_binding.sql
|   |   |       |       |-- V18__add_payment_gateway_schema.sql
|   |   |       |       |-- V19__add_merchant_settlement_schema.sql
|   |   |       |       |-- V1__init_schema.sql
|   |   |       |       |-- V20__add_gateway_disputes_schema.sql
|   |   |       |       |-- V21__add_api_audit_trail.sql
|   |   |       |       |-- V22__add_regulatory_requirements_schema.sql
|   |   |       |       |-- V23__add_afasa_fraud_management_schema.sql
|   |   |       |       |-- V24__add_payment_messaging_schema.sql
|   |   |       |       |-- V25__add_advanced_settlement_schema.sql
|   |   |       |       |-- V26__add_customer_complaints_schema.sql
|   |   |       |       |-- V27__add_resilience_rto_rpo_schema.sql
|   |   |       |       |-- V28__add_compliance_evidence_schema.sql
|   |   |       |       |-- V29__add_dynamic_qr_payment_schema.sql
|   |   |       |       |-- V2__accounts_and_balances.sql
|   |   |       |       |-- V30__add_webauthn_credentials.sql
|   |   |       |       |-- V31__add_transaction_intents.sql
|   |   |       |       |-- V32__add_authorization_attempts.sql
|   |   |       |       |-- V33__add_payment_gateway_bounded_context.sql
|   |   |       |       |-- V34__add_payment_sessions.sql
|   |   |       |       |-- V35__add_session_to_attempts.sql
|   |   |       |       |-- V36__add_institution_callback_log.sql
|   |   |       |       |-- V37__add_inbound_webhook_events.sql
|   |   |       |       |-- V38__harden_payment_state_machine.sql
|   |   |       |       |-- V39__add_webhook_endpoints_schema.sql
|   |   |       |       |-- V3__transactions_and_ledger.sql
|   |   |       |       |-- V40__add_merchant_id_to_api_keys.sql
|   |   |       |       |-- V41__add_settlement_batch_id_to_transactions.sql
|   |   |       |       |-- V42__update_settlement_instructions_schema.sql
|   |   |       |       |-- V43__add_idempotency_key_to_payment_intents.sql
|   |   |       |       |-- V44__create_payment_event_outbox.sql
|   |   |       |       |-- V45__harden_outbox_schema.sql
|   |   |       |       |-- V46__harden_webhook_contract.sql
|   |   |       |       |-- V47__add_version_to_accounts.sql
|   |   |       |       |-- V48__create_checkout_sessions_table.sql
|   |   |       |       |-- V49__create_payment_authorizations_table.sql
|   |   |       |       |-- V4__products_and_statements.sql
|   |   |       |       |-- V50__fix_schema_validation_gaps.sql
|   |   |       |       |-- V51__extend_api_audit_events.sql
|   |   |       |       |-- V52__add_ledger_fk_and_balance_check.sql
|   |   |       |       |-- V53__add_auth_attempt_metadata.sql
|   |   |       |       |-- V5__api_gateway_and_security.sql
|   |   |       |       |-- V6__orchestration_and_routing.sql
|   |   |       |       |-- V7__payroll_and_ledger.sql
|   |   |       |       |-- V8__add_transaction_dispute_columns.sql
|   |   |       |       `-- V9__api_gateway_enforcement.sql
|   |   |       `-- logback-spring.xml
|   |   `-- test
|   |       |-- java
|   |       |   `-- com
|   |       |       `-- company
|   |       |           `-- banking
|   |       |               |-- account
|   |       |               |   |-- AccountProvisioningPathIT.java
|   |       |               |   |-- UpdateAccountSettingsPathIT.java
|   |       |               |   |-- api
|   |       |               |   |   `-- AccountApiIT.java
|   |       |               |   `-- application
|   |       |               |       `-- UpdateAccountSettingsServiceTest.java
|   |       |               |-- admin
|   |       |               |   `-- KycApprovalPathIT.java
|   |       |               |-- apigateway
|   |       |               |   |-- GatewayAuditIntegrityIT.java
|   |       |               |   |-- api
|   |       |               |   |   |-- GatewayManagementApiIT.java
|   |       |               |   |   `-- GatewayManagementAuthorizationIT.java
|   |       |               |   `-- security
|   |       |               |       |-- ApiKeyAuthenticationIT.java
|   |       |               |       |-- ApiKeyAuthenticationPathIT.java
|   |       |               |       |-- ApiSecurityTestSuite.java
|   |       |               |       `-- SandboxEnvironmentIT.java
|   |       |               |-- common
|   |       |               |   `-- resilience
|   |       |               |       `-- PaymentFailoverPathIT.java
|   |       |               |-- config
|   |       |               |   |-- BaseIntegrationTest.java
|   |       |               |   |-- LedgerSpyIntegrationTest.java
|   |       |               |   |-- TestDatabaseCleaner.java
|   |       |               |   |-- TransferSpyIntegrationTest.java
|   |       |               |   `-- WebIntegrationTest.java
|   |       |               |-- customer
|   |       |               |-- e2e
|   |       |               |   |-- E2ESecurityBypassConfig.java
|   |       |               |   |-- ExternalPaymentAcceptedPendingE2E.java
|   |       |               |   |-- ExternalPaymentOutboxAtomicityE2E.java
|   |       |               |   |-- ExternalPaymentRoutingE2E.java
|   |       |               |   |-- InternalTransferDoubleEntryE2E.java
|   |       |               |   `-- InternalTransferRollbackE2E.java
|   |       |               |-- fraud
|   |       |               |   `-- FraudAndAmlExecutionPathIT.java
|   |       |               |-- integration
|   |       |               |   |-- DebugBalancesIT.java
|   |       |               |   |-- FinancialCoreInvariantIT.java
|   |       |               |   |-- FinancialIntegrityIT.java
|   |       |               |   |-- IdempotencyRaceConditionIT.java
|   |       |               |   |-- OutboundWebhookIT.java
|   |       |               |   |-- TransferFlowIT.java
|   |       |               |   `-- WebhookSecurityIT.java
|   |       |               |-- notification
|   |       |               |   `-- NotificationWorkflowPathIT.java
|   |       |               |-- payment
|   |       |               |   |-- CheckoutPaymentConfirmationIT.java
|   |       |               |   |-- CheckoutSessionIntegrityIT.java
|   |       |               |   |-- CheckoutSessionStateIntegrityIT.java
|   |       |               |   |-- DynamicQrPaymentPathIT.java
|   |       |               |   |-- InstitutionPaymentSessionPathIT.java
|   |       |               |   |-- InternalAccountAuthorizationIT.java
|   |       |               |   |-- InternalPaymentGatewayIT.java
|   |       |               |   |-- Investigation401IT.java
|   |       |               |   |-- MerchantGatewayAPIIntegrityIT.java
|   |       |               |   |-- MerchantWebhookContractIT.java
|   |       |               |   |-- MerchantWebhookDeliveryIntegrityIT.java
|   |       |               |   |-- PaymentEventOutboxIntegrityIT.java
|   |       |               |   |-- PaymentEventOutboxPathIT.java
|   |       |               |   |-- PaymentExecutionIntegrityIT.java
|   |       |               |   |-- PaymentIntentOrchestrationPathIT.java
|   |       |               |   |-- PaymentIntentOrchestrationServiceTest.java
|   |       |               |   |-- PaymentUrlSecurityTest.java
|   |       |               |   `-- PublicCheckoutSessionSecurityIT.java
|   |       |               |-- security
|   |       |               |   |-- JwtAuthenticationIT.java
|   |       |               |   `-- auth
|   |       |               |       |-- AuthenticationForgotPasswordIT.java
|   |       |               |       `-- AuthenticationSecurityPathIT.java
|   |       |               |-- settlement
|   |       |               |   |-- AdvancedSettlementAndDisputePathIT.java
|   |       |               |   |-- InternalSettlementExecutionIT.java
|   |       |               |   |-- SettlementBatchIntegrityIT.java
|   |       |               |   |-- SettlementFinalityIT.java
|   |       |               |   |-- SettlementInstructionIntegrityIT.java
|   |       |               |   |-- SettlementIntegrityIT.java
|   |       |               |   `-- SettlementReconciliationIT.java
|   |       |               |-- statement
|   |       |               |   `-- StatementGenerationPathIT.java
|   |       |               `-- transaction
|   |       |                   |-- DepositWithdrawWorkflowPathIT.java
|   |       |                   |-- ExternalPaymentWorkflowPathIT.java
|   |       |                   |-- InternalTransferIntegrityIT.java
|   |       |                   |-- InternalTransferMissingPathsIT.java
|   |       |                   |-- InternalTransferRaceConditionIT.java
|   |       |                   |-- InternalTransferWorkflowPathIT.java
|   |       |                   |-- TransactionAuthorizationIT.java
|   |       |                   |-- TransactionAuthorizationPathIT.java
|   |       |                   |-- TransactionIdempotencyIT.java
|   |       |                   |-- ZeroBalanceSweepPathIT.java
|   |       |                   `-- application
|   |       |                       |-- ExternalPaymentServiceFraudAndAmlPathTest.java
|   |       |                       |-- ExternalPaymentServiceResiliencePathTest.java
|   |       |                       |-- IdempotencyGuardServiceTest.java
|   |       |                       `-- ZeroBalanceSweepServiceTest.java
|   |       `-- resources
|   |           `-- application-test.yml
|   |-- structure.md
|   |-- test.logs
|   `-- tests.log
|-- backendstructure.md
|-- banking-backend-hardened-architecture.md
|-- check-env.js
|-- codebase-infrastructure.md
|-- development-progress.md
|-- docs
|   |-- ENVIRONMENT.md
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
|-- fix_flattened_files.js
|-- hardened-backend-implementation.md
|-- infra
|   |-- docker
|   |   |-- compose.dev.yaml
|   |   |-- compose.production.yaml
|   |   `-- compose.yaml
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
|-- isolated_release.sh
|-- migrate_test_directories.js
|-- mobile-app-react-native-architecture.md
|-- modules.conf
|-- modules.conf.example.txt
|-- money-movement-feature-extension-prompt.md
|-- package-lock.json
|-- package.json
|-- principal-devops-repo-branching-prompt.md
|-- release_log_20260824_235252.txt
|-- release_log_20260825_235656.txt
|-- release_log_20260825_235927.txt
|-- release_log_20260826_234509.txt
|-- release_log_20260826_234653.txt
|-- release_log_20260826_234841.txt
|-- release_log_20260826_235636.txt
|-- release_log_20260827_022520.txt
|-- release_log_20260827_022647.txt
|-- remove_dirties_context.js
|-- revert_directories.js
|-- scaffold-mobile.sh
|-- scaffold-web.sh
|-- scaffold.sh
|-- scripts
|   |-- check-env.mjs
|   |-- check_port_collisions.ps1
|   |-- check_port_collisions.sh
|   |-- db-migrate.sh
|   |-- port_validator.js
|   `-- run-local.sh
|-- structure.md
|-- tests
|   |-- reports
|   |   `-- security_audit_1__url_allowlisting_gates_2026-08-21T13-37-52-069Z.html
|   |-- run-security-matrix.js
|   `-- security-matrix.json
|-- web-app
|   |-- Dockerfile
|   |-- README.md
|   |-- fix-imports.mjs
|   |-- frontendstructure.md
|   |-- next-env.d.ts
|   |-- next.config.ts
|   |-- organize-frontend.ps1
|   |-- package-lock.json
|   |-- package.json
|   |-- playwright.config.ts
|   |-- postcss.config.mjs
|   |-- runtimetest.log
|   |-- scripts
|   |   |-- clean.mjs
|   |   |-- cleanup-proxies.mjs
|   |   `-- fix-env-imports.mjs
|   |-- src
|   |   |-- app
|   |   |   |-- (portals)
|   |   |   |   |-- (admin)
|   |   |   |   |   |-- account-status
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- audit
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- layout.tsx
|   |   |   |   |-- (auth)
|   |   |   |   |   |-- forgot-password
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- login
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- otp
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- passkey-setup
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- register
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- reset-password
|   |   |   |   |       `-- page.tsx
|   |   |   |   |-- (dashboard)
|   |   |   |   |   |-- accounts
|   |   |   |   |   |   |-- [accountId]
|   |   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |   |-- new
|   |   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- api
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- layout.tsx
|   |   |   |   |   |-- products
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- profile
|   |   |   |   |   |   |-- devices
|   |   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |   |-- page.tsx
|   |   |   |   |   |   `-- security
|   |   |   |   |   |       `-- page.tsx
|   |   |   |   |   |-- statements
|   |   |   |   |   |   |-- [accountNumber]
|   |   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- transactions
|   |   |   |   |   |   |-- deposit
|   |   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |   |-- external-payment
|   |   |   |   |   |   |   |-- page.tsx
|   |   |   |   |   |   |   |-- redirect
|   |   |   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |   |   |-- review
|   |   |   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |   |   `-- status
|   |   |   |   |   |   |       `-- page.tsx
|   |   |   |   |   |   |-- history
|   |   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |   |-- receipt
|   |   |   |   |   |   |   `-- [txRef]
|   |   |   |   |   |   |       `-- page.tsx
|   |   |   |   |   |   `-- withdraw
|   |   |   |   |   |       `-- page.tsx
|   |   |   |   |   `-- transfers
|   |   |   |   |       |-- bank
|   |   |   |   |       |   `-- page.tsx
|   |   |   |   |       |-- confirm
|   |   |   |   |       |   `-- page.tsx
|   |   |   |   |       |-- internal
|   |   |   |   |       |   `-- page.tsx
|   |   |   |   |       |-- page.tsx
|   |   |   |   |       |-- payment-gateway
|   |   |   |   |       |   `-- result
|   |   |   |   |       |       `-- [paymentIntentId]
|   |   |   |   |       |           `-- page.tsx
|   |   |   |   |       |-- qr
|   |   |   |   |       |   `-- page.tsx
|   |   |   |   |       `-- review
|   |   |   |   |           `-- page.tsx
|   |   |   |   |-- (merchant)
|   |   |   |   |   |-- balances
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- layout.tsx
|   |   |   |   |   |-- merchant-dashboard
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- payments
|   |   |   |   |   |   |-- [intentId]
|   |   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- qr-payments
|   |   |   |   |   |   |-- create
|   |   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   |-- refunds
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- settlements
|   |   |   |   |       `-- page.tsx
|   |   |   |   `-- (ops)
|   |   |   |       |-- complaints
|   |   |   |       |   `-- page.tsx
|   |   |   |       |-- compliance
|   |   |   |       |   |-- evidence
|   |   |   |       |   |   `-- page.tsx
|   |   |   |       |   `-- page.tsx
|   |   |   |       |-- fraud
|   |   |   |       |   |-- [caseId]
|   |   |   |       |   |   `-- page.tsx
|   |   |   |       |   `-- page.tsx
|   |   |   |       |-- layout.tsx
|   |   |   |       |-- merchants
|   |   |   |       |   |-- [merchantId]
|   |   |   |       |   |   `-- page.tsx
|   |   |   |       |   `-- page.tsx
|   |   |   |       |-- ops-dashboard
|   |   |   |       |   `-- page.tsx
|   |   |   |       |-- ops-payments
|   |   |   |       |   `-- page.tsx
|   |   |   |       `-- ops-settlements
|   |   |   |           |-- exceptions
|   |   |   |           |   `-- page.tsx
|   |   |   |           `-- page.tsx
|   |   |   |-- (public)
|   |   |   |   |-- (checkout)
|   |   |   |   |   |-- checkout
|   |   |   |   |   |   `-- [sessionId]
|   |   |   |   |   |       `-- page.tsx
|   |   |   |   |   |-- layout.tsx
|   |   |   |   |   `-- pay
|   |   |   |   |       `-- [sessionId]
|   |   |   |   |           |-- page.tsx
|   |   |   |   |           |-- processing
|   |   |   |   |           |   `-- page.tsx
|   |   |   |   |           `-- result
|   |   |   |   |               `-- page.tsx
|   |   |   |   |-- developers
|   |   |   |   |   |-- [...slug]
|   |   |   |   |   |   `-- page.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   `-- page.tsx
|   |   |   |-- api
|   |   |   |   |-- auth
|   |   |   |   |   |-- forgot-password
|   |   |   |   |   |   `-- route.ts
|   |   |   |   |   |-- login
|   |   |   |   |   |   `-- route.ts
|   |   |   |   |   |-- logout
|   |   |   |   |   |   `-- route.ts
|   |   |   |   |   |-- refresh
|   |   |   |   |   |   `-- route.ts
|   |   |   |   |   `-- reset-password
|   |   |   |   |       `-- route.ts
|   |   |   |   |-- health
|   |   |   |   |   `-- route.ts
|   |   |   |   `-- proxy
|   |   |   |       `-- [...endpoint]
|   |   |   |           `-- route.ts
|   |   |   |-- error.tsx
|   |   |   |-- global-error.tsx
|   |   |   |-- globals.css
|   |   |   |-- icon.svg
|   |   |   |-- layout.tsx
|   |   |   `-- not-found.tsx
|   |   |-- components
|   |   |   |-- docs
|   |   |   |   `-- ApiReferenceViewer.tsx
|   |   |   |-- features
|   |   |   |   |-- accounts
|   |   |   |   |   `-- AccountBalanceCard.tsx
|   |   |   |   |-- api
|   |   |   |   |   |-- ApiKeyManager.tsx
|   |   |   |   |   |-- DomainLibrary.tsx
|   |   |   |   |   |-- WebhookManager.tsx
|   |   |   |   |   `-- WebhookTestConsole.tsx
|   |   |   |   |-- checkout
|   |   |   |   |   |-- CheckoutConfirmation.tsx
|   |   |   |   |   |-- CheckoutOrchestrator.tsx
|   |   |   |   |   |-- CheckoutResult.tsx
|   |   |   |   |   |-- InternalAccountAuthorization.tsx
|   |   |   |   |   |-- PaymentMethodSelector.tsx
|   |   |   |   |   |-- RetryPaymentFlow.tsx
|   |   |   |   |   |-- SessionSummary.tsx
|   |   |   |   |   |-- SessionTimer.tsx
|   |   |   |   |   `-- TerminalStateScreen.tsx
|   |   |   |   |-- gateway
|   |   |   |   |   |-- DataTable.tsx
|   |   |   |   |   |-- MerchantLifecycleStepper.tsx
|   |   |   |   |   |-- MoneyDisplay.tsx
|   |   |   |   |   |-- PaymentStatusBadge.tsx
|   |   |   |   |   `-- QrPaymentCard.tsx
|   |   |   |   |-- payments
|   |   |   |   |   |-- ExternalPaymentRedirect.tsx
|   |   |   |   |   |-- PasskeyAuthorization.tsx
|   |   |   |   |   |-- PaymentResultFailed.tsx
|   |   |   |   |   |-- PaymentResultProcessing.tsx
|   |   |   |   |   |-- PaymentResultSuccess.tsx
|   |   |   |   |   |-- RecipientVerification.tsx
|   |   |   |   |   |-- TransactionError.tsx
|   |   |   |   |   |-- TransactionLayout.tsx
|   |   |   |   |   |-- TransactionProcessing.tsx
|   |   |   |   |   |-- TransactionProgress.tsx
|   |   |   |   |   |-- TransactionReceipt.tsx
|   |   |   |   |   |-- TransactionReview.tsx
|   |   |   |   |   `-- TransactionUnknown.tsx
|   |   |   |   `-- transactions
|   |   |   |       `-- TransactionListItem.tsx
|   |   |   |-- layout
|   |   |   |-- security
|   |   |   |   |-- MaskedValue.tsx
|   |   |   |   `-- PasskeyPrompt.tsx
|   |   |   `-- ui
|   |   |       |-- Button.tsx
|   |   |       |-- Card.tsx
|   |   |       |-- ErrorBanner.tsx
|   |   |       |-- Input.tsx
|   |   |       |-- LoadingOverlay.tsx
|   |   |       |-- Logo.tsx
|   |   |       `-- StarRating.tsx
|   |   |-- config
|   |   |   `-- featureFlags.ts
|   |   |-- hooks
|   |   |   |-- useAccounts.ts
|   |   |   |-- useAuth.ts
|   |   |   |-- useCheckoutSession.ts
|   |   |   |-- useIdleTimeout.ts
|   |   |   |-- usePaymentIntent.ts
|   |   |   `-- useTransactions.ts
|   |   |-- middleware.ts
|   |   |-- models
|   |   |   |-- Account.ts
|   |   |   |-- ApiResponse.ts
|   |   |   |-- GatewayModels.ts
|   |   |   |-- Product.ts
|   |   |   |-- Statement.ts
|   |   |   |-- Transaction.ts
|   |   |   |-- TransactionTypes.ts
|   |   |   `-- User.ts
|   |   |-- providers
|   |   |   `-- Providers.tsx
|   |   |-- security
|   |   |   |-- RoleGuard.tsx
|   |   |   |-- SessionGuard.tsx
|   |   |   |-- csp.ts
|   |   |   `-- rateLimiter.ts
|   |   |-- server
|   |   |   `-- config
|   |   |       `-- env.ts
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
|   |   |   |-- checkout
|   |   |   |   |-- checkoutService.ts
|   |   |   |   `-- institutionService.ts
|   |   |   |-- docs
|   |   |   |   |-- apiTestRunner.ts
|   |   |   |   `-- openApiService.ts
|   |   |   |-- gateway
|   |   |   |   |-- fraudService.ts
|   |   |   |   |-- governanceService.ts
|   |   |   |   |-- merchantService.ts
|   |   |   |   |-- paymentService.ts
|   |   |   |   `-- settlementService.ts
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
|   |-- structure.md
|   |-- tailwind.config.ts
|   |-- test.logs
|   |-- tests
|   |   |-- e2e
|   |   |   |-- account-settings.spec.ts
|   |   |   |-- api-management.spec.ts
|   |   |   |-- login.spec.ts
|   |   |   |-- statements.spec.ts
|   |   |   `-- transfer.spec.ts
|   |   `-- unit
|   |       |-- components
|   |       |   |-- qrTransfer.test.tsx
|   |       |   `-- transfers.test.tsx
|   |       |-- pages
|   |       |   |-- accounts
|   |       |   |   |-- accountDetailsSettings.test.tsx
|   |       |   |   `-- new.test.tsx
|   |       |   |-- api
|   |       |   |   `-- ApiManagementPage.test.tsx
|   |       |   |-- externalPaymentStatus.test.tsx
|   |       |   `-- transfers
|   |       |       `-- internal.test.tsx
|   |       `-- services
|   |           |-- authService.test.ts
|   |           |-- merchantService.test.ts
|   |           |-- paymentService.test.ts
|   |           `-- transactionService.test.ts
|   |-- tsconfig.json
|   |-- tsconfig.tsbuildinfo
|   |-- vitest.config.ts
|   `-- web-app-structure.md
`-- web-frontend-nextjs-architecture.md

390 directories, 970 files
