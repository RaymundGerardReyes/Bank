.
|-- CHANGELOG.md
|-- Dockerfile
|-- README.md
|-- backend-app-structure.md
|-- build.gradle
|-- build.md
|-- checkstyle.xml
|-- docker-compose.yml
|-- gradlew.bat
|-- pom.xml
|-- settings.gradle
`-- src
    |-- build.md
    |-- main
    |   |-- backend-app-structure.md
    |   |-- java
    |   |   |-- com
    |   |   |   `-- company
    |   |   |       `-- banking
    |   |   |           |-- BankingApplication.java
    |   |   |           |-- account
    |   |   |           |   |-- api
    |   |   |           |   |   |-- AccountController.java
    |   |   |           |   |   `-- dto
    |   |   |           |   |       |-- AccountResponse.java
    |   |   |           |   |       |-- AccountSummaryResponse.java
    |   |   |           |   |       `-- OpenAccountRequest.java
    |   |   |           |   |-- application
    |   |   |           |   |   |-- ChangeAccountStatusService.java
    |   |   |           |   |   |-- GetAccountDetailsService.java
    |   |   |           |   |   |-- ListCustomerAccountsService.java
    |   |   |           |   |   |-- OpenAccountService.java
    |   |   |           |   |   `-- port
    |   |   |           |   |       |-- in
    |   |   |           |   |       |   |-- AccountUseCase.java
    |   |   |           |   |       |   |-- ChangeAccountStatusUseCase.java
    |   |   |           |   |       |   |-- GetAccountDetailsUseCase.java
    |   |   |           |   |       |   |-- ListCustomerAccountsUseCase.java
    |   |   |           |   |       |   `-- OpenAccountUseCase.java
    |   |   |           |   |       `-- out
    |   |   |           |   |           `-- AccountPersistencePort.java
    |   |   |           |   |-- domain
    |   |   |           |   |   |-- Account.java
    |   |   |           |   |   |-- AccountBalance.java
    |   |   |           |   |   |-- AccountLimit.java
    |   |   |           |   |   `-- AccountPolicy.java
    |   |   |           |   `-- infrastructure
    |   |   |           |       |-- AccountJpaRepository.java
    |   |   |           |       `-- AccountPersistenceAdapter.java
    |   |   |           |-- admin
    |   |   |           |   |-- api
    |   |   |           |   |   `-- AdminAuditController.java
    |   |   |           |   |-- application
    |   |   |           |   |   |-- ReviewAuditLogService.java
    |   |   |           |   |   `-- port
    |   |   |           |   |       |-- in
    |   |   |           |   |       |   `-- AdminUseCase.java
    |   |   |           |   |       `-- out
    |   |   |           |   |           `-- AuditLogPersistencePort.java
    |   |   |           |   `-- infrastructure
    |   |   |           |       `-- AuditLogPersistenceAdapter.java
    |   |   |           |-- apigateway
    |   |   |           |   |-- api
    |   |   |           |   |   |-- ApiKeyController.java
    |   |   |           |   |   `-- dto
    |   |   |           |   |       |-- ApiKeyResponse.java
    |   |   |           |   |       `-- CreateApiKeyRequest.java
    |   |   |           |   |-- application
    |   |   |           |   |   |-- CreateApiKeyService.java
    |   |   |           |   |   `-- port
    |   |   |           |   |       |-- in
    |   |   |           |   |       |   `-- CreateApiKeyUseCase.java
    |   |   |           |   |       `-- out
    |   |   |           |   |           `-- ApiKeyPersistencePort.java
    |   |   |           |   |-- domain
    |   |   |           |   |   `-- ApiKey.java
    |   |   |           |   |-- infrastructure
    |   |   |           |   |   |-- ApiKeyJpaAdapter.java
    |   |   |           |   |   |-- ApiKeyJpaEntity.java
    |   |   |           |   |   `-- ApiKeyJpaRepository.java
    |   |   |           |   `-- security
    |   |   |           |       |-- ApiKeyAuthenticationFilter.java
    |   |   |           |       `-- CidrWhitelistValidator.java
    |   |   |           |-- banking
    |   |   |           |   `-- orchestration
    |   |   |           |       `-- domain
    |   |   |           |           `-- RoutingRule.java
    |   |   |           |-- common
    |   |   |           |   |-- audit
    |   |   |           |   |   |-- AuditContext.java
    |   |   |           |   |   |-- AuditEvent.java
    |   |   |           |   |   `-- AuditEventPublisher.java
    |   |   |           |   |-- enums
    |   |   |           |   |   |-- AccountStatus.java
    |   |   |           |   |   |-- RoleType.java
    |   |   |           |   |   `-- TransactionType.java
    |   |   |           |   |-- exception
    |   |   |           |   |   |-- BusinessException.java
    |   |   |           |   |   |-- ConflictException.java
    |   |   |           |   |   |-- ErrorCode.java
    |   |   |           |   |   |-- ForbiddenException.java
    |   |   |           |   |   |-- GlobalExceptionHandler.java
    |   |   |           |   |   `-- NotFoundException.java
    |   |   |           |   |-- mapper
    |   |   |           |   |   `-- BaseMapper.java
    |   |   |           |   |-- response
    |   |   |           |   |   |-- ApiResponse.java
    |   |   |           |   |   `-- PagedResponse.java
    |   |   |           |   `-- util
    |   |   |           |       |-- DateUtils.java
    |   |   |           |       |-- IdempotencyKeyUtils.java
    |   |   |           |       |-- MaskingUtils.java
    |   |   |           |       `-- MoneyUtils.java
    |   |   |           |-- config
    |   |   |           |   |-- ActuatorSecurityConfig.java
    |   |   |           |   |-- AsyncConfig.java
    |   |   |           |   |-- CacheConfig.java
    |   |   |           |   |-- CorsConfig.java
    |   |   |           |   |-- DataInitializer.java
    |   |   |           |   |-- JacksonConfig.java
    |   |   |           |   |-- OpenApiConfig.java
    |   |   |           |   |-- RateLimitConfig.java
    |   |   |           |   |-- SecretsConfig.java
    |   |   |           |   `-- SecurityConfig.java
    |   |   |           |-- customer
    |   |   |           |   |-- api
    |   |   |           |   |   |-- CustomerController.java
    |   |   |           |   |   `-- dto
    |   |   |           |   |       |-- CustomerCreateRequest.java
    |   |   |           |   |       |-- CustomerResponse.java
    |   |   |           |   |       `-- CustomerUpdateRequest.java
    |   |   |           |   |-- application
    |   |   |           |   |   |-- CreateCustomerService.java
    |   |   |           |   |   |-- GetCustomerProfileService.java
    |   |   |           |   |   |-- UpdateCustomerProfileService.java
    |   |   |           |   |   `-- port
    |   |   |           |   |       |-- in
    |   |   |           |   |       |   |-- CreateCustomerUseCase.java
    |   |   |           |   |       |   |-- CustomerUseCase.java
    |   |   |           |   |       |   `-- GetCustomerProfileUseCase.java
    |   |   |           |   |       `-- out
    |   |   |           |   |           `-- CustomerPersistencePort.java
    |   |   |           |   |-- domain
    |   |   |           |   |   |-- Customer.java
    |   |   |           |   |   |-- CustomerPolicy.java
    |   |   |           |   |   `-- CustomerProfile.java
    |   |   |           |   `-- infrastructure
    |   |   |           |       |-- CustomerJpaRepository.java
    |   |   |           |       `-- CustomerPersistenceAdapter.java
    |   |   |           |-- legacy
    |   |   |           |   |-- README.md
    |   |   |           |   `-- v1-deprecated
    |   |   |           |-- notification
    |   |   |           |   |-- api
    |   |   |           |   |   |-- NotificationController.java
    |   |   |           |   |   `-- dto
    |   |   |           |   |       `-- NotificationResponse.java
    |   |   |           |   |-- application
    |   |   |           |   |   |-- SendOtpNotificationService.java
    |   |   |           |   |   |-- SendStatementReadyNotificationService.java
    |   |   |           |   |   |-- SendTransactionAlertService.java
    |   |   |           |   |   `-- port
    |   |   |           |   |       `-- out
    |   |   |           |   |           |-- EmailPort.java
    |   |   |           |   |           |-- PushNotificationPort.java
    |   |   |           |   |           `-- SmsPort.java
    |   |   |           |   `-- infrastructure
    |   |   |           |       |-- EmailProviderAdapter.java
    |   |   |           |       |-- PushNotificationAdapter.java
    |   |   |           |       `-- SmsProviderAdapter.java
    |   |   |           |-- orchestration
    |   |   |           |   |-- api
    |   |   |           |   |   |-- OrchestrationController.java
    |   |   |           |   |   `-- dto
    |   |   |           |   |       |-- OrchestrationRequest.java
    |   |   |           |   |       `-- OrchestrationResponse.java
    |   |   |           |   |-- application
    |   |   |           |   |   |-- PaymentOrchestrationService.java
    |   |   |           |   |   `-- port
    |   |   |           |   |       |-- in
    |   |   |           |   |       |   `-- PaymentOrchestrationUseCase.java
    |   |   |           |   |       `-- out
    |   |   |           |   |           |-- MultiRailGatewayPort.java
    |   |   |           |   |           `-- RoutingRulePersistencePort.java
    |   |   |           |   |-- domain
    |   |   |           |   |   |-- PaymentGateway.java
    |   |   |           |   |   `-- PaymentRail.java
    |   |   |           |   `-- infrastructure
    |   |   |           |       |-- MultiRailGatewayAdapter.java
    |   |   |           |       |-- RoutingRuleJpaAdapter.java
    |   |   |           |       `-- RoutingRuleJpaRepository.java
    |   |   |           |-- product
    |   |   |           |   |-- api
    |   |   |           |   |   `-- ProductController.java
    |   |   |           |   |-- application
    |   |   |           |   |   |-- GetProductCatalogService.java
    |   |   |           |   |   `-- port
    |   |   |           |   |       |-- in
    |   |   |           |   |       |   `-- ProductUseCase.java
    |   |   |           |   |       `-- out
    |   |   |           |   |           `-- ProductPersistencePort.java
    |   |   |           |   |-- domain
    |   |   |           |   |   |-- BankProduct.java
    |   |   |           |   |   `-- ProductType.java
    |   |   |           |   `-- infrastructure
    |   |   |           |       |-- ProductJpaRepository.java
    |   |   |           |       `-- ProductPersistenceAdapter.java
    |   |   |           |-- reporting
    |   |   |           |   |-- api
    |   |   |           |   |   `-- ReportingController.java
    |   |   |           |   |-- application
    |   |   |           |   |   |-- GenerateMonthlyReportService.java
    |   |   |           |   |   `-- port
    |   |   |           |   |       |-- in
    |   |   |           |   |       |   `-- ReportingUseCase.java
    |   |   |           |   |       `-- out
    |   |   |           |   |           `-- ReportingPersistencePort.java
    |   |   |           |   |-- domain
    |   |   |           |   |   `-- ReportRequest.java
    |   |   |           |   `-- infrastructure
    |   |   |           |       `-- ReportingPersistenceAdapter.java
    |   |   |           |-- security
    |   |   |           |   |-- auth
    |   |   |           |   |   |-- ApplicationSecurityBeansConfig.java
    |   |   |           |   |   |-- AuthenticationController.java
    |   |   |           |   |   |-- AuthenticationService.java
    |   |   |           |   |   |-- AuthorizationService.java
    |   |   |           |   |   |-- CustomUserDetailsService.java
    |   |   |           |   |   |-- LoginAttemptService.java
    |   |   |           |   |   `-- dto
    |   |   |           |   |       |-- AuthenticationRequest.java
    |   |   |           |   |       |-- AuthenticationResponse.java
    |   |   |           |   |       `-- OtpRequest.java
    |   |   |           |   |-- jwt
    |   |   |           |   |   |-- JwtAuthenticationFilter.java
    |   |   |           |   |   |-- JwtClaimsFactory.java
    |   |   |           |   |   |-- JwtTokenProvider.java
    |   |   |           |   |   `-- TokenBlacklistService.java
    |   |   |           |   |-- mfa
    |   |   |           |   |   |-- DeviceTrustService.java
    |   |   |           |   |   |-- OtpService.java
    |   |   |           |   |   `-- OtpVerificationService.java
    |   |   |           |   `-- policy
    |   |   |           |       |-- AccessPolicy.java
    |   |   |           |       |-- PasswordPolicy.java
    |   |   |           |       `-- SegregationOfDutiesPolicy.java
    |   |   |           |-- statement
    |   |   |           |   |-- api
    |   |   |           |   |   |-- StatementController.java
    |   |   |           |   |   `-- dto
    |   |   |           |   |       `-- StatementResponse.java
    |   |   |           |   |-- application
    |   |   |           |   |   |-- GenerateStatementService.java
    |   |   |           |   |   |-- GetStatementService.java
    |   |   |           |   |   `-- port
    |   |   |           |   |       |-- in
    |   |   |           |   |       |   `-- StatementUseCase.java
    |   |   |           |   |       `-- out
    |   |   |           |   |           |-- StatementGeneratorPort.java
    |   |   |           |   |           `-- StatementPersistencePort.java
    |   |   |           |   |-- domain
    |   |   |           |   |   `-- Statement.java
    |   |   |           |   `-- infrastructure
    |   |   |           |       |-- PdfStatementGenerator.java
    |   |   |           |       |-- StatementJpaRepository.java
    |   |   |           |       `-- StatementPersistenceAdapter.java
    |   |   |           |-- transaction
    |   |   |           |   |-- api
    |   |   |           |   |   |-- TransactionController.java
    |   |   |           |   |   |-- TransferController.java
    |   |   |           |   |   `-- dto
    |   |   |           |   |       |-- DepositRequest.java
    |   |   |           |   |       |-- DisputeReasonRequest.java
    |   |   |           |   |       |-- ExternalPaymentRequest.java
    |   |   |           |   |       |-- InternalTransferRequest.java
    |   |   |           |   |       |-- ReceiptNotificationRequest.java
    |   |   |           |   |       |-- TransactionResponse.java
    |   |   |           |   |       `-- WithdrawRequest.java
    |   |   |           |   |-- application
    |   |   |           |   |   |-- DepositService.java
    |   |   |           |   |   |-- DisputeTransactionService.java
    |   |   |           |   |   |-- ExternalPaymentService.java
    |   |   |           |   |   |-- GetTransactionHistoryService.java
    |   |   |           |   |   |-- IdempotencyGuardService.java
    |   |   |           |   |   |-- InternalTransferService.java
    |   |   |           |   |   |-- ReverseTransactionService.java
    |   |   |           |   |   |-- ScheduledTransferService.java
    |   |   |           |   |   |-- WithdrawService.java
    |   |   |           |   |   `-- port
    |   |   |           |   |       |-- in
    |   |   |           |   |       |   |-- DepositUseCase.java
    |   |   |           |   |       |   |-- ExternalPaymentUseCase.java
    |   |   |           |   |       |   |-- GetTransactionHistoryUseCase.java
    |   |   |           |   |       |   |-- TransactionUseCase.java
    |   |   |           |   |       |   `-- WithdrawUseCase.java
    |   |   |           |   |       `-- out
    |   |   |           |   |           |-- FraudScreeningPort.java
    |   |   |           |   |           |-- LedgerPersistencePort.java
    |   |   |           |   |           `-- PaymentGatewayPort.java
    |   |   |           |   |-- domain
    |   |   |           |   |   |-- EntryType.java
    |   |   |           |   |   |-- LedgerEntry.java
    |   |   |           |   |   |-- SufficientFundsPolicy.java
    |   |   |           |   |   |-- Transaction.java
    |   |   |           |   |   |-- TransactionStatus.java
    |   |   |           |   |   `-- TransferPolicy.java
    |   |   |           |   `-- infrastructure
    |   |   |           |       |-- FraudScreeningAdapter.java
    |   |   |           |       |-- LedgerEntryJpaRepository.java
    |   |   |           |       |-- LedgerJpaAdapter.java
    |   |   |           |       |-- LedgerJpaRepository.java
    |   |   |           |       |-- PaymentGatewayAdapter.java
    |   |   |           |       `-- TransactionJpaRepository.java
    |   |   |           `-- web
    |   |   |               |-- advice
    |   |   |               |   `-- ResponseSanitizerAdvice.java
    |   |   |               |-- filter
    |   |   |               |   |-- CorrelationIdFilter.java
    |   |   |               |   |-- RateLimitFilter.java
    |   |   |               |   |-- RequestLoggingFilter.java
    |   |   |               |   `-- SecurityHeadersFilter.java
    |   |   |               `-- interceptor
    |   |   |                   `-- AuditInterceptor.java
    |   |   `-- structure.md
    |   `-- resources
    |       |-- application-dev.yml
    |       |-- application-prod.yml
    |       |-- application-staging.yml
    |       |-- application-test.yml
    |       |-- application.yml
    |       |-- banner.txt
    |       |-- db
    |       |   `-- migration
    |       |       |-- V10__relax_legacy_api_keys_constraints.sql
    |       |       |-- V1__init_schema.sql
    |       |       |-- V2__accounts_and_balances.sql
    |       |       |-- V3__transactions_and_ledger.sql
    |       |       |-- V4__products_and_statements.sql
    |       |       |-- V5__api_gateway_and_security.sql
    |       |       |-- V6__orchestration_and_routing.sql
    |       |       |-- V7__payroll_and_ledger.sql
    |       |       |-- V8__add_transaction_dispute_columns.sql
    |       |       `-- V9__api_gateway_enforcement.sql
    |       `-- logback-spring.xml
    `-- test
        |-- java
        |   `-- com
        |       `-- company
        |           `-- banking
        |               |-- account
        |               |-- customer
        |               |-- integration
        |               |   |-- AccountApiIT.java
        |               |   `-- TransferFlowIT.java
        |               |-- security
        |               `-- transaction
        `-- resources
            `-- application-test.yml

128 directories, 230 files
