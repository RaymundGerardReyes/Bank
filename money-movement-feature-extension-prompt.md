# Engineering Prompt: Money Movement Feature Hardening & Extension

## Purpose of This Document

This is a **prompt engineering artifact** — a structured instruction set intended to be handed to an AI coding assistant (or a human engineer) working directly inside the existing codebase. It does **not** introduce new architecture or replace existing logic. Every instruction below targets a specific, already-implemented file and asks for **correction, hardening, or additive extension** only. Use this as the literal prompt when requesting changes from an AI pair-programmer, one section at a time, so review stays scoped and diff-able per component.

---

## Context to Paste Before Every Prompt Section

```text
You are working inside an existing production banking monorepo with three components:
backend/ (Spring Boot, hexagonal architecture, ports/adapters)
web-app/ (Next.js 16 App Router, TypeScript, Tailwind CSS)
mobile-app/ (React Native/Expo, TypeScript)

Do NOT invent new architectural patterns or rewrite files from scratch.
Only modify the specific files named below, preserving existing naming conventions,
folder structure, and design system tokens (colors.dominant/secondary/accent).
Every change must be additive or corrective — do not remove working logic
unless explicitly instructed. Explain each change as a diff-style summary,
not a full file rewrite, unless the file is short enough to show in full.
```

---

## Section 1 — Correct the Web/Mobile Parity Gap (Transfer Flow)

**Target files:** `web-app/src/app/(dashboard)/transfers/page.tsx`, `mobile-app/src/screens/transfers/TransferFormScreen.tsx`, `TransferReviewScreen.tsx`, `TransferConfirmScreen.tsx`

**Prompt:**

> The web app currently executes internal transfers as a single-step form (`transfers/page.tsx`) calling `transactionService.transferInternal()` directly on submit, with no review step and no idempotency-key generation visible in the flow. The mobile app uses a hardened 3-step wizard (Form → Review → Confirm) with `idempotencyKeyService.getOrCreateKey()` generated at Step 1 and a biometric step-up gate at Step 3 before calling the same backend endpoint.
>
> Correct the web transfer flow to match the mobile app's security posture without copying mobile's UI pattern verbatim:
> 1. Refactor `transfers/page.tsx` into three route segments — `transfers/page.tsx` (form), `transfers/review/page.tsx`, `transfers/confirm/page.tsx` — matching the tree already scaffolded in `web-app-structure-3.md`.
> 2. In the form step, call the web equivalent of `idempotencyKeyService.getOrCreateKey()` (create `services/transaction/idempotencyKeyService.ts` if it does not yet contain this method) and pass the key forward via router state or a short-lived server session, not a URL query param.
> 3. In the review step, render the same "Trace Ref" pattern used in `TransferReviewScreen.tsx` (`idempotencyKey.split('-')[0]`) so support staff can cross-reference a transaction across web and mobile using the same convention.
> 4. In the confirm step, gate the final `transactionService.transferInternal()` call behind a WebAuthn/passkey step-up prompt (per the existing `services/auth/passkeyService.ts` stub), mirroring mobile's `useBiometric().authenticate()` gate — this is the web-appropriate equivalent, not a literal port of BiometricPrompt.
> 5. Preserve the existing inline alert banner styling (`bg-emerald-500/10` success, `bg-rose-500/10` error) already used in the current single-step form — carry it forward into the new confirm step rather than redesigning it.

---

## Section 2 — Add Missing Money-Movement Screens to Web (Feature Parity)

**Target files:** `web-app/src/app/(dashboard)/transactions/deposit/page.tsx`, `withdraw/page.tsx`, `external-payment/page.tsx` (currently scaffolded empty per `web-app-structure-3.md`)

**Prompt:**

> The mobile app has three dedicated money-movement screens with distinct behavior — `DepositScreen.tsx` (wrapped in `SecureScreenWrapper`, generates a fresh UUID per attempt), `WithdrawScreen.tsx` (simple capture + immediate idempotency key), and `ExternalPaymentScreen.tsx` (9-digit routing number validation, recipient name field, structured error extraction from `error?.response?.data?.message`). The web app currently has empty placeholder files for these three flows.
>
> Implement these three web pages by adapting the *existing mobile logic*, not inventing new validation rules:
> 1. `transactions/deposit/page.tsx`: reuse the same idempotency-key-per-attempt pattern from `DepositScreen.tsx`, adapted to call the web's `idempotencyKeyService`. Since `SecureScreenWrapper` (screenshot blocking) has no browser equivalent, substitute it with the existing web-only mitigation already documented in the web architecture — masked balance display and a short idle-session timeout — rather than omitting a security control entirely.
> 2. `transactions/withdraw/page.tsx`: port the same account/amount capture and loading-indicator pattern from `WithdrawScreen.tsx` directly, keeping field names (`sourceAccountNumber`, `amount`) identical to the backend `WithdrawRequest.java` DTO so no request-mapping drift occurs between platforms.
> 3. `transactions/external-payment/page.tsx`: port the exact validation rule from `ExternalPaymentScreen.tsx` for the 9-digit routing number and recipient name field, and reuse the same structured error-extraction logic (`error?.response?.data?.message`) inside the web's `errorInterceptor.ts` instead of re-implementing it inline in the component.

---

## Section 3 — New Feature: Shared Transaction Trace Lookup (Cross-Platform Support Tool)

**Target files (new, additive only):** `backend/src/main/java/com/company/banking/transaction/api/TransactionController.java`, `backend/.../application/port/in/TransactionUseCase.java`, `web-app/src/app/(admin)/audit/page.tsx`

**Prompt:**

> Both platforms already render a truncated idempotency-key "Trace Ref" during transfer review, but there is currently no backend endpoint or admin UI to look up a full transaction record by that trace reference. Add this as a new, additive capability without touching existing transfer/deposit/withdraw logic:
> 1. Add a new method to the existing `TransactionUseCase.java` port interface: `TransactionResponse getByIdempotencyKey(String idempotencyKeyPrefix)` — do not modify existing methods in this interface.
> 2. Add a corresponding new endpoint `GET /api/v1/transactions/trace/{keyPrefix}` in the existing `TransactionController.java`, reusing the existing `ApiResponse<T>` envelope and `ResponseSanitizerAdvice` masking already applied to other endpoints in this controller.
> 3. Restrict this endpoint to `ROLE_ADMIN` and `ROLE_TELLER` via the existing `AccessPolicy.java`, consistent with how `AdminAuditController.java` is already gated.
> 4. On the web side, extend the existing `(admin)/audit/page.tsx` (already scaffolded) with a search input that calls this new endpoint and displays the matched transaction using the existing `TransactionListItem`-equivalent web component, so support staff can resolve a customer's "Trace Ref abc123" complaint without touching the database directly.

---

## Section 4 — New Feature: Transfer Limits & Velocity Checks (Fraud Hardening)

**Target files:** `backend/.../transaction/domain/TransferPolicy.java`, `SufficientFundsPolicy.java`, `backend/.../transaction/application/InternalTransferService.java`

**Prompt:**

> The existing `TransferPolicy.java` and `SufficientFundsPolicy.java` currently validate balance sufficiency but do not enforce per-transaction or daily cumulative transfer limits. Add velocity/limit checks as new policy logic without altering the existing balance-check flow:
> 1. Add a new method `validateVelocity(Account sourceAccount, Money amount, List<Transaction> todaysTransactions)` to `TransferPolicy.java`, called from `InternalTransferService.java` immediately after the existing `SufficientFundsPolicy` check — do not reorder or remove the existing funds check.
> 2. Enforce limits already implied by the existing `AccountLimit.java` domain object (confirm its current fields before adding new ones — extend rather than duplicate).
> 3. On breach, throw the existing `BusinessException` with a new `ErrorCode` entry (e.g., `TRANSFER_VELOCITY_EXCEEDED`) added to the existing `ErrorCode.java` enum, following its current naming convention exactly.
> 4. Surface this new error code on both frontends through the *existing* error-mapping logic already used for other `BusinessException` cases (web's `errorInterceptor.ts`, mobile's `error?.response?.data?.message` extraction pattern in `ExternalPaymentScreen.tsx`) — do not build a new error-display mechanism.

---

## Section 5 — New Feature: Scheduled/Future-Dated Transfers

**Target files (additive):** `backend/.../transaction/domain/Transaction.java`, `TransactionStatus.java`, new `ScheduledTransferService.java`; `web-app` transfers form; `mobile-app` `TransferFormScreen.tsx`

**Prompt:**

> Introduce future-dated internal transfers as a new capability layered on top of the existing transfer pipeline, reusing the existing idempotency and review/confirm pattern rather than creating a parallel flow:
> 1. Add a new `SCHEDULED` value to the existing `TransactionStatus.java` enum, alongside current statuses — do not rename existing values.
> 2. Add an optional `scheduledDate` field to the existing `InternalTransferRequest.java` DTO (nullable, defaulting to immediate execution when absent) so the current immediate-transfer contract remains fully backward-compatible for existing frontend calls that don't send this field.
> 3. Add a new `ScheduledTransferService.java` alongside the existing `InternalTransferService.java` in the same `application` package, following the same use-case/port pattern already established — this service only handles the deferred-execution branch; the existing immediate-transfer logic in `InternalTransferService.java` stays untouched.
> 4. On both frontends, add an optional date picker to the *existing* transfer form (`TransferFormScreen.tsx` on mobile, the new multi-step web form from Section 1) — when a date is selected, pass `scheduledDate` through the same review/confirm steps already built, showing "Scheduled for {date}" instead of "Submitting..." in the confirm step's pending state.

---

## Section 6 — New Feature: In-App Transaction Dispute Flagging

**Target files (additive):** `backend/.../transaction/api/TransactionController.java`, new `DisputeTransactionService.java`; mobile `TransactionDetailScreen.tsx`; web transaction history page

**Prompt:**

> Add a lightweight dispute-flagging capability so customers can flag a completed transaction for review, without building a full case-management system:
> 1. Add `POST /api/v1/transactions/{id}/dispute` to the existing `TransactionController.java`, accepting a `DisputeReasonRequest` DTO (new, small DTO: `reasonCode`, `notes`) and delegating to a new `DisputeTransactionService.java` that sets a new boolean/enum flag on the existing `Transaction` domain object (add the field, don't restructure the class).
> 2. Emit an existing-style `AuditEvent` via the current `AuditEventPublisher.java` so disputes are visible in the existing admin audit trail without a separate dispute-audit mechanism.
> 3. On mobile, add a "Flag this transaction" action to the existing `TransactionDetailScreen.tsx`, using the same button styling already defined in `theme/colors.ts` (`colors.accent` for the action button).
> 4. On web, add the equivalent action to the transaction history list item component, reusing the existing `ErrorBanner`/success-alert pattern from the transfers page for confirmation feedback.

---

## How to Use This Document

Feed one section at a time to your AI coding assistant, always preceded by the context block at the top of this document. Reject any response that rewrites a file wholesale when a targeted diff was requested — the entire point of this prompt structure is traceable, reviewable, additive change against a banking codebase where every modification needs an audit-friendly rationale, consistent with the ADR discipline already established in `docs/decisions/`.
