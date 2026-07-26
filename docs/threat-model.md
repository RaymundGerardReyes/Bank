# Threat Model

## 1. Authentication Threats
- **Brute Force**: Mitigated by `LoginAttemptService` tracking IP failures.
- **JWT Theft**: Mitigated by stateless `TokenBlacklistService` and `Strict-Transport-Security` headers.

## 2. Transaction Threats
- **Replay Attacks**: Mitigated by `IdempotencyGuardService` checking unique `idempotencyKey` strings in the O(1) PostgreSQL `transactions` table.
- **Negative Balances**: Mitigated by `@Transactional` isolation and `SufficientFundsPolicy` executed inside the atomic lock.

## 3. Infrastructure Threats
- **DDoS**: Mitigated by Nginx edge limit of 10 requests per second per IP and `RateLimitFilter` in the web tier.
