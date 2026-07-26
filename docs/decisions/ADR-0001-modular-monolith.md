# ADR-0001: Modular Monolith with Ports & Adapters (Hexagonal) Architecture

## Context
The banking platform requires high security, transactional consistency, auditability, and maintainability. While microservices offer scaling independence, they introduce network latency, distributed transaction complexities (Saga patterns), and operational overhead.

## Decision
We adopt a **Modular Monolith** pattern organized around explicit domain modules (`customer`, `account`, `transaction`, `statement`) with **Ports and Adapters (Hexagonal)** boundaries.

- **Inbound Ports (`application/port/in`)**: Define use-case interfaces.
- **Outbound Ports (`application/port/out`)**: Define domain interfaces for infrastructure dependencies (persistence, gateways).
- **Adapters (`infrastructure`)**: Contain Spring Data JPA repositories and external integration logic.

## Consequences
- **Positive**: Simplifies ACID transactions, reduces deployment complexity, ensures strict testability of domain logic without database or framework dependencies.
- **Negative**: Module boundaries must be strictly enforced during code review to prevent inter-module leakage.
