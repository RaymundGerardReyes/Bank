.
|-- CHANGELOG.md
|-- Dockerfile
|-- README.md
|-- backend-app-structure.md
|-- backendstructure.md
|-- build.gradle
|-- build.md
|-- checkstyle.xml
|-- dev.bat
|-- docker-compose.yml
|-- gradlew
|-- gradlew.bat
|-- logs.log
|-- pom.xml
|-- settings.gradle
|-- src
|   |-- build.md
|   |-- main
|   |   |-- backend-app-structure.md
|   |   |-- java
|   |   |   |-- com
|   |   |   |   `-- company
|   |   |   |       `-- banking
|   |   |   |           |-- BankingApplication.java
|   |   |   |           |-- account
|   |   |   |           |   |-- api
|   |   |   |           |   |   |-- AccountController.java
|   |   |   |           |   |   `-- dto
|   |   |   |           |   |       |-- AccountResponse.java
|   |   |   |           |   |       |-- AccountSummaryResponse.java
|   |   |   |           |   |       `-- OpenAccountRequest.java
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- AccountProvisioningService.java
|   |   |   |           |   |   |-- ChangeAccountStatusService.java
|   |   |   |           |   |   |-- GetAccountDetailsService.java
|   |   |   |           |   |   |-- ListCustomerAccountsService.java
|   |   |   |           |   |   |-- OpenAccountService.java
|   |   |   |           |   |   |-- port
|   |   |   |           |   |   |   |-- in
|   |   |   |           |   |   |   |   |-- AccountUseCase.java
|   |   |   |           |   |   |   |   |-- ChangeAccountStatusUseCase.java
|   |   |   |           |   |   |   |   |-- GetAccountDetailsUseCase.java
|   |   |   |           |   |   |   |   |-- ListCustomerAccountsUseCase.java
|   |   |   |           |   |   |   |   `-- OpenAccountUseCase.java
|   |   |   |           |   |   |   `-- out
|   |   |   |           |   |   |       `-- AccountPersistencePort.java
|   |   |   |           |   |   `-- provisioning
|   |   |   |           |   |       |-- AccountNumberGenerator.java
|   |   |   |           |   |       |-- CardProvisioner.java
|   |   |   |           |   |       `-- ParentAccountValidator.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   |-- Account.java
|   |   |   |           |   |   |-- AccountBalance.java
|   |   |   |           |   |   |-- AccountLimit.java
|   |   |   |           |   |   `-- AccountPolicy.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       |-- AccountJpaRepository.java
|   |   |   |           |       `-- AccountPersistenceAdapter.java
|   |   |   |           |-- admin
|   |   |   |           |   |-- api
|   |   |   |           |   |   `-- AdminAuditController.java
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- KycApprovalService.java
|   |   |   |           |   |   |-- ReviewAuditLogService.java
|   |   |   |           |   |   `-- port
|   |   |   |           |   |       |-- in
|   |   |   |           |   |       |   |-- AdminUseCase.java
|   |   |   |           |   |       |   `-- KycApprovalUseCase.java
|   |   |   |           |   |       `-- out
|   |   |   |           |   |           `-- AuditLogPersistencePort.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       |-- AuditLogJpaEntity.java
|   |   |   |           |       |-- AuditLogJpaRepository.java
|   |   |   |           |       `-- AuditLogPersistenceAdapter.java
|   |   |   |           |-- aml
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- AmlCaseService.java
|   |   |   |           |   |   `-- TransactionMonitoringService.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   |-- AccountHold.java
|   |   |   |           |   |   |-- AmlAlert.java
|   |   |   |           |   |   |-- AmlCase.java
|   |   |   |           |   |   `-- SuspiciousTransactionReport.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       `-- AmlAlertJpaRepository.java
|   |   |   |           |-- apigateway
|   |   |   |           |   |-- api
|   |   |   |           |   |   |-- ApiKeyController.java
|   |   |   |           |   |   `-- dto
|   |   |   |           |   |       |-- ApiKeyResponse.java
|   |   |   |           |   |       `-- CreateApiKeyRequest.java
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- ApiClientService.java
|   |   |   |           |   |   |-- CreateApiKeyService.java
|   |   |   |           |   |   |-- WebhookDispatcherService.java
|   |   |   |           |   |   `-- port
|   |   |   |           |   |       |-- in
|   |   |   |           |   |       |   `-- CreateApiKeyUseCase.java
|   |   |   |           |   |       `-- out
|   |   |   |           |   |           `-- ApiKeyPersistencePort.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   |-- ApiAuditEvent.java
|   |   |   |           |   |   |-- ApiClient.java
|   |   |   |           |   |   `-- ApiKey.java
|   |   |   |           |   |-- infrastructure
|   |   |   |           |   |   |-- ApiAuditEventJpaRepository.java
|   |   |   |           |   |   |-- ApiClientJpaRepository.java
|   |   |   |           |   |   |-- ApiKeyJpaAdapter.java
|   |   |   |           |   |   |-- ApiKeyJpaEntity.java
|   |   |   |           |   |   `-- ApiKeyJpaRepository.java
|   |   |   |           |   |-- presentation
|   |   |   |           |   |   `-- DynamicQrController.java
|   |   |   |           |   `-- security
|   |   |   |           |       |-- ApiAuditLoggingFilter.java
|   |   |   |           |       |-- ApiGatewayIdempotencyInterceptor.java
|   |   |   |           |       |-- ApiKeyAuthenticationFilter.java
|   |   |   |           |       |-- ApiKeyAuthenticationToken.java
|   |   |   |           |       |-- ApiSignatureFilter.java
|   |   |   |           |       |-- CidrWhitelistValidator.java
|   |   |   |           |       `-- GatewayRateLimitFilter.java
|   |   |   |           |-- banking
|   |   |   |           |   `-- orchestration
|   |   |   |           |       `-- domain
|   |   |   |           |           `-- RoutingRule.java
|   |   |   |           |-- common
|   |   |   |           |   |-- audit
|   |   |   |           |   |   |-- AuditContext.java
|   |   |   |           |   |   |-- AuditEvent.java
|   |   |   |           |   |   |-- AuditEventPublisher.java
|   |   |   |           |   |   `-- AuditLogRecord.java
|   |   |   |           |   |-- enums
|   |   |   |           |   |   |-- AccountStatus.java
|   |   |   |           |   |   |-- RoleType.java
|   |   |   |           |   |   `-- TransactionType.java
|   |   |   |           |   |-- exception
|   |   |   |           |   |   |-- BusinessException.java
|   |   |   |           |   |   |-- ConflictException.java
|   |   |   |           |   |   |-- ErrorCode.java
|   |   |   |           |   |   |-- ForbiddenException.java
|   |   |   |           |   |   |-- GlobalExceptionHandler.java
|   |   |   |           |   |   `-- NotFoundException.java
|   |   |   |           |   |-- mapper
|   |   |   |           |   |   `-- BaseMapper.java
|   |   |   |           |   |-- resilience
|   |   |   |           |   |   |-- CriticalBusinessService.java
|   |   |   |           |   |   |-- CriticalBusinessServiceJpaRepository.java
|   |   |   |           |   |   |-- PaymentFailoverService.java
|   |   |   |           |   |   `-- ResilienceEngine.java
|   |   |   |           |   |-- response
|   |   |   |           |   |   |-- ApiResponse.java
|   |   |   |           |   |   `-- PagedResponse.java
|   |   |   |           |   `-- util
|   |   |   |           |       |-- DateUtils.java
|   |   |   |           |       |-- IdempotencyKeyUtils.java
|   |   |   |           |       |-- MaskingUtils.java
|   |   |   |           |       `-- MoneyUtils.java
|   |   |   |           |-- complaint
|   |   |   |           |   |-- application
|   |   |   |           |   |   `-- CustomerComplaintService.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   `-- CustomerComplaint.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       `-- CustomerComplaintJpaRepository.java
|   |   |   |           |-- config
|   |   |   |           |   |-- ActuatorSecurityConfig.java
|   |   |   |           |   |-- AsyncConfig.java
|   |   |   |           |   |-- CacheConfig.java
|   |   |   |           |   |-- CorsConfig.java
|   |   |   |           |   |-- DataInitializer.java
|   |   |   |           |   |-- JacksonConfig.java
|   |   |   |           |   |-- OpenApiConfig.java
|   |   |   |           |   |-- RateLimitConfig.java
|   |   |   |           |   |-- SecretsConfig.java
|   |   |   |           |   |-- SecurityConfig.java
|   |   |   |           |   `-- WebSocketConfig.java
|   |   |   |           |-- customer
|   |   |   |           |   |-- api
|   |   |   |           |   |   |-- CustomerController.java
|   |   |   |           |   |   `-- dto
|   |   |   |           |   |       |-- CustomerCreateRequest.java
|   |   |   |           |   |       |-- CustomerResponse.java
|   |   |   |           |   |       |-- CustomerUpdateRequest.java
|   |   |   |           |   |       `-- NotificationResponse.java
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- CreateCustomerService.java
|   |   |   |           |   |   |-- GetCustomerAlertsService.java
|   |   |   |           |   |   |-- GetCustomerProfileService.java
|   |   |   |           |   |   |-- UpdateCustomerProfileService.java
|   |   |   |           |   |   `-- port
|   |   |   |           |   |       |-- in
|   |   |   |           |   |       |   |-- CreateCustomerUseCase.java
|   |   |   |           |   |       |   |-- CustomerUseCase.java
|   |   |   |           |   |       |   |-- GetCustomerAlertsUseCase.java
|   |   |   |           |   |       |   `-- GetCustomerProfileUseCase.java
|   |   |   |           |   |       `-- out
|   |   |   |           |   |           `-- CustomerPersistencePort.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   |-- Customer.java
|   |   |   |           |   |   |-- CustomerPolicy.java
|   |   |   |           |   |   `-- CustomerProfile.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       |-- CustomerJpaRepository.java
|   |   |   |           |       `-- CustomerPersistenceAdapter.java
|   |   |   |           |-- fraud
|   |   |   |           |   |-- application
|   |   |   |           |   |   `-- FraudManagementService.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   |-- DeviceRisk.java
|   |   |   |           |   |   `-- FraudCase.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       |-- DeviceRiskJpaRepository.java
|   |   |   |           |       `-- FraudCaseJpaRepository.java
|   |   |   |           |-- governance
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- RegulatoryGovernanceService.java
|   |   |   |           |   |   `-- RegulatoryReportingService.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   |-- ComplianceEvidenceRecord.java
|   |   |   |           |   |   `-- RegulatoryRequirement.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       |-- ComplianceEvidenceRecordJpaRepository.java
|   |   |   |           |       `-- RegulatoryRequirementJpaRepository.java
|   |   |   |           |-- legacy
|   |   |   |           |   |-- README.md
|   |   |   |           |   `-- v1-deprecated
|   |   |   |           |-- merchant
|   |   |   |           |   |-- application
|   |   |   |           |   |   `-- MerchantApplicationService.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   `-- Merchant.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       `-- MerchantJpaRepository.java
|   |   |   |           |-- notification
|   |   |   |           |   |-- api
|   |   |   |           |   |   |-- NotificationController.java
|   |   |   |           |   |   `-- dto
|   |   |   |           |   |       `-- NotificationResponse.java
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- SendOtpNotificationService.java
|   |   |   |           |   |   |-- SendStatementReadyNotificationService.java
|   |   |   |           |   |   |-- SendTransactionAlertService.java
|   |   |   |           |   |   `-- port
|   |   |   |           |   |       `-- out
|   |   |   |           |   |           |-- EmailPort.java
|   |   |   |           |   |           |-- PushNotificationPort.java
|   |   |   |           |   |           `-- SmsPort.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       |-- EmailProviderAdapter.java
|   |   |   |           |       |-- PushNotificationAdapter.java
|   |   |   |           |       `-- SmsProviderAdapter.java
|   |   |   |           |-- orchestration
|   |   |   |           |   |-- api
|   |   |   |           |   |   |-- OrchestrationController.java
|   |   |   |           |   |   `-- dto
|   |   |   |           |   |       |-- OrchestrationRequest.java
|   |   |   |           |   |       `-- OrchestrationResponse.java
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- PaymentOrchestrationService.java
|   |   |   |           |   |   |-- ReconciliationService.java
|   |   |   |           |   |   `-- port
|   |   |   |           |   |       |-- in
|   |   |   |           |   |       |   `-- PaymentOrchestrationUseCase.java
|   |   |   |           |   |       `-- out
|   |   |   |           |   |           |-- MultiRailGatewayPort.java
|   |   |   |           |   |           |-- PaymentRailConfigurationPort.java
|   |   |   |           |   |           `-- RoutingRulePersistencePort.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   |-- PaymentGateway.java
|   |   |   |           |   |   |-- PaymentRail.java
|   |   |   |           |   |   `-- PaymentRailConfiguration.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       |-- MultiRailGatewayAdapter.java
|   |   |   |           |       |-- PaymentRailConfigurationJpaAdapter.java
|   |   |   |           |       |-- PaymentRailConfigurationJpaRepository.java
|   |   |   |           |       |-- RoutingRuleJpaAdapter.java
|   |   |   |           |       `-- RoutingRuleJpaRepository.java
|   |   |   |           |-- payment
|   |   |   |           |   |-- api
|   |   |   |           |   |   `-- PaymentGatewayController.java
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- DynamicQrService.java
|   |   |   |           |   |   |-- GatewayDisputeService.java
|   |   |   |           |   |   |-- PaymentIntentService.java
|   |   |   |           |   |   `-- PaymentMessagingService.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   |-- DynamicQrPayment.java
|   |   |   |           |   |   |-- GatewayDispute.java
|   |   |   |           |   |   |-- HierarchicalLimitValidator.java
|   |   |   |           |   |   |-- PaymentIntent.java
|   |   |   |           |   |   |-- PaymentMessage.java
|   |   |   |           |   |   |-- PaymentParticipant.java
|   |   |   |           |   |   `-- Refund.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       |-- DynamicQrPaymentJpaRepository.java
|   |   |   |           |       |-- GatewayDisputeJpaRepository.java
|   |   |   |           |       |-- PaymentIntentJpaRepository.java
|   |   |   |           |       |-- PaymentMessageJpaRepository.java
|   |   |   |           |       |-- PaymentParticipantJpaRepository.java
|   |   |   |           |       `-- RefundJpaRepository.java
|   |   |   |           |-- product
|   |   |   |           |   |-- api
|   |   |   |           |   |   `-- ProductController.java
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- GetProductCatalogService.java
|   |   |   |           |   |   `-- port
|   |   |   |           |   |       |-- in
|   |   |   |           |   |       |   `-- ProductUseCase.java
|   |   |   |           |   |       `-- out
|   |   |   |           |   |           `-- ProductPersistencePort.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   |-- BankProduct.java
|   |   |   |           |   |   `-- ProductType.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       |-- ProductJpaRepository.java
|   |   |   |           |       `-- ProductPersistenceAdapter.java
|   |   |   |           |-- reporting
|   |   |   |           |   |-- api
|   |   |   |           |   |   `-- ReportingController.java
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- GenerateMonthlyReportService.java
|   |   |   |           |   |   `-- port
|   |   |   |           |   |       |-- in
|   |   |   |           |   |       |   `-- ReportingUseCase.java
|   |   |   |           |   |       `-- out
|   |   |   |           |   |           `-- ReportingPersistencePort.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   `-- ReportRequest.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       `-- ReportingPersistenceAdapter.java
|   |   |   |           |-- security
|   |   |   |           |   |-- auth
|   |   |   |           |   |   |-- ApplicationSecurityBeansConfig.java
|   |   |   |           |   |   |-- AuthenticationController.java
|   |   |   |           |   |   |-- AuthenticationService.java
|   |   |   |           |   |   |-- AuthorizationService.java
|   |   |   |           |   |   |-- CustomUserDetailsService.java
|   |   |   |           |   |   |-- LoginAttemptService.java
|   |   |   |           |   |   |-- PasswordResetTokenService.java
|   |   |   |           |   |   |-- WebAuthnSecurityConfig.java
|   |   |   |           |   |   |-- domain
|   |   |   |           |   |   |   `-- WebAuthnCredential.java
|   |   |   |           |   |   |-- dto
|   |   |   |           |   |   |   |-- AuthenticationRequest.java
|   |   |   |           |   |   |   |-- AuthenticationResponse.java
|   |   |   |           |   |   |   |-- FaceVerificationRequest.java
|   |   |   |           |   |   |   |-- ForgotPasswordRequest.java
|   |   |   |           |   |   |   |-- OtpRequest.java
|   |   |   |           |   |   |   `-- ResetPasswordRequest.java
|   |   |   |           |   |   `-- infrastructure
|   |   |   |           |   |       `-- WebAuthnCredentialRepository.java
|   |   |   |           |   |-- jwt
|   |   |   |           |   |   |-- JwtAuthenticationFilter.java
|   |   |   |           |   |   |-- JwtClaimsFactory.java
|   |   |   |           |   |   |-- JwtTokenProvider.java
|   |   |   |           |   |   `-- TokenBlacklistService.java
|   |   |   |           |   |-- mfa
|   |   |   |           |   |   |-- DeviceTrustService.java
|   |   |   |           |   |   |-- OtpService.java
|   |   |   |           |   |   `-- OtpVerificationService.java
|   |   |   |           |   `-- policy
|   |   |   |           |       |-- AccessPolicy.java
|   |   |   |           |       |-- PasswordPolicy.java
|   |   |   |           |       `-- SegregationOfDutiesPolicy.java
|   |   |   |           |-- settlement
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- AdvancedSettlementService.java
|   |   |   |           |   |   `-- MerchantSettlementService.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   |-- MerchantBalance.java
|   |   |   |           |   |   |-- SettlementBatch.java
|   |   |   |           |   |   |-- SettlementException.java
|   |   |   |           |   |   |-- SettlementInstruction.java
|   |   |   |           |   |   `-- SettlementWindow.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       |-- MerchantBalanceJpaRepository.java
|   |   |   |           |       |-- SettlementBatchJpaRepository.java
|   |   |   |           |       |-- SettlementExceptionJpaRepository.java
|   |   |   |           |       |-- SettlementInstructionJpaRepository.java
|   |   |   |           |       `-- SettlementWindowJpaRepository.java
|   |   |   |           |-- statement
|   |   |   |           |   |-- api
|   |   |   |           |   |   |-- StatementController.java
|   |   |   |           |   |   `-- dto
|   |   |   |           |   |       `-- StatementResponse.java
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- GenerateStatementService.java
|   |   |   |           |   |   |-- GetStatementService.java
|   |   |   |           |   |   `-- port
|   |   |   |           |   |       |-- in
|   |   |   |           |   |       |   `-- StatementUseCase.java
|   |   |   |           |   |       `-- out
|   |   |   |           |   |           |-- StatementGeneratorPort.java
|   |   |   |           |   |           `-- StatementPersistencePort.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   `-- Statement.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       |-- PdfStatementGenerator.java
|   |   |   |           |       |-- StatementJpaRepository.java
|   |   |   |           |       `-- StatementPersistenceAdapter.java
|   |   |   |           |-- transaction
|   |   |   |           |   |-- api
|   |   |   |           |   |   |-- TransactionController.java
|   |   |   |           |   |   |-- TransactionIntentController.java
|   |   |   |           |   |   |-- TransferController.java
|   |   |   |           |   |   `-- dto
|   |   |   |           |   |       |-- DepositRequest.java
|   |   |   |           |   |       |-- DisputeReasonRequest.java
|   |   |   |           |   |       |-- ExternalPaymentRequest.java
|   |   |   |           |   |       |-- InternalTransferRequest.java
|   |   |   |           |   |       |-- ReceiptNotificationRequest.java
|   |   |   |           |   |       |-- TransactionResponse.java
|   |   |   |           |   |       `-- WithdrawRequest.java
|   |   |   |           |   |-- application
|   |   |   |           |   |   |-- DepositService.java
|   |   |   |           |   |   |-- DisputeTransactionService.java
|   |   |   |           |   |   |-- ExternalPaymentService.java
|   |   |   |           |   |   |-- GetTransactionHistoryService.java
|   |   |   |           |   |   |-- IdempotencyGuardService.java
|   |   |   |           |   |   |-- InternalTransferService.java
|   |   |   |           |   |   |-- ReverseTransactionService.java
|   |   |   |           |   |   |-- ScheduledTransferService.java
|   |   |   |           |   |   |-- TransactionAccountResolver.java
|   |   |   |           |   |   |-- TransactionAuthorizationService.java
|   |   |   |           |   |   |-- WithdrawService.java
|   |   |   |           |   |   |-- ZeroBalanceSweepService.java
|   |   |   |           |   |   `-- port
|   |   |   |           |   |       |-- in
|   |   |   |           |   |       |   |-- DepositUseCase.java
|   |   |   |           |   |       |   |-- ExternalPaymentUseCase.java
|   |   |   |           |   |       |   |-- GetTransactionHistoryUseCase.java
|   |   |   |           |   |       |   |-- TransactionUseCase.java
|   |   |   |           |   |       |   `-- WithdrawUseCase.java
|   |   |   |           |   |       `-- out
|   |   |   |           |   |           |-- FraudScreeningPort.java
|   |   |   |           |   |           |-- LedgerPersistencePort.java
|   |   |   |           |   |           `-- PaymentGatewayPort.java
|   |   |   |           |   |-- domain
|   |   |   |           |   |   |-- AuthorizationAttempt.java
|   |   |   |           |   |   |-- DisputeCase.java
|   |   |   |           |   |   |-- EntryType.java
|   |   |   |           |   |   |-- LedgerEntry.java
|   |   |   |           |   |   |-- SufficientFundsPolicy.java
|   |   |   |           |   |   |-- Transaction.java
|   |   |   |           |   |   |-- TransactionIntent.java
|   |   |   |           |   |   |-- TransactionIntentStatus.java
|   |   |   |           |   |   |-- TransactionStatus.java
|   |   |   |           |   |   `-- TransferPolicy.java
|   |   |   |           |   `-- infrastructure
|   |   |   |           |       |-- AuthorizationAttemptJpaRepository.java
|   |   |   |           |       |-- DisputeCaseJpaRepository.java
|   |   |   |           |       |-- FraudScreeningAdapter.java
|   |   |   |           |       |-- LedgerEntryJpaRepository.java
|   |   |   |           |       |-- LedgerJpaAdapter.java
|   |   |   |           |       |-- LedgerJpaRepository.java
|   |   |   |           |       |-- PaymentGatewayAdapter.java
|   |   |   |           |       |-- TransactionIntentJpaRepository.java
|   |   |   |           |       `-- TransactionJpaRepository.java
|   |   |   |           `-- web
|   |   |   |               |-- advice
|   |   |   |               |   `-- ResponseSanitizerAdvice.java
|   |   |   |               |-- filter
|   |   |   |               |   |-- CorrelationIdFilter.java
|   |   |   |               |   |-- RateLimitFilter.java
|   |   |   |               |   |-- RequestLoggingFilter.java
|   |   |   |               |   `-- SecurityHeadersFilter.java
|   |   |   |               `-- interceptor
|   |   |   |                   `-- AuditInterceptor.java
|   |   |   `-- structure.md
|   |   `-- resources
|   |       |-- application-dev.yml
|   |       |-- application-prod.yml
|   |       |-- application-staging.yml
|   |       |-- application-test.yml
|   |       |-- application.yml
|   |       |-- banner.txt
|   |       |-- db
|   |       |   `-- migration
|   |       |       |-- V10__relax_legacy_api_keys_constraints.sql
|   |       |       |-- V12__add_kyc_fields_to_customers.sql
|   |       |       |-- V13__add_card_details_to_accounts.sql
|   |       |       |-- V14__add_cdd_and_lock_fields_to_customers.sql
|   |       |       |-- V15__add_aml_schema.sql
|   |       |       |-- V16__add_vam_limits_and_permissions.sql
|   |       |       |-- V17__add_api_key_account_binding.sql
|   |       |       |-- V18__add_payment_gateway_schema.sql
|   |       |       |-- V19__add_merchant_settlement_schema.sql
|   |       |       |-- V1__init_schema.sql
|   |       |       |-- V20__add_gateway_disputes_schema.sql
|   |       |       |-- V21__add_api_audit_trail.sql
|   |       |       |-- V22__add_regulatory_requirements_schema.sql
|   |       |       |-- V23__add_afasa_fraud_management_schema.sql
|   |       |       |-- V24__add_payment_messaging_schema.sql
|   |       |       |-- V25__add_advanced_settlement_schema.sql
|   |       |       |-- V26__add_customer_complaints_schema.sql
|   |       |       |-- V27__add_resilience_rto_rpo_schema.sql
|   |       |       |-- V28__add_compliance_evidence_schema.sql
|   |       |       |-- V29__add_dynamic_qr_payment_schema.sql
|   |       |       |-- V2__accounts_and_balances.sql
|   |       |       |-- V30__add_webauthn_credentials.sql
|   |       |       |-- V31__add_transaction_intents.sql
|   |       |       |-- V32__add_authorization_attempts.sql
|   |       |       |-- V3__transactions_and_ledger.sql
|   |       |       |-- V4__products_and_statements.sql
|   |       |       |-- V5__api_gateway_and_security.sql
|   |       |       |-- V6__orchestration_and_routing.sql
|   |       |       |-- V7__payroll_and_ledger.sql
|   |       |       |-- V8__add_transaction_dispute_columns.sql
|   |       |       `-- V9__api_gateway_enforcement.sql
|   |       `-- logback-spring.xml
|   `-- test
|       |-- java
|       |   `-- com
|       |       `-- company
|       |           `-- banking
|       |               |-- account
|       |               |-- apigateway
|       |               |   `-- security
|       |               |       `-- ApiSecurityTestSuite.java
|       |               |-- customer
|       |               |-- integration
|       |               |   |-- AccountApiIT.java
|       |               |   `-- TransferFlowIT.java
|       |               |-- security
|       |               `-- transaction
|       |                   `-- TransactionAuthorizationIT.java
|       `-- resources
|           `-- application-test.yml
`-- structure.md

164 directories, 364 files
