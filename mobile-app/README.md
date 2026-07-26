# Hardened React Native Mobile Banking Client (Android-First)

Production-grade, hardened mobile banking client written in React Native (TypeScript bare workflow) designed to align with the enterprise modular monolith Spring Boot backend.

## Architecture Highlights
- **Hexagonal Alignment**: Direct 1:1 mapping with backend REST API contracts (`/api/v1/auth`, `/accounts`, `/transfers`, `/transactions`, `/statements`, `/admin`, `/products`).
- **Security Hardening**:
  - Native Android `RootDetectionModule` & `ScreenshotBlockModule` (`FLAG_SECURE`).
  - Android Keystore token storage with `react-native-keychain`.
  - Android `BiometricPrompt` step-up verification for transfers and high-risk operations.
  - TLS Certificate Pinning against the Nginx Edge Gateway.
- **Resilient API Layer**: Axios interceptors automatically injecting `X-Request-Id` (correlation tracing), `Idempotency-Key` (UUID v4 for idempotency guard), and JWT Bearer headers.
- **State Management**: Redux Toolkit + RTK Query with automatic caching and offline balance views.
