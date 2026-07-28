# Enterprise Banking Web App (Next.js 15 + TypeScript + Tailwind CSS)

## Overview
This web application is the enterprise web client for the Banking System. It integrates with the Spring Boot backend (`/api/v1`) using a Backend-for-Frontend (BFF) proxy model via Next.js Route Handlers.

## Architecture Highlights
- **Framework**: Next.js 15 (App Router, React Server Components by default)
- **Security**: httpOnly cookies for session management (no Bearer token in localStorage), CSRF protection, CSP headers, and `X-Request-Id` correlation propagation.
- **Form & Validation**: React Hook Form + Zod matching backend validation rules.
- **Idempotency**: Client-side UUID `Idempotency-Key` generation per money-moving action.
- **Developer Gateway**: `/developers` route rendering Scalar/Redoc OpenAPI contract for internal engineers and partners.

## Directory Structure (`src/`)
- `src/app`: App Router pages, layout, and Route Handlers (BFF layer).
- `src/components`: UI components grouped by feature (`accounts`, `transactions`, `security`, `docs`, `common`).
- `src/config`: Centralized environment and feature flag configs.
- `src/hooks`: Custom React hooks (`useAuth`, `useAccounts`, `useTransactions`, `useIdleTimeout`).
- `src/middleware.ts`: Route protection & session verification middleware.
- `src/models`: Shared TypeScript interfaces and contracts.
- `src/security`: Web security guards (RoleGuard, SessionGuard, CSP, rate limiter).
- `src/services`: Ports-and-adapters API clients and business services.
- `src/state`: Client state stores (Zustand) and TanStack Query client setup.
- `src/utils`: Formatting, validation, logging, and application constants.

## Setup & Running
```bash
# Install dependencies
pnpm install

# Run dev server
npm run dev
# or
pnpm dev

# Type check & lint
npm run type-check
npm run lint
```
