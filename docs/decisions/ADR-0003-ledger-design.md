# ADR-0003: Immutable Double-Entry Ledger Design

## Context
A robust banking system needs to track monetary movements reliably without the risk of orphaned transactions, negative balance races, or duplicate charges. We need a way to store transactions such that they provide a perfect audit trail and can be replayed if necessary.

## Decision
We adopt an **Immutable Append-Only Ledger Design**.
- The `transactions` table tracks the absolute movement of money (Source, Destination, Amount, Status).
- Transactions are mapped with a unique `idempotencyKey` provided by the client, guarded by an indexed unique constraint at the database layer.
- `LedgerJpaAdapter` executes an O(1) `existsByIdempotencyKey()` check before processing.
- Spring `@Transactional` boundaries wrap the balance modification (e.g. subtracting from `Account.balance`) and the `Transaction` entity insert into a single atomic commit.

## Consequences
- **Positive**: Strict financial consistency; zero duplicate transactions; built-in audit history.
- **Negative**: The `transactions` table will grow indefinitely, requiring archiving and partition strategies in the future.
