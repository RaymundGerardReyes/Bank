#!/usr/bin/env bash
set -euo pipefail

base="backend/src/main/java/com/company/banking"
res="backend/src/main/resources"
test_base="backend/src/test/java/com/company/banking"

dirs=(
  # Root-level infra & docs
  "infra/nginx/conf.d"
  "infra/nginx/tls"
  "infra/loadbalancer"
  "infra/docker"
  "infra/k8s"
  "infra/terraform"
  "docs/decisions"
  "scripts"
  "web-app"
  "mobile-app"

  # Backend cross-cutting
  "$base/config"
  "$base/web/filter"
  "$base/web/interceptor"
  "$base/web/advice"
  "$base/common/exception"
  "$base/common/response"
  "$base/common/util"
  "$base/common/enums"
  "$base/common/mapper"
  "$base/common/audit"

  # Security
  "$base/security/jwt"
  "$base/security/mfa"
  "$base/security/auth"
  "$base/security/policy"

  # Domain modules (ports & adapters)
  "$base/customer/api/dto"
  "$base/customer/application/port/in"
  "$base/customer/application/port/out"
  "$base/customer/domain"
  "$base/customer/infrastructure"

  "$base/account/api/dto"
  "$base/account/application/port/in"
  "$base/account/application/port/out"
  "$base/account/domain"
  "$base/account/infrastructure"

  "$base/transaction/api/dto"
  "$base/transaction/application/port/in"
  "$base/transaction/application/port/out"
  "$base/transaction/domain"
  "$base/transaction/infrastructure"

  "$base/statement/api/dto"
  "$base/statement/application"
  "$base/statement/domain"
  "$base/statement/infrastructure"

  "$base/notification/application"
  "$base/notification/infrastructure"

  "$base/product/api"
  "$base/product/application"
  "$base/product/domain"
  "$base/product/infrastructure"

  "$base/reporting/api"
  "$base/reporting/application"
  "$base/reporting/domain"
  "$base/reporting/infrastructure"

  "$base/admin/api"
  "$base/admin/application"

  "$base/legacy/v1-deprecated"

  # Resources
  "$res/db/migration"

  # Tests
  "$test_base/account"
  "$test_base/customer"
  "$test_base/transaction"
  "$test_base/security"
  "$test_base/integration"
  "backend/src/test/resources"
)

for dir in "${dirs[@]}"; do
  mkdir -p "$dir"
done

files=(
  # Root
  "backend/Dockerfile"
  "backend/docker-compose.yml"
  "backend/README.md"
  "backend/CHANGELOG.md"
  "backend/.env.example"
  "backend/.editorconfig"
  "backend/.gitignore"
  "backend/checkstyle.xml"

  # Infra
  "infra/nginx/nginx.conf"
  "infra/nginx/conf.d/api.conf"
  "infra/nginx/conf.d/security-headers.conf"
  "infra/nginx/tls/README.md"
  "infra/loadbalancer/lb-health-check.md"
  "infra/loadbalancer/upstream-pool.md"
  "infra/docker/docker-compose.override.yml"
  "infra/k8s/deployment.yaml"
  "infra/k8s/service.yaml"
  "infra/k8s/ingress.yaml"
  "infra/k8s/hpa.yaml"

  # Docs
  "docs/architecture.md"
  "docs/api-contracts.md"
  "docs/sequence-flows.md"
  "docs/threat-model.md"
  "docs/incident-runbook.md"
  "docs/deprecation-policy.md"
  "docs/decisions/ADR-0001-modular-monolith.md"
  "docs/decisions/ADR-0002-jwt-vs-session.md"
  "docs/decisions/ADR-0003-ledger-design.md"

  # Application entrypoint
  "$base/BankingApplication.java"

  # Config
  "$base/config/SecurityConfig.java"
  "$base/config/CorsConfig.java"
  "$base/config/OpenApiConfig.java"
  "$base/config/JacksonConfig.java"
  "$base/config/CacheConfig.java"
  "$base/config/AsyncConfig.java"
  "$base/config/RateLimitConfig.java"
  "$base/config/ActuatorSecurityConfig.java"
  "$base/config/SecretsConfig.java"

  # Web cross-cutting
  "$base/web/filter/CorrelationIdFilter.java"
  "$base/web/filter/RequestLoggingFilter.java"
  "$base/web/filter/RateLimitFilter.java"
  "$base/web/filter/SecurityHeadersFilter.java"
  "$base/web/interceptor/AuditInterceptor.java"
  "$base/web/advice/ResponseSanitizerAdvice.java"

  # Common
  "$base/common/exception/GlobalExceptionHandler.java"
  "$base/common/exception/BusinessException.java"
  "$base/common/exception/NotFoundException.java"
  "$base/common/exception/ForbiddenException.java"
  "$base/common/exception/ConflictException.java"
  "$base/common/exception/ErrorCode.java"
  "$base/common/response/ApiResponse.java"
  "$base/common/response/PagedResponse.java"
  "$base/common/util/DateUtils.java"
  "$base/common/util/MoneyUtils.java"
  "$base/common/util/MaskingUtils.java"
  "$base/common/util/IdempotencyKeyUtils.java"
  "$base/common/enums/AccountStatus.java"
  "$base/common/enums/TransactionType.java"
  "$base/common/enums/RoleType.java"
  "$base/common/mapper/BaseMapper.java"
  "$base/common/audit/AuditContext.java"
  "$base/common/audit/AuditEvent.java"
  "$base/common/audit/AuditEventPublisher.java"

  # Security
  "$base/security/jwt/JwtTokenProvider.java"
  "$base/security/jwt/JwtAuthenticationFilter.java"
  "$base/security/jwt/JwtClaimsFactory.java"
  "$base/security/jwt/TokenBlacklistService.java"
  "$base/security/mfa/OtpService.java"
  "$base/security/mfa/OtpVerificationService.java"
  "$base/security/mfa/DeviceTrustService.java"
  "$base/security/auth/CustomUserDetailsService.java"
  "$base/security/auth/AuthenticationService.java"
  "$base/security/auth/AuthorizationService.java"
  "$base/security/auth/LoginAttemptService.java"
  "$base/security/policy/PasswordPolicy.java"
  "$base/security/policy/AccessPolicy.java"
  "$base/security/policy/SegregationOfDutiesPolicy.java"

  # Customer module
  "$base/customer/api/CustomerController.java"
  "$base/customer/api/dto/CustomerCreateRequest.java"
  "$base/customer/api/dto/CustomerUpdateRequest.java"
  "$base/customer/api/dto/CustomerResponse.java"
  "$base/customer/application/port/in/CustomerUseCase.java"
  "$base/customer/application/port/out/CustomerPersistencePort.java"
  "$base/customer/application/CreateCustomerService.java"
  "$base/customer/application/UpdateCustomerProfileService.java"
  "$base/customer/application/GetCustomerProfileService.java"
  "$base/customer/domain/Customer.java"
  "$base/customer/domain/CustomerProfile.java"
  "$base/customer/domain/CustomerPolicy.java"
  "$base/customer/infrastructure/CustomerJpaRepository.java"
  "$base/customer/infrastructure/CustomerPersistenceAdapter.java"

  # Account module
  "$base/account/api/AccountController.java"
  "$base/account/api/dto/OpenAccountRequest.java"
  "$base/account/api/dto/AccountResponse.java"
  "$base/account/api/dto/AccountSummaryResponse.java"
  "$base/account/application/port/in/AccountUseCase.java"
  "$base/account/application/port/out/AccountPersistencePort.java"
  "$base/account/application/OpenAccountService.java"
  "$base/account/application/GetAccountDetailsService.java"
  "$base/account/application/ListCustomerAccountsService.java"
  "$base/account/application/ChangeAccountStatusService.java"
  "$base/account/domain/Account.java"
  "$base/account/domain/AccountBalance.java"
  "$base/account/domain/AccountLimit.java"
  "$base/account/domain/AccountPolicy.java"
  "$base/account/infrastructure/AccountJpaRepository.java"
  "$base/account/infrastructure/AccountPersistenceAdapter.java"

  # Transaction module
  "$base/transaction/api/TransactionController.java"
  "$base/transaction/api/TransferController.java"
  "$base/transaction/api/dto/DepositRequest.java"
  "$base/transaction/api/dto/WithdrawRequest.java"
  "$base/transaction/api/dto/InternalTransferRequest.java"
  "$base/transaction/api/dto/ExternalPaymentRequest.java"
  "$base/transaction/api/dto/TransactionResponse.java"
  "$base/transaction/application/port/in/TransactionUseCase.java"
  "$base/transaction/application/port/out/LedgerPersistencePort.java"
  "$base/transaction/application/port/out/PaymentGatewayPort.java"
  "$base/transaction/application/port/out/FraudScreeningPort.java"
  "$base/transaction/application/DepositService.java"
  "$base/transaction/application/WithdrawService.java"
  "$base/transaction/application/InternalTransferService.java"
  "$base/transaction/application/ExternalPaymentService.java"
  "$base/transaction/application/ReverseTransactionService.java"
  "$base/transaction/application/IdempotencyGuardService.java"
  "$base/transaction/application/GetTransactionHistoryService.java"
  "$base/transaction/domain/Transaction.java"
  "$base/transaction/domain/LedgerEntry.java"
  "$base/transaction/domain/TransferPolicy.java"
  "$base/transaction/domain/SufficientFundsPolicy.java"
  "$base/transaction/domain/TransactionStatus.java"
  "$base/transaction/infrastructure/TransactionJpaRepository.java"
  "$base/transaction/infrastructure/LedgerJpaRepository.java"
  "$base/transaction/infrastructure/PaymentGatewayAdapter.java"
  "$base/transaction/infrastructure/FraudScreeningAdapter.java"

  # Statement module
  "$base/statement/api/StatementController.java"
  "$base/statement/api/dto/StatementResponse.java"
  "$base/statement/application/GenerateStatementService.java"
  "$base/statement/application/GetStatementService.java"
  "$base/statement/domain/Statement.java"
  "$base/statement/infrastructure/StatementJpaRepository.java"
  "$base/statement/infrastructure/PdfStatementGenerator.java"

  # Notification module
  "$base/notification/application/SendOtpNotificationService.java"
  "$base/notification/application/SendTransactionAlertService.java"
  "$base/notification/application/SendStatementReadyNotificationService.java"
  "$base/notification/infrastructure/SmsProviderAdapter.java"
  "$base/notification/infrastructure/EmailProviderAdapter.java"
  "$base/notification/infrastructure/PushNotificationAdapter.java"

  # Admin module
  "$base/admin/api/AdminAuditController.java"
  "$base/admin/application/ReviewAuditLogService.java"

  # Legacy
  "$base/legacy/README.md"

  # Resources
  "$res/application.yml"
  "$res/application-dev.yml"
  "$res/application-test.yml"
  "$res/application-staging.yml"
  "$res/application-prod.yml"
  "$res/db/migration/V1__init_schema.sql"
  "$res/db/migration/V2__accounts_and_balances.sql"
  "$res/db/migration/V3__transactions_and_ledger.sql"
  "$res/logback-spring.xml"
  "$res/banner.txt"
  "backend/src/test/resources/application-test.yml"

  # Test entrypoints
  "$test_base/integration/AccountApiIT.java"
  "$test_base/integration/TransferFlowIT.java"

  # Scripts
  "scripts/run-local.sh"
  "scripts/db-migrate.sh"
)

for file in "${files[@]}"; do
  if [ ! -f "$file" ]; then
    mkdir -p "$(dirname "$file")"
    touch "$file"
  fi
done

echo "Hardened banking backend scaffold completed successfully."
echo "Reminder: configure infra/nginx/nginx.conf and your load balancer upstream pool before exposing this service publicly."