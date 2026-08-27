
# .env
# ==============================================================================
# HARDENED BANKING PLATFORM — Centralized .env
# Single source of truth for ALL services:
#   backend | web-app | ExpoBankingApp | infra
#
# All services load this file via:  dotenvx run --env-file=../.env
# DO NOT create per-app .env files. Edit only this file.
# NOTE: Host-facing port values in this file must align with PORT_REGISTRY.md.
# ==============================================================================

NODE_ENV=Production


COMPOSE_PROJECT_NAME=banking

# ── DATABASE (PostgreSQL via Docker) ───────────────────────────────────────────
DB_HOST=database
DB_PORT=5435
DB_NAME=banking
DB_USER=p************res
DB_PASSWORD=po**********rd

# ── SPRING BOOT BACKEND ────────────────────────────────────────────────────────
SPRING_PROFILES_ACTIVE=prod
PORT=8086
JWT_SECRET=DbgW1***************WQ=
JWT_EXPIRATION_MS=86400000

# ── MAIL (Google SMTP) ─────────────────────────────────────────────────────────
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=paymon******************@gmail.com
MAIL_PASSWORD=ag******************bf

# ── WEB APP (Next.js) ──────────────────────────────────────────────────────────
BACKEND_API_BASE_URL=http://backend:8080
NEXT_PUBLIC_APP_URL=http://localhost:8080
SESSION_SECRET=1if0+******************************Tc=
OPENAPI_SPEC_URL=https://api.novabank.ph/v3/api-docs/developer-gateway
ENABLE_PASSKEY_AUTH=true
ENABLE_DEV_API_DOCS=false
INTERNAL_BFF_API_KEY=WQh**************=
NEXT_PUBLIC_WEBAUTHN_RP_ID=novabank.ph

# ── MOBILE APP (Expo / React Native) ──────────────────────────────────────────
EXPO_PUBLIC_API_BASE_URL=http://api.novabank.ph/api/v1
EXPO_PUBLIC_GATEWAY_URL=http://api.novabank.ph/api/v1
EXPO_PUBLIC_CERTIFICATE_PIN_HASH=sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
EXPO_PUBLIC_AUTO_LOCK_TIMEOUT_MS=300000
EXPO_PUBLIC_ENABLE_SECURE_SCREEN=true
EXPO_PUBLIC_ENABLE_ROOT_DETECTION=true

# ── INFRA (Nginx / Docker upstream) ───────────────────────────────────────────
NGINX_HTTP_PORT=8080
NGINX_SSL_PORT=443
DB_HOST_PORT=5435
WEB_APP_DEBUG_PORT=3001
BACKEND_UPSTREAM_HOST=localhost
BACKEND_UPSTREAM_PORT=8080


# ==============================================================================
# WEB APP — .env.production
# Secrets MUST be encrypted via: dotenvx encrypt --env-file=.env.production
# ==============================================================================

# ------------------------------------------
# ------------------------------------------
# PLATFORM EDGE & ROUTING
# ------------------------------------------
PLATFORM_DOMAIN=novabank.ph
RUNTIME_ENV=docker
# ------------------------------------------
# CLOUDFLARE EDGE
# ------------------------------------------
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjo********************J9



# ==============================================================================
# PHASE A: CONFIGURATION CONTRACTS
# ==============================================================================

# PUBLIC CONTRACTS
UI_PUBLIC_URL=https://novabank.ph
UI_PUBLIC_HOST=novabank.ph
API_PUBLIC_URL=https://api.novabank.ph
API_PUBLIC_HOST=api.novabank.ph
PAYMENT_WEBHOOK_PUBLIC_URL=https://pay.novabank.ph
PAYMENT_WEBHOOK_HOST=pay.novabank.ph

# INTERNAL CONTRACTS
BACKEND_INTERNAL_URL=http://backend:8080
FRONTEND_PUBLIC_ORIGIN=https://novabank.ph