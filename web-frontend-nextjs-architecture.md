# Web Frontend Banking Application Architecture (Next.js + TypeScript + Tailwind CSS)

## Alignment With Backend and Mobile Clients

This web frontend targets the same hardened Spring Boot backend already implemented, consuming identical endpoints under `/api/v1` — `auth/login`, `auth/otp`, `accounts`, `transfers/internal`, `transactions/{deposit|withdraw|external-payment}`, `statements`, `products`, and `admin/audit` — behind the Nginx/load-balancer edge with JWT bearer auth, `X-Request-Id` correlation, and `Idempotency-Key` enforcement on money-moving calls. Unlike the React Native mobile client, the web app runs in a browser with no Keystore, no BiometricPrompt, and no OS-level root/tamper detection, so its security model substitutes browser-native and server-side controls (httpOnly cookies, CSP, SSR-side token handling, WebAuthn) instead of native modules. The web app also owns a capability the mobile app does not need: an internal **API documentation / developer gateway page** that renders the backend's OpenAPI contract for internal engineers, QA, and partner integrators.

## Why Web Differs From Mobile (Platform Constraint Table)

| Concern | Mobile (React Native) | Web (Next.js) |
|---|---|---|
| Token storage | react-native-keychain (Keystore-backed) | httpOnly, Secure, SameSite=Strict cookies set by a Next.js Route Handler — never localStorage |
| Biometrics | Native BiometricPrompt | WebAuthn/Passkeys (platform authenticator) as step-up, optional |
| Root/tamper detection | Native root-check modules | Not applicable; mitigated via CSP, SRI, Subresource integrity, bot detection |
| Screenshot/recording block | FLAGSECURE | Not applicable; mitigated via masking sensitive data and short session TTL |
| Rendering | Client-only bundle via Metro | Server-side rendering (RSC) + selective client components, reducing exposed business logic in the browser bundle |
| Certificate pinning | OkHttp/react-native-ssl-pinning | Not feasible in browsers; rely on HSTS + CAA + backend TLS |
| API docs / gateway UI | Not applicable (no dev-facing surface) | Dedicated `/developers` API documentation page rendering OpenAPI spec |
| Offline cache | RTK Query persisted cache | Server-driven; browser cache limited to short-lived read-only data with explicit revalidation |

## Technology Stack

- Framework: **Next.js 16 (App Router, LTS 16.2.x)** using React Server Components by default and Client Components only where interactivity is required[web:66][web:63].
- Language: **TypeScript** end-to-end (strict mode), no `any` in domain or API layers.
- UI: **Tailwind CSS v4.x** (CSS-first config, `@theme` tokens) for styling, no CSS-in-JS runtime overhead[web:67][web:70].
- State/data: **TanStack Query** for server-state caching (mirrors RTK Query pattern from mobile) plus **Zustand** for lightweight client-only UI state (modals, wizard steps) — deliberately not Redux, since RSC reduces the amount of client state needed.
- Forms/validation: **React Hook Form + Zod**, sharing the same Zod schemas philosophy used in the mobile app for parity between platforms.
- HTTP: **native `fetch`** wrapped in a typed API client, since Next.js Route Handlers proxy sensitive calls server-side.
- Auth: **NextAuth.js (Auth.js) v5** or a custom JWT-in-httpOnly-cookie flow issued via a Next.js Route Handler that calls the Spring Boot `/api/v1/auth/login` endpoint server-side, so the raw JWT never reaches client JavaScript.
- API docs rendering: **Scalar API Reference** or **Redoc** component consuming the backend's OpenAPI 3.1 JSON, embedded in an internal-only `/developers` route.
- Testing: **Vitest** (unit), **React Testing Library** (component), **Playwright** (E2E), matching the backend's IT-test rigor.
- Tooling: **ESLint (flat config) + Prettier + Husky + lint-staged**, **pnpm** as package manager for faster, disk-efficient installs.

## Core Security Features (Web-Specific)

- **httpOnly, Secure, SameSite=Strict session cookies** issued by a Next.js Route Handler (`/api/auth/session`) — the JWT and refresh token never touch `localStorage`/`sessionStorage`, eliminating the primary XSS token-theft vector that mobile avoids via Keystore.
- **Content-Security-Policy (CSP)** with strict `script-src 'self' 'nonce-{random}'`, no `unsafe-inline`, enforced via `next.config.ts` headers, to block injected script execution even if a dependency is compromised.
- **Server-side BFF (Backend-for-Frontend) pattern**: all money-moving requests route through Next.js Route Handlers that attach the JWT, `X-Request-Id`, and `Idempotency-Key` server-side before calling Spring Boot — the browser only ever talks to the same-origin Next.js server, never directly to the banking API origin.
- **CSRF protection** via double-submit cookie or SameSite=Strict cookies, required because cookie-based auth (unlike mobile's Bearer-header JWT) is CSRF-exposed by default.
- **WebAuthn/Passkey step-up authentication** for high-risk actions (transfers, external payments), functionally equivalent to the mobile app's BiometricPrompt step-up.
- **Rate limiting at the Route Handler layer** (e.g., `@upstash/ratelimit` or in-memory token bucket for self-hosted) as a second layer behind Nginx, mirroring the backend's defense-in-depth philosophy.
- **Idempotency-Key generation (UUID v4)** per money-moving user action, generated client-side once per draft and re-sent on retry — identical contract to the mobile app and backend's `IdempotencyGuardService`.
- **Correlation ID propagation**: every Route Handler generates/forwards `X-Request-Id` so browser-originated requests join the same Nginx → Spring Boot → audit trail used by mobile.
- **Session auto-timeout and idle lock**: shorter-lived session cookies (e.g., 15 minutes idle) than mobile, since browser sessions are inherently more exposed to shared/public machines.
- **Sensitive data masking in the DOM**: account numbers, balances masked by default (`****1234`) with an explicit "reveal" action, reducing shoulder-surfing risk since screenshot-blocking (used on mobile) is not possible in a browser.
- **Subresource Integrity (SRI) and dependency pinning**: lockfile-enforced (`pnpm-lock.yaml`), Dependabot/Renovate for automated, reviewed dependency upgrades.
- **Security headers** (`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`) set centrally in `next.config.ts` middleware.

## Common/Core API Integration Points

| Feature Area | Backend Endpoint | Web Module |
|---|---|---|
| Authentication | `POST /api/v1/auth/login` | `app/(auth)/login`, `services/auth/authService.ts` via Route Handler proxy |
| MFA/OTP | `POST /api/v1/auth/otp/verify` | `app/(auth)/otp`, step-up flow |
| Accounts | `GET /api/v1/accounts`, `GET /api/v1/accounts/{id}` | `app/(dashboard)/accounts` |
| Internal transfer | `POST /api/v1/transfers/internal` | `app/(dashboard)/transfers`, requires `Idempotency-Key` |
| Deposit/Withdraw/External payment | `POST /api/v1/transactions/{deposit\|withdraw\|external-payment}` | `app/(dashboard)/transactions` |
| Statements | `GET /api/v1/statements/account/{accountNumber}` | `app/(dashboard)/statements`, server-streamed PDF |
| Products | `GET /api/v1/products` | `app/(dashboard)/products`, cached read |
| Admin audit | `GET /api/v1/admin/audit` | `app/(admin)/audit`, ROLE_ADMIN gate |
| API documentation gateway | OpenAPI JSON from `springdoc-openapi` at `/v3/api-docs` | `app/developers`, rendered via Scalar/Redoc, internal-role-gated |

## Functional Requirements (Web)

- Users can log in, complete OTP/MFA, and optionally register a WebAuthn passkey for future logins.
- Users can view account summaries, balances (masked by default), and detailed transaction history with pagination and filters.
- Users can initiate internal transfers, deposits, withdrawals, and external payments through a multi-step review-then-confirm flow with idempotency-key protection.
- Users can generate and download/view PDF statements without persisting unencrypted copies client-side beyond the browser's normal download behavior.
- Admin/Teller roles see additional protected routes (audit log viewer, account status management) gated both client-side (route guards) and server-side (Route Handler role checks), with the Spring Boot backend remaining the sole authority.
- Internal engineering/QA/partner users can browse a live, versioned API documentation page reflecting the current OpenAPI contract, including request/response schemas and try-it-out console scoped to non-production environments only.
- All forms provide inline validation (Zod) before submission, with server-side error codes mapped to localized, user-friendly messages.

## Non-Functional Requirements (Web)

- **Performance**: Core Web Vitals targets — LCP < 2.5s, INP < 200ms, CLS < 0.1; achieved via RSC streaming, route-level code splitting, and image optimization (`next/image`).
- **Scalability**: Stateless Next.js server deployment behind the same Nginx/load-balancer tier as the backend, horizontally scalable via container replicas (Docker/Kubernetes HPA).
- **Maintainability**: Strict feature-folder structure (`app/`, `services/`, `components/`, `state/`) with one responsibility per file, mirroring the backend's ports-and-adapters discipline so any engineer can trace a feature end-to-end.
- **Debuggability**: Structured client-side logger correlating `X-Request-Id` with Sentry (or equivalent) error reporting; every Route Handler logs the same correlation ID server-side for cross-tier tracing with the Spring Boot audit trail.
- **Security compliance**: OWASP ASVS Level 2 baseline, CSP enforced, dependency vulnerability scanning (`pnpm audit`, Snyk/Dependabot) in CI.
- **Accessibility**: WCAG 2.2 AA compliance for all customer-facing screens, verified via `eslint-plugin-jsx-a11y` and axe-core in CI.
- **Availability**: 99.9% uptime target; health check route (`/api/health`) wired to the same load-balancer probes as the backend's actuator health endpoint.
- **Testability**: Minimum 80% coverage on `services/` and `hooks/`; Playwright E2E suite covering login, transfer, and statement flows before each release.
- **Internationalization-ready**: `next-intl` scaffolding in place even if only English ships initially, avoiding costly retrofits.
- **Auditability**: Every state-changing client action emits a local, non-sensitive audit breadcrumb correlated by request ID, matching the mobile app's diagnostic breadcrumb pattern.

## Recommended Web Tree Diagram

```text
web-app/
  app/
    (auth)/
      login/page.tsx
      otp/page.tsx
      passkey-setup/page.tsx
    (dashboard)/
      layout.tsx
      accounts/
        page.tsx
        [accountId]/page.tsx
      transfers/
        page.tsx
        review/page.tsx
        confirm/page.tsx
      transactions/
        deposit/page.tsx
        withdraw/page.tsx
        external-payment/page.tsx
        history/page.tsx
      statements/
        page.tsx
        [accountNumber]/page.tsx
      products/page.tsx
      profile/
        page.tsx
        security/page.tsx
        devices/page.tsx
    (admin)/
      layout.tsx
      audit/page.tsx
      account-status/page.tsx
    developers/
      page.tsx
      [...slug]/page.tsx
    api/
      auth/
        login/route.ts
        refresh/route.ts
        logout/route.ts
      proxy/
        accounts/route.ts
        transfers/route.ts
        transactions/route.ts
        statements/route.ts
        products/route.ts
      health/route.ts
    layout.tsx
    error.tsx
    not-found.tsx
    globals.css
  components/
    common/
      Button.tsx
      Input.tsx
      Card.tsx
      LoadingOverlay.tsx
      ErrorBanner.tsx
    accounts/
      AccountBalanceCard.tsx
    transactions/
      TransactionListItem.tsx
    security/
      PasskeyPrompt.tsx
      MaskedValue.tsx
    docs/
      ApiReferenceViewer.tsx
  services/
    api/
      httpClient.ts
      endpoints.ts
      interceptors/
        correlationIdInterceptor.ts
        idempotencyInterceptor.ts
        errorInterceptor.ts
    auth/
      authService.ts
      sessionService.ts
      passkeyService.ts
    account/
      accountService.ts
    transaction/
      transactionService.ts
      idempotencyKeyService.ts
    statement/
      statementService.ts
    docs/
      openApiService.ts
  state/
    queryClient.ts
    uiStore.ts
    authStore.ts
  models/
    User.ts
    Account.ts
    Transaction.ts
    Statement.ts
    Product.ts
    ApiResponse.ts
  security/
    RoleGuard.tsx
    SessionGuard.tsx
    csp.ts
    rateLimiter.ts
  hooks/
    useAuth.ts
    useAccounts.ts
    useTransactions.ts
    useIdleTimeout.ts
  utils/
    formatters.ts
    validators.ts
    logger.ts
    constants.ts
  theme/
    tailwind.config.ts
    globals.css
  config/
    env.ts
    featureFlags.ts
  middleware.ts
  tests/
    unit/
      services/
        authService.test.ts
        transactionService.test.ts
    e2e/
      login.spec.ts
      transfer.spec.ts
      statements.spec.ts
  .env.example
  .eslintrc.json
  .prettierrc
  tsconfig.json
  next.config.ts
  package.json
  README.md
```

## Dependency List (Up-to-Date as of July 2026)

| Package | Version | Notes |
|---|---|---|
| next | ^16.2.12 | Active LTS release line[web:63][web:66] |
| react / react-dom | ^19.2.8 | Latest stable, includes React Compiler support[web:65][web:68] |
| typescript | ^5.9.x | Strict mode enabled |
| tailwindcss | ^4.3.x | CSS-first `@theme` config, no `tailwind.config.js` required[web:67][web:70] |
| @tanstack/react-query | ^5.x | Server-state cache |
| zustand | ^5.x | Lightweight client state |
| react-hook-form | ^7.x | Forms |
| zod | ^3.x | Schema validation, shared logic with mobile |
| next-auth (Auth.js) | ^5.x | Session/cookie auth, or custom Route Handler equivalent |
| @simplewebauthn/browser | ^11.x | Passkey/WebAuthn client |
| @scalar/api-reference-react | latest | OpenAPI documentation UI |
| eslint / eslint-config-next | ^9.x / ^16.x | Flat config |
| prettier | ^3.x | Formatting |
| vitest | ^3.x | Unit tests |
| @testing-library/react | ^16.x | Component tests |
| @playwright/test | ^1.x | E2E tests |
| husky / lint-staged | latest | Pre-commit gates |

Always run `pnpm outdated` and Dependabot/Renovate checks before each release cycle to keep this table current, since Next.js and React both ship frequent patch/security releases[web:72].

## Principal-Level Design Rationale

- **RSC-first, client-minimal**: Business logic and sensitive data-shaping stay server-side in React Server Components and Route Handlers, shrinking the attack surface exposed in the shipped JS bundle — a direct architectural analog to the backend's "never trust the edge" principle.
- **BFF pattern over direct browser-to-API calls**: The browser never holds a raw JWT or calls `api.bankingapp.com` directly; it only talks to same-origin Next.js Route Handlers, which then attach auth headers server-side — this closes the token-exposure gap that mobile solves via Keystore.
- **Cookie-based session with CSRF mitigation, not Bearer-in-localStorage**: A deliberate platform-appropriate substitute for mobile's Keychain-backed token storage, chosen because localStorage is trivially exfiltrated via any XSS, whereas httpOnly cookies are not readable by JavaScript at all.
- **Shared Zod validation contracts with mobile**: Keeping validation schema *shape* consistent (even if not literally shared as a package) reduces behavioral drift between platforms and eases backend contract testing.
- **Dedicated `/developers` API documentation gateway**: Exists only on web because it serves an internal/partner engineering audience, not end customers — gated by role and environment (disabled or read-only in production) so it never becomes an unauthenticated recon surface for attackers.
- **Ports-style service layer**: `services/` mirrors the backend's port/adapter split so any HTTP client swap (fetch → another transport) or backend contract change touches one adapter file, not scattered call sites — directly addressing the maintainability/debuggability mandate.
