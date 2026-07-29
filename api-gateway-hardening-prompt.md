# Engineering Prompt: API Gateway Hub Hardening (Real Backend Enforcement + Curl Testing)

## Purpose of This Document

This is a **prompt engineering artifact** for the Payment Orchestration Gateway page (`web-app/src/app/(dashboard)/api/page.tsx`, `ApiKeyManager.tsx`, `DomainLibrary.tsx`). The current implementation is UI-complete but functionally simulated: key generation uses a fake 800ms delay with no real HSM/backend call, the CIDR IP whitelist field accepts input but is never enforced anywhere in the request path, and there is no way for a developer to actually execute a documented endpoint. This document instructs an AI coding assistant to **correct and extend the existing files only** — no architectural rewrite, no new design system, no discarding of the current 60-30-10 theme or component structure.

---

## Context to Paste Before Every Prompt Section

```text
You are working inside an existing production banking monorepo with three components:
backend/ (Spring Boot, hexagonal architecture, ports/adapters, Flyway migrations V1-V7)
web-app/ (Next.js 16 App Router, TypeScript, Tailwind CSS, 60-30-10 design tokens)
mobile-app/ (React Native/Expo, TypeScript)

The API Gateway Hub currently renders ApiKeyManager.tsx and DomainLibrary.tsx with
simulated/dummy data: key generation is a client-side setTimeout with no backend call,
IP whitelisting (CIDR) is captured in a form field but never persisted or enforced,
and there is no way to execute a real request against any listed endpoint.

Do NOT invent a new architecture, new page layout, or new design system.
Only modify the specific files and layers named below. Preserve existing component
names, prop shapes, Tailwind classes, and the existing V5__api_gateway_and_security.sql
schema unless a field is explicitly missing and needed for a stated requirement.
Every change must be additive or corrective. Explain changes as targeted diffs,
not full-file rewrites, unless the file is short enough to justify showing in full.
```

---

## Section 1 — Replace Simulated Key Generation With Real Backend-Issued Keys

**Target files:** `web-app/.../ApiKeyManager.tsx`, new `backend/.../apigateway/api/ApiKeyController.java`, new `application/CreateApiKeyService.java`, `domain/ApiKey.java`, `infrastructure/ApiKeyJpaRepository.java`, `V5__api_gateway_and_security.sql`

**Prompt:**

> `ApiKeyManager.tsx` currently generates a key entirely client-side (`await new Promise(resolve => setTimeout(resolve, 800))`) with no server round-trip, meaning no key is ever actually persisted, hashed, or usable for real authentication. Correct this end-to-end without changing the component's visual states (processing spinner, one-time-reveal card, masked table row):
> 1. Confirm the current shape of `V5__api_gateway_and_security.sql` before altering it. If it lacks columns for `key_hash`, `key_prefix`, `environment`, `cidr_whitelist`, `scopes`, `revoked_at`, and `last_used_at`, add them as a new `V8__api_key_enforcement.sql` migration rather than editing the historical V5 file — migrations already shipped must never be rewritten.
> 2. Implement `ApiKey.java` as a new domain object following the existing pattern used by `Account.java`/`Customer.java` (plain domain object, no JPA annotations, immutable where possible).
> 3. Implement `CreateApiKeyService.java` implementing a new `CreateApiKeyUseCase.java` port, following the exact port/adapter convention already used in `account/` and `transaction/` modules. Generate the raw 256-bit key server-side using `SecureRandom`, hash it with SHA-256 for storage (per current industry guidance: raw key never stored, only its hash, with the human-visible prefix like `sk_live_` or `sk_test_` stored separately for table display)[web:97][web:104].
> 4. Expose `POST /api/v1/apikeys` via a new `ApiKeyController.java` in a new `apigateway/` module, following the same folder convention (`api/dto/application/port/domain/infrastructure`) as every other module in `backend-app-structure.md`. Return the raw key exactly once in the response body — never log it, never return it again on subsequent GETs (`ResponseSanitizerAdvice.java` must mask it on any future fetch).
> 5. Update `ApiKeyManager.tsx` to call this new endpoint instead of the local `setTimeout`, keeping the existing 800ms-style processing UX by showing the spinner until the real response resolves, not an artificial delay.

---

## Section 2 — Make the CIDR IP Whitelist Actually Enforced (Currently Cosmetic)

**Target files:** new `backend/.../apigateway/security/ApiKeyAuthenticationFilter.java`, new `CidrWhitelistValidator.java`, `SecurityConfig.java`, `ApiKeyManager.tsx`

**Prompt:**

> The "IP Whitelist (CIDR optional)" field in `ApiKeyManager.tsx` currently only stores a string in local component state — it is never validated for correct CIDR notation on input, never persisted with the key record, and never checked against the caller's actual IP on any subsequent API call. This is a security control that currently does nothing. Fix this completely:
> 1. On the frontend, validate the CIDR input format (e.g. `192.168.1.0/24` or a bare IP defaulting to `/32`) before allowing key generation to proceed, rejecting malformed entries with the existing `ErrorBanner` component pattern — do not allow an invalid CIDR string to reach the backend at all.
> 2. On the backend, persist the CIDR list (comma-separated or a join table — decide based on the existing schema convention already used for similar one-to-many relationships in this codebase) against the `ApiKey` record from Section 1.
> 3. Implement `CidrWhitelistValidator.java` using Apache Commons `SubnetUtils` for IPv4 CIDR matching, since Java has no first-party CIDR helper — this is the standard, tested approach for this exact problem[web:95][web:99]. Support the default `0.0.0.0/0` (unrestricted) value already shown as a placeholder in the UI.
> 4. Implement `ApiKeyAuthenticationFilter.java` as a new `OncePerRequestFilter`, registered in the existing `SecurityConfig.java` filter chain immediately after `JwtAuthenticationFilter`, following the same registration pattern already used for `RateLimitFilter.java` and `CorrelationIdFilter.java`. This filter must: extract `X-API-Key` header, look up the key hash, verify it is not revoked, then reject with `403 Forbidden` and a new `ErrorCode.IP_NOT_WHITELISTED` entry (added to the existing `ErrorCode.java` enum, following its current naming pattern) if the caller's resolved IP (respecting `X-Forwarded-For` from the Nginx edge, per the existing `CorrelationIdFilter` header-handling convention) does not match any whitelisted CIDR block.
> 5. Add an integration test under `test/.../security/` (following the existing `AccountApiIT.java`/`TransferFlowIT.java` naming convention) that proves a request from a non-whitelisted IP is rejected and one from a whitelisted CIDR range succeeds — this control must be provably enforced, not just visually present in the UI.

---

## Section 3 — Add Real Curl-Based API Testing to the Domain Library (Currently Missing Entirely)

**Target files:** `DomainLibrary.tsx`, new `services/docs/apiTestRunner.ts`, new `web-app/src/app/api/proxy/gateway-test/route.ts`

**Prompt:**

> `DomainLibrary.tsx` currently only *displays* the 6 domain modules and their endpoints as static read-only cards with method badges — there is no way for a developer to actually try a request. Add an interactive "Test this endpoint" capability without altering the existing card grid layout or 60-30-10 styling:
> 1. Add a "Try it" action to each endpoint row in the existing card component. On click, expand an inline panel (reuse the existing card's `hover:-translate-y-1` elevation style for the expanded state) containing: an editable JSON request body textarea (pre-filled with a realistic example per endpoint, e.g. for `POST /v1/payments` show a sample amount/currency/sourceAccount payload matching the real backend DTO field names), a dropdown to select which of the developer's own API keys to use (pulled from the real `ApiKeyManager` list added in Section 1, masked appropriately), and a "Run" button.
> 2. On "Run," construct the exact `curl` command being executed and display it verbatim above the response panel — for example:
>    ```bash
>    curl -X POST https://api.bankingapp.com/api/v1/payments \
>      -H "X-API-Key: sk_live_************************a8f2" \
>      -H "Content-Type: application/json" \
>      -H "X-Request-Id: <generated-uuid>" \
>      -d '{"amount": 100.00, "currency": "USD", "sourceAccount": "1001987654"}'
>    ```
>    This gives developers a copy-pasteable command for their own terminal/Postman/CI usage, matching the standard way API consumers actually validate integrations[web:106][web:96].
> 3. Implement `services/docs/apiTestRunner.ts` to actually execute this request — but route it through a new Next.js Route Handler (`app/api/proxy/gateway-test/route.ts`) rather than calling the backend directly from the browser, consistent with the BFF pattern already used for all other backend calls in this web app. This route handler forwards the developer's real API key and body to the real backend endpoint and returns the real response (status code, headers, body) — no mocked or simulated response data.
> 4. Display the real HTTP status code, response time, and response body in a result panel using the existing method-color convention (emerald for 2xx, amber for 4xx, rose for 5xx) already established for the GET/POST/PUT/DELETE badges.
> 5. Gate this "Try it" feature so it only targets `sk_test_...` sandbox-environment keys by default in production deployments of the web app, with an explicit confirmation step required before allowing a `sk_live_...` key to be used for a real test call — this prevents a developer from accidentally executing a live payment through a documentation page.

---

## Section 4 — New Feature: API Key Scopes & Least-Privilege Enforcement

**Target files:** `ApiKeyManager.tsx`, `ApiKey.java`, `ApiKeyAuthenticationFilter.java`, `ErrorCode.java`

**Prompt:**

> Currently a generated key has no concept of scope — any key can theoretically call any endpoint once whitelisting/validation from Sections 1-2 is in place. Add scoped permissions as an additive feature on top of the key model just built:
> 1. Add a `scopes: Set<String>` field to `ApiKey.java` (e.g. `payments:write`, `ledger:read`, `payroll:approve`), populated from a new multi-select checkbox group added to the existing key-generation form in `ApiKeyManager.tsx`, using the same 6 domain modules from `DomainLibrary.tsx` as the scope categories so the two components stay conceptually aligned.
> 2. Extend `ApiKeyAuthenticationFilter.java` to check the requested endpoint's required scope (a simple path-prefix-to-scope map is sufficient — do not build a full policy engine) against the authenticated key's granted scopes, rejecting with a new `ErrorCode.INSUFFICIENT_API_SCOPE` on mismatch, following the same enum convention used for `IP_NOT_WHITELISTED`.
> 3. Reflect granted scopes as small pill badges next to each key in the `ApiKeyManager.tsx` table, reusing the same badge styling already used for HTTP method tags in `DomainLibrary.tsx` so the visual language stays consistent across both components.

---

## Section 5 — New Feature: Key Rotation & Expiry (Currently Keys Never Expire)

**Target files:** `ApiKey.java`, new `ApiKeyRotationService.java`, `ApiKeyManager.tsx`, `V8__api_key_enforcement.sql` (from Section 1)

**Prompt:**

> Generated keys currently have no expiry and no rotation mechanism — once created, a key is valid forever until manually revoked. Add mandatory rotation hygiene as an additive feature:
> 1. Add `expiresAt` and `rotatedFromKeyId` (nullable, for audit lineage) fields to `ApiKey.java` and the `V8` migration from Section 1. Default new keys to a 90-day expiry, configurable per-environment (`LIVE` keys default 90 days, `SANDBOX` keys default 365 days) via `application.yml`, following the existing externalized-config pattern already used for other tunables in this codebase.
> 2. Implement `ApiKeyRotationService.java` exposing a `POST /api/v1/apikeys/{id}/rotate` endpoint that issues a new key inheriting the same scopes and CIDR whitelist as the old one, marks the old key `revoked_at` with a short grace period (e.g. 24 hours) rather than immediate hard revocation, to avoid breaking in-flight integrations — this mirrors the graceful-deprecation philosophy already documented in `legacy/README.md`.
> 3. In `ApiKeyManager.tsx`, surface a countdown/expiry badge on each key row (amber when within 14 days of expiry, rose when expired) and a "Rotate" button next to "Revoke," reusing the existing action-button row layout already present in the table.

---

## How to Use This Document

Feed one section at a time to your AI coding assistant, always preceded by the context block above. Section 1 and 2 are prerequisites for everything else — the curl testing feature in Section 3 depends on real, enforced keys existing first, and scopes/rotation in Sections 4-5 depend on the schema Section 1 introduces. Reject any response that mocks a backend call instead of wiring the real one; the entire point of this hardening pass is to remove every remaining piece of simulated behavior from a production banking gateway surface.
