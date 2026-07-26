# Hardened Banking Backend

## Architecture
This project follows a strict **Modular Monolith** architecture utilizing the **Ports and Adapters (Hexagonal)** pattern.

### Key Modules:
- `customer`: Customer profile and authentication state.
- `account`: Core checking and savings accounts.
- `transaction`: Ledger entries, idempotency guards, and payment processing.
- `statement`: PDF statement generation.
- `security`: JWT validation, OTP Multi-Factor Authentication, and Rate Limiting.

## Getting Started

1. Copy `.env.example` to `.env` and fill in the required values.
2. Ensure you have Docker and Docker Compose installed.
3. Run the local development environment:
   ```bash
   cd ../scripts
   ./run-local.sh
   ```

## Design Decisions
See the `docs/decisions/` directory for detailed Architectural Decision Records (ADRs).
