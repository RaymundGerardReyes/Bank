# ADR-0002: Stateless JWT Authentication with MDC Request Tracing

## Context
The banking API requires secure, stateless authentication compatible with mobile clients, web applications, and gateway proxies.

## Decision
We utilize **HMAC-SHA256 Signed JSON Web Tokens (JWT)**.
- Authentication endpoints issue short-lived JWTs.
- `JwtAuthenticationFilter` validates tokens per request without database sessions.
- `CorrelationIdFilter` binds an `X-Request-Id` header to SLF4J `MDC` on every request.

## Consequences
- **Positive**: High horizontal scalability, stateless proxying at Nginx gateway.
- **Negative**: Token revocation requires a token blacklist service or short TTLs.
