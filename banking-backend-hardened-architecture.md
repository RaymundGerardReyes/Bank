# Banking Backend — Hardened, Maintainable Architecture (v2)

## Why This Update Exists

The previous tree diagram was functionally organized but insufficient for a real banking system from a **Principal Application Security Engineer** and **Principal Software Architect** point of view. It was missing edge/network security (load balancer, reverse proxy, WAF), explicit port/adapter boundaries for testability, observability wiring, migration versioning, correlation/request tracing, rate limiting, secrets handling, and legacy-safe evolution paths (ADRs, deprecation strategy). This version corrects those gaps so the codebase stays debuggable, fixable, and maintainable as the system grows and as engineers rotate on/off the project.

## Critical Architectural Principles Applied

- **Never trust the edge** — Nginx/Load Balancer + WAF sit in front of Spring Boot; Spring Boot never assumes network-level security is sufficient on its own (defense in depth).
- **Ports and adapters, not just "infrastructure"** — every external dependency (DB, SMS, payment gateway, fraud engine) is accessed through an interface (`port`) with a swappable adapter, so a legacy adapter can be replaced without touching business logic.
- **Every request is traceable** — correlation IDs, structured logs, and audit trails are mandatory, not optional, because banking incidents require forensic reconstruction.
- **Fail closed, not open** — security filters, rate limiters, and validation must default to deny/reject on ambiguous states.
- **No silent legacy debt** — deprecated modules are explicitly marked and isolated in a `legacy/` package with sunset documentation instead of being scattered or silently patched.
- **Everything reproducible** — infra, DB schema (via versioned migrations), and environment config are all code-defined, never manually configured by hand on servers.

## Network & Edge Architecture (Load Balancer / Nginx)

A banking backend must never be exposed directly to the internet. The correct edge design is:

```text
Internet
   ↓
DNS + TLS Termination (managed cert / ACM / Let's Encrypt)
   ↓
WAF (ModSecurity / Cloud WAF / Cloudflare)
   ↓
Load Balancer (Nginx, HAProxy, or Cloud LB e.g. DigitalOcean LB / AWS ALB)
   ↓
Reverse Proxy Layer (Nginx)
   │   - Enforces HTTPS-only, HSTS
   │   - Strips server-identifying headers
   │   - Applies request size limits
   │   - Applies connection/request rate limiting
   │   - Routes /api/v1/* to backend upstream pool
   ↓
Spring Boot Application Instances (2+ for HA, behind LB)
   ↓
Database Cluster (Primary + Replica)
```

Why this matters for a banking system:

- **Load balancer** distributes traffic across multiple Spring Boot instances, enabling horizontal scaling and zero-downtime rolling deployments.
- **Nginx as reverse proxy** terminates or forwards TLS, absorbs slow-client attacks, and enforces baseline HTTP hardening before a request ever reaches application code.
- **Health checks at the LB level** automatically remove unhealthy instances from rotation using Spring Boot Actuator `/actuator/health` probes.
- **Nginx rate limiting (`limit_req_zone`)** provides a first line of defense against brute-force login attempts and API abuse, complementing application-level rate limiting in Spring Boot.
- Never rely on Nginx/LB alone for security — application-layer authorization, validation, and audit logging remain mandatory (defense in depth, not defense in one place).

### Minimal Nginx Reference Block (Conceptual)

```text
upstream banking_backend {
    server backend-1:8080;
    server backend-2:8080;
    keepalive 32;
}

server {
    listen 443 ssl;
    server_name api.bankingapp.com;

    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://banking_backend;
        proxy_set_header X-Request-Id $request_id;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /actuator/health {
        allow 10.0.0.0/8;
        deny all;
    }
}
```

The `X-Request-Id` header propagated by Nginx is captured by a Spring Boot correlation filter so every log line, audit event, and error trace can be tied back to one client request end-to-end.

## Updated Backend Tree Diagram (Security & Maintainability Hardened)

```text
banking-backend/
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── README.md
├── CHANGELOG.md
├── .env.example
├── .editorconfig
├── .gitignore
├── checkstyle.xml
├── infra/
│   ├── nginx/
│   │   ├── nginx.conf
│   │   ├── conf.d/
│   │   │   ├── api.conf
│   │   │   └── security-headers.conf
│   │   └── tls/
│   │       └── README.md
│   ├── loadbalancer/
│   │   ├── lb-health-check.md
│   │   └── upstream-pool.md
│   ├── docker/
│   │   └── docker-compose.override.yml
│   └── k8s/
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── ingress.yaml
│       └── hpa.yaml
├── docs/
│   ├── architecture.md
│   ├── api-contracts.md
│   ├── sequence-flows.md
│   ├── threat-model.md
│   ├── incident-runbook.md
│   ├── decisions/
│   │   ├── ADR-0001-modular-monolith.md
│   │   ├── ADR-0002-jwt-vs-session.md
│   │   └── ADR-0003-ledger-design.md
│   └── deprecation-policy.md
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/company/banking/
│   │   │       ├── BankingApplication.java
│   │   │       │
│   │   │       ├── config/
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   ├── CorsConfig.java
│   │   │       │   ├── OpenApiConfig.java
│   │   │       │   ├── JacksonConfig.java
│   │   │       │   ├── CacheConfig.java
│   │   │       │   ├── AsyncConfig.java
│   │   │       │   ├── RateLimitConfig.java
│   │   │       │   ├── ActuatorSecurityConfig.java
│   │   │       │   └── SecretsConfig.java
│   │   │       │
│   │   │       ├── web/
│   │   │       │   ├── filter/
│   │   │       │   │   ├── CorrelationIdFilter.java
│   │   │       │   │   ├── RequestLoggingFilter.java
│   │   │       │   │   ├── RateLimitFilter.java
│   │   │       │   │   └── SecurityHeadersFilter.java
│   │   │       │   ├── interceptor/
│   │   │       │   │   └── AuditInterceptor.java
│   │   │       │   └── advice/
│   │   │       │       └── ResponseSanitizerAdvice.java
│   │   │       │
│   │   │       ├── common/
│   │   │       │   ├── exception/
│   │   │       │   │   ├── GlobalExceptionHandler.java
│   │   │       │   │   ├── BusinessException.java
│   │   │       │   │   ├── NotFoundException.java
│   │   │       │   │   ├── ForbiddenException.java
│   │   │       │   │   ├── ConflictException.java
│   │   │       │   │   └── ErrorCode.java
│   │   │       │   ├── response/
│   │   │       │   │   ├── ApiResponse.java
│   │   │       │   │   └── PagedResponse.java
│   │   │       │   ├── util/
│   │   │       │   │   ├── DateUtils.java
│   │   │       │   │   ├── MoneyUtils.java
│   │   │       │   │   ├── MaskingUtils.java
│   │   │       │   │   └── IdempotencyKeyUtils.java
│   │   │       │   ├── enums/
│   │   │       │   │   ├── AccountStatus.java
│   │   │       │   │   ├── TransactionType.java
│   │   │       │   │   └── RoleType.java
│   │   │       │   ├── mapper/
│   │   │       │   │   └── BaseMapper.java
│   │   │       │   └── audit/
│   │   │       │       ├── AuditContext.java
│   │   │       │       ├── AuditEvent.java
│   │   │       │       └── AuditEventPublisher.java
│   │   │       │
│   │   │       ├── security/
│   │   │       │   ├── jwt/
│   │   │       │   │   ├── JwtTokenProvider.java
│   │   │       │   │   ├── JwtAuthenticationFilter.java
│   │   │       │   │   ├── JwtClaimsFactory.java
│   │   │       │   │   └── TokenBlacklistService.java
│   │   │       │   ├── mfa/
│   │   │       │   │   ├── OtpService.java
│   │   │       │   │   ├── OtpVerificationService.java
│   │   │       │   │   └── DeviceTrustService.java
│   │   │       │   ├── auth/
│   │   │       │   │   ├── CustomUserDetailsService.java
│   │   │       │   │   ├── AuthenticationService.java
│   │   │       │   │   ├── AuthorizationService.java
│   │   │       │   │   └── LoginAttemptService.java
│   │   │       │   └── policy/
│   │   │       │       ├── PasswordPolicy.java
│   │   │       │       ├── AccessPolicy.java
│   │   │       │       └── SegregationOfDutiesPolicy.java
│   │   │       │
│   │   │       ├── customer/
│   │   │       │   ├── api/
│   │   │       │   │   ├── CustomerController.java
│   │   │       │   │   └── dto/
│   │   │       │   │       ├── CustomerCreateRequest.java
│   │   │       │   │       ├── CustomerUpdateRequest.java
│   │   │       │   │       └── CustomerResponse.java
│   │   │       │   ├── application/
│   │   │       │   │   ├── port/
│   │   │       │   │   │   ├── in/
│   │   │       │   │   │   │   └── CustomerUseCase.java
│   │   │       │   │   │   └── out/
│   │   │       │   │   │       └── CustomerPersistencePort.java
│   │   │       │   │   ├── CreateCustomerService.java
│   │   │       │   │   ├── UpdateCustomerProfileService.java
│   │   │       │   │   └── GetCustomerProfileService.java
│   │   │       │   ├── domain/
│   │   │       │   │   ├── Customer.java
│   │   │       │   │   ├── CustomerProfile.java
│   │   │       │   │   └── CustomerPolicy.java
│   │   │       │   └── infrastructure/
│   │   │       │       ├── CustomerJpaRepository.java
│   │   │       │       └── CustomerPersistenceAdapter.java
│   │   │       │
│   │   │       ├── account/
│   │   │       │   ├── api/
│   │   │       │   │   ├── AccountController.java
│   │   │       │   │   └── dto/
│   │   │       │   │       ├── OpenAccountRequest.java
│   │   │       │   │       ├── AccountResponse.java
│   │   │       │   │       └── AccountSummaryResponse.java
│   │   │       │   ├── application/
│   │   │       │   │   ├── port/
│   │   │       │   │   │   ├── in/
│   │   │       │   │   │   │   └── AccountUseCase.java
│   │   │       │   │   │   └── out/
│   │   │       │   │   │       └── AccountPersistencePort.java
│   │   │       │   │   ├── OpenAccountService.java
│   │   │       │   │   ├── GetAccountDetailsService.java
│   │   │       │   │   ├── ListCustomerAccountsService.java
│   │   │       │   │   └── ChangeAccountStatusService.java
│   │   │       │   ├── domain/
│   │   │       │   │   ├── Account.java
│   │   │       │   │   ├── AccountBalance.java
│   │   │       │   │   ├── AccountLimit.java
│   │   │       │   │   └── AccountPolicy.java
│   │   │       │   └── infrastructure/
│   │   │       │       ├── AccountJpaRepository.java
│   │   │       │       └── AccountPersistenceAdapter.java
│   │   │       │
│   │   │       ├── transaction/
│   │   │       │   ├── api/
│   │   │       │   │   ├── TransactionController.java
│   │   │       │   │   ├── TransferController.java
│   │   │       │   │   └── dto/
│   │   │       │   │       ├── DepositRequest.java
│   │   │       │   │       ├── WithdrawRequest.java
│   │   │       │   │       ├── InternalTransferRequest.java
│   │   │       │   │       ├── ExternalPaymentRequest.java
│   │   │       │   │       └── TransactionResponse.java
│   │   │       │   ├── application/
│   │   │       │   │   ├── port/
│   │   │       │   │   │   ├── in/
│   │   │       │   │   │   │   └── TransactionUseCase.java
│   │   │       │   │   │   └── out/
│   │   │       │   │   │       ├── LedgerPersistencePort.java
│   │   │       │   │   │       ├── PaymentGatewayPort.java
│   │   │       │   │   │       └── FraudScreeningPort.java
│   │   │       │   │   ├── DepositService.java
│   │   │       │   │   ├── WithdrawService.java
│   │   │       │   │   ├── InternalTransferService.java
│   │   │       │   │   ├── ExternalPaymentService.java
│   │   │       │   │   ├── ReverseTransactionService.java
│   │   │       │   │   ├── IdempotencyGuardService.java
│   │   │       │   │   └── GetTransactionHistoryService.java
│   │   │       │   ├── domain/
│   │   │       │   │   ├── Transaction.java
│   │   │       │   │   ├── LedgerEntry.java
│   │   │       │   │   ├── TransferPolicy.java
│   │   │       │   │   ├── SufficientFundsPolicy.java
│   │   │       │   │   └── TransactionStatus.java
│   │   │       │   └── infrastructure/
│   │   │       │       ├── TransactionJpaRepository.java
│   │   │       │       ├── LedgerJpaRepository.java
│   │   │       │       ├── PaymentGatewayAdapter.java
│   │   │       │       └── FraudScreeningAdapter.java
│   │   │       │
│   │   │       ├── statement/
│   │   │       │   ├── api/
│   │   │       │   │   ├── StatementController.java
│   │   │       │   │   └── dto/
│   │   │       │   │       └── StatementResponse.java
│   │   │       │   ├── application/
│   │   │       │   │   ├── GenerateStatementService.java
│   │   │       │   │   └── GetStatementService.java
│   │   │       │   ├── domain/
│   │   │       │   │   └── Statement.java
│   │   │       │   └── infrastructure/
│   │   │       │       ├── StatementJpaRepository.java
│   │   │       │       └── PdfStatementGenerator.java
│   │   │       │
│   │   │       ├── notification/
│   │   │       │   ├── application/
│   │   │       │   │   ├── SendOtpNotificationService.java
│   │   │       │   │   ├── SendTransactionAlertService.java
│   │   │       │   │   └── SendStatementReadyNotificationService.java
│   │   │       │   └── infrastructure/
│   │   │       │       ├── SmsProviderAdapter.java
│   │   │       │       ├── EmailProviderAdapter.java
│   │   │       │       └── PushNotificationAdapter.java
│   │   │       │
│   │   │       ├── product/
│   │   │       │   ├── api/
│   │   │       │   ├── application/
│   │   │       │   ├── domain/
│   │   │       │   └── infrastructure/
│   │   │       │
│   │   │       ├── reporting/
│   │   │       │   ├── api/
│   │   │       │   ├── application/
│   │   │       │   ├── domain/
│   │   │       │   └── infrastructure/
│   │   │       │
│   │   │       ├── admin/
│   │   │       │   ├── api/
│   │   │       │   │   └── AdminAuditController.java
│   │   │       │   └── application/
│   │   │       │       └── ReviewAuditLogService.java
│   │   │       │
│   │   │       └── legacy/
│   │   │           ├── README.md
│   │   │           └── v1-deprecated/
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-test.yml
│   │       ├── application-staging.yml
│   │       ├── application-prod.yml
│   │       ├── db/migration/
│   │       │   ├── V1__init_schema.sql
│   │       │   ├── V2__accounts_and_balances.sql
│   │       │   └── V3__transactions_and_ledger.sql
│   │       ├── logback-spring.xml
│   │       └── banner.txt
│   └── test/
│       ├── java/
│       │   └── com/company/banking/
│       │       ├── account/
│       │       ├── customer/
│       │       ├── transaction/
│       │       ├── security/
│       │       └── integration/
│       │           ├── AccountApiIT.java
│       │           └── TransferFlowIT.java
│       └── resources/
│           └── application-test.yml
└── scripts/
    ├── scaffold.sh
    ├── run-local.sh
    └── db-migrate.sh
```

### What Changed vs. the Original Diagram and Why

| Area | Original Gap | Hardened Fix | Reasoning |
|---|---|---|---|
| Edge/network | No load balancer or reverse proxy layer | Added `infra/nginx/`, `infra/loadbalancer/`, `infra/k8s/ingress.yaml` | Backend must never face the internet directly; TLS, WAF, and rate limiting belong at the edge |
| Request tracing | No correlation ID handling | Added `web/filter/CorrelationIdFilter.java` | Every request/log/audit entry must be traceable end-to-end for incident response |
| Abuse protection | No rate limiting inside the app | Added `RateLimitConfig.java`, `RateLimitFilter.java` | Nginx-level limits are not sufficient alone; app-level limits protect business logic directly |
| Testability | `application/` mixed use cases with no clear contracts | Introduced `port/in` and `port/out` interfaces (ports & adapters) | Lets you swap a payment gateway or fraud engine adapter without breaking business logic or tests |
| Idempotency | No protection against duplicate transfer submissions | Added `IdempotencyGuardService.java`, `IdempotencyKeyUtils.java` | Prevents duplicate money movement from retried or double-submitted requests |
| Secrets handling | No dedicated secrets config | Added `SecretsConfig.java` | Centralizes vault/secret-manager integration instead of scattering credentials across configs |
| Legacy code | No place for deprecated code | Added `legacy/` package with `README.md` | Keeps old logic isolated, documented, and safely removable instead of tangled in active modules |
| Governance | No architecture decision history | Added `docs/decisions/ADR-*.md` | Preserves the "why" behind architecture choices for future engineers and auditors |
| Incident response | No operational playbook | Added `docs/incident-runbook.md`, `docs/threat-model.md` | Security incidents in banking systems require a rehearsed, documented response process |
| Database evolution | No versioned migrations | Added `db/migration/V1__*.sql` (Flyway/Liquibase style) | Schema changes must be versioned, reviewable, and reversible, never applied manually |
| Observability | No actuator security boundary | Added `ActuatorSecurityConfig.java`, Nginx-restricted `/actuator/health` | Health/metrics endpoints must be network-restricted, not publicly exposed |

## Updated Backend Logic Flow

```text
Client Request (via LB / Nginx, X-Request-Id attached)
   ↓
CorrelationIdFilter (binds request ID to logging context)
   ↓
SecurityHeadersFilter
   ↓
RateLimitFilter (app-level, per user/IP/endpoint)
   ↓
Spring Security Filter Chain
   ↓
JWT / Session Validation
   ↓
Role / Permission Check (RBAC + Segregation of Duties)
   ↓
Controller (API Layer)
   ↓
Request DTO Validation
   ↓
IdempotencyGuardService (for money-moving requests)
   ↓
Application Service (Use Case, via inbound Port)
   ↓
Domain Rules / Policies (pure business logic, no framework code)
   ↓
Outbound Port → Infrastructure Adapter (DB, payment gateway, fraud engine)
   ↓
DB Transaction Commit / Rollback (ACID boundary)
   ↓
AuditEventPublisher (immutable audit trail)
   ↓
Notification Event (async, does not block response)
   ↓
ResponseSanitizerAdvice (masks sensitive fields before serialization)
   ↓
API Response (with X-Request-Id echoed back)
```

Each stage has a single, testable responsibility, which is the core requirement for a system that must remain debuggable years after the original engineers have moved on. When a production incident occurs, the correlation ID lets you reconstruct the full path of a single request across Nginx logs, application logs, and audit records without guesswork.

## Maintainability & Debuggability Rules

- **One correlation ID per request, everywhere** — Nginx, application logs, audit events, and error responses must all carry the same ID.
- **Business logic never imports Spring/JPA types directly in `domain/`** — this keeps core banking rules unit-testable without a running database or container.
- **Every money-moving endpoint requires an idempotency key** — prevents duplicate transfers caused by client retries or network timeouts.
- **Legacy code is quarantined, not deleted silently** — anything replaced goes to `legacy/` with a dated `README.md` explaining the sunset plan, so nothing breaks unexpectedly for consumers still depending on it.
- **ADRs are mandatory for irreversible decisions** — token strategy, ledger model, and monolith-vs-microservices calls are documented so future architects understand the trade-offs already considered.
- **Database changes are always migration files, never manual SQL on production** — this keeps environments reproducible and rollback-capable.
- **Actuator endpoints are restricted at the Nginx layer** — `/actuator/health` for load balancer checks only; `/actuator/env`, `/actuator/beans`, and similar must never be publicly reachable.

## Updated scaffold.sh

The scaffold script below has been rebuilt to match the hardened structure, including the Nginx/load balancer folders, ports/adapters split, ADR docs, migration files, and the quarantined legacy package.

```bash
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
```

### Key Fixes Applied to the Script

- Added `set -euo pipefail` so the script fails fast and loudly instead of silently continuing after an error, which is critical for infrastructure scripts.
- Added `mkdir -p "$(dirname "$file")"` inside the file-creation loop as a safety net in case a directory was missed, preventing silent `touch` failures.
- Split module folders to include `application/port/in` and `application/port/out` so use cases and their dependencies are explicit from day one.
- Added the `infra/nginx/`, `infra/loadbalancer/`, and `infra/k8s/` scaffolding so the edge/network layer is provisioned alongside the application code, not bolted on later.
- Added versioned Flyway-style migration files (`V1__`, `V2__`, `V3__`) instead of a placeholder folder, reflecting that schema changes must ship as reviewable code.
- Added a `legacy/` package with a `README.md` placeholder so future deprecated code has a designated home instead of polluting active modules.
- Added ADR files under `docs/decisions/` so irreversible architecture decisions are documented at scaffold time, not as an afterthought.
