# Comprehensive Architecture Assessment & Refactoring Roadmap

## 1. Architecture Assessment

**Architecture Rating: 6.5 / 10**

- **Security:** 7/10 *(Recent Dockerfile fixes removed secret ARGs, but some client boundaries still require validation)*
- **Maintainability:** 5/10 *(Business logic is fragmented across technical folders)*
- **Type Safety:** 8/10 *(Zod and strict TS are well utilized; Phase 2 removed `any` from WebAuthn flows)*
- **Next.js Architecture:** 6/10 *(Good App Router usage, but `/api/proxy` is heavily overloaded and redundant)*
- **React Architecture:** 7/10 *(Good state management, but some forms suffer from God Component syndrome)*
- **Configuration Management:** 9/10 *(Successfully migrated to strict `server-only` Zod boundary)*
- **API Architecture:** 6/10 *(The BFF proxy pattern is implemented, but explicitly proxying 40+ routes manually is a maintenance nightmare)*
- **Testing:** 8/10 *(Vitest and Playwright configured well)*
- **Scalability:** 7/10 *(Solid containerized foundation, stateless Redis rate limiting added)*

**Overall Condition:**
The codebase has excellent foundational choices (Next.js 15+, React 19, Tailwind 4, Zod), but it is suffering from a "Layered Architecture" hangover. Code is organized by technical concern (e.g., `src/hooks`, `src/services`, `src/models`) rather than business capability. The recent security patches resolved the most critical issues, but the repository now requires aggressive Domain-Driven Feature Slicing and API proxy consolidation.

---

## 2. Current Architecture Map

```text
src/
├── app/
│   ├── (portals)/           <-- Excellent use of route groups
│   ├── (public)/
│   └── api/proxy/           <-- Overloaded: 40+ explicit pass-through routes
│        ├── accounts/
│        ├── auth/
│        └── [...path]/      <-- Generic catch-all exists but is underutilized
│
├── components/
│   ├── features/            <-- Components are sliced, but logic is not
│   ├── layout/
│   └── ui/
│
├── hooks/                   <-- Global technical grouping (Anti-pattern)
├── models/                  <-- Global technical grouping (Anti-pattern)
├── services/                <-- Global technical grouping (Anti-pattern)
│
└── server/
    └── config/              <-- Clean, strict boundary established
```

---

## 3. Target Architecture

```text
src/
├── app/                     # Strictly Routing & Layout Composition
│   ├── (portals)/
│   ├── (public)/
│   └── api/proxy/
│       └── [...path]/       # Single catch-all BFF Proxy
│
├── features/                # Vertical Business Domains (Screaming Architecture)
│   ├── accounts/
│   │   ├── api/             # API clients (Moved from src/services/)
│   │   ├── components/      # UI (Moved from src/components/features/)
│   │   ├── hooks/           # React Query (Moved from src/hooks/)
│   │   └── types.ts         # Models (Moved from src/models/)
│   ├── auth/
│   ├── checkout/
│   └── transactions/
│
├── components/              # Strictly Globally Reusable UI
│   ├── ui/                  # Buttons, Inputs, Cards
│   └── layout/              # Global nav, wrappers
│
├── server/                  # Server-Only logic & Config
│   └── config/
│
└── lib/                     # Shared utilities
    ├── utils/
    └── constants/
```

**Why move?**
When a developer needs to modify how a "Transaction" works, they currently have to jump between `/hooks`, `/services`, `/models`, and `/components`. By consolidating these into `src/features/transactions/`, the domain becomes independently maintainable and testable.

---

## 4. Critical Security Findings

*   **Resolved:** Hardcoded secrets in `Dockerfile` ARGs were eliminated in Phase 1.
*   **Resolved:** Missing `server-only` boundaries were fixed, preventing secret leakage into Client Components.
*   **Current Risk:** Passkey Dev-mode bypass (`handleSimulate()`). The logic strictly checks `isLocalDev`, but mock functions should ideally be stripped from production bundles entirely using bundler flags or dynamic imports.

---

## 5. Configuration/Environment Findings

*   **Resolved:** Migration to `src/server/config/env.ts` with Zod validation was successful.
*   **Best Practice:** `SKIP_ENV_VALIDATION=1` was correctly introduced into the Dockerfile to prevent Next.js build-time static evaluation crashes.

---

## 6. Next.js Findings

*   **API Proxy Redundancy:** You have explicitly defined routes for `/api/proxy/accounts`, `/api/proxy/auth`, `/api/proxy/transactions`, etc. However, you *also* have a catch-all `[...path]/route.ts`. The explicit routes that do nothing but forward requests should be deleted, relying entirely on the catch-all.
*   **Middleware:** Rate limiting and JWT extraction is now correctly executed at the Edge.

---

## 7. React Findings

*   **God Components:** Forms like `PasskeyAuthorization.tsx` mix UI rendering, state, interval polling (`pollMobileApproval`), API calling, and business logic. These should be decoupled using Custom Hooks (`usePasskeyAuthorization()`).
*   **Client Boundaries:** Some top-level layouts were using `"use client"` unnecessarily (resolved in earlier refactoring).

---

## 8. TypeScript Findings

*   **Strict WebAuthn Types:** Replaced dangerous `any` usage in `transactionService.ts` with strict `@simplewebauthn/types`.
*   **Safe Unknowns:** `unknown` is correctly used as an intermediate step to force runtime type validation before operating on payloads.

---

## 9. API/Backend Integration Findings

*   **BFF Proxy:** The integration is secure (`X-Internal-BFF-Key`), but the repetition of `apiFetch` and `fetch` across the 40+ proxy routes violates DRY.

---

## 10. Dependency/Coupling Findings

*   The Next.js `app/` router pages are tightly coupled to low-level `services/` instead of consuming well-defined `features/` modules.

---

## 11. File-by-File Refactoring Plan (Next Phase)

```text
CURRENT:
src/app/api/proxy/accounts/route.ts
src/app/api/proxy/statements/route.ts
(and 35 other static proxies)

MOVE TO:
[DELETE]

REASON:
These are pure pass-throughs. The generic `src/app/api/proxy/[...path]/route.ts` already handles forwarding, attaching the BFF key, and resolving the backend URL.

DEPENDENCIES AFFECTED:
Any frontend `httpClient` call expecting a specific route. (No change required if the catch-all perfectly mirrors the backend paths).

RISK:
MEDIUM (Requires careful testing of HTTP methods and payloads).
```

---

## 12. Before/After Code for Key Issues

### Problem: Redundant API Proxy Definitions

**Before:**
```typescript
// src/app/api/proxy/accounts/route.ts
import { env } from "@/server/config/env";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${env.backendApiBaseUrl}/accounts`, {
      headers: { "X-Internal-BFF-Key": env.internalBffApiKey },
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

**After:**
*(Delete the file entirely)*

**Why:** The existing `src/app/api/proxy/[...path]/route.ts` automatically catches `/api/proxy/accounts` and forwards it to `${env.backendApiBaseUrl}/accounts` with the correct BFF headers. Explicit files are only needed if you are modifying the payload or parsing secure cookies (e.g., `/auth/login`).

---

## 13. Recommended Project Structure

*(See Section 3: Target Architecture)*

---

## 14. `.env.example` Recommendation

Already successfully implemented:

```env
# ==========================================
# SERVER-ONLY VARIABLES (Never exposed to Browser)
# ==========================================
SESSION_SECRET=
INTERNAL_BFF_API_KEY=
BACKEND_API_BASE_URL=
BACKEND_INTERNAL_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ==========================================
# PUBLIC VARIABLES (Safe for Browser via NEXT_PUBLIC_)
# ==========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PLATFORM_DOMAIN=localhost
NEXT_PUBLIC_WEBAUTHN_RP_ID=localhost
ENABLE_PASSKEY_AUTH=true
ENABLE_DEV_API_DOCS=false
```

---

## 15. `.gitignore` Recommendation

Ensure these exist:
```text
.env
.env.local
.env.development
.env.production
!.env.example
```

---

## 16. Testing Recommendations

*   Add Vitest coverage for `src/server/config/env.ts` to ensure validation fails correctly.
*   Write Playwright E2E tests for the `PasskeyAuthorization` fallback flow, intercepting the WebAuthn API to simulate rejection.

---

## 17. Prioritized Refactoring Roadmap

### ✅ Phase 1 — Security
*   Completed Dockerfile ARG removal and Zod Server-Only isolation.

### 🚀 Phase 2 — API Consolidation (Recommended Next Step)
*   Audit `src/app/api/proxy/`. Delete the 40+ explicit routes that just blindly forward traffic, relying on the `[...path]/route.ts` catch-all.

### 📦 Phase 3 — Domain Slicing
*   Create `src/features/`. Move components, hooks, services, and models into their respective vertical domains.

### ⚛️ Phase 4 — React / Next.js
*   Extract complex logic out of God Components like `PasskeyAuthorization.tsx` into custom feature hooks.

---

## 18. Final Architecture Summary

The `banking-web-app` has an incredibly solid technological stack. You are using the absolute best modern tools available (App Router, Tailwind 4, Zod, React 19). The only thing holding it back from being a true enterprise architecture is its adherence to horizontal layer-based folders rather than vertical feature-based slices, and its overly verbose API proxy layer.

By executing Phase 2 and Phase 3, this application will achieve a 9.5/10 maintainability rating, capable of scaling to hundreds of developers safely.
