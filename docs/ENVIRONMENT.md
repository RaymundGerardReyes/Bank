# 🔐 Centralized Environment Management — `dotenvx`

This monorepo uses **[dotenvx](https://dotenvx.com/)** as the single source of truth for all environment variables across all four services. dotenvx replaces ad-hoc `.env` files with a structured, encrypted, multi-environment system.

---

## Architecture Overview

```
d:/Java/Bank/                        ← Root shared .env (documentation + shared base)
├── .env                             ← Shared base (gitignored)
├── .env.keys                        ← Encrypted key store (safe to commit)
│
├── backend/
│   ├── .env                         ← Dev: DB + JWT + Spring config
│   ├── .env.staging                 ← Staging overrides
│   ├── .env.production              ← Production (encrypted with dotenvx)
│   ├── .env.example                 ← Committed template
│   └── dev.bat                      ← Windows launcher with dotenvx
│
├── web-app/
│   ├── .env.local                   ← Dev: Next.js, BFF URLs, session secret
│   ├── .env.staging
│   ├── .env.production              ← Encrypted
│   └── .env.example                 ← Committed template
│
├── ExpoBankingApp/
│   ├── .env                         ← Dev: Expo public vars
│   ├── .env.staging
│   ├── .env.production              ← Encrypted
│
├── infra/
│   └── .env                         ← Nginx + Docker upstream config
│
└── scripts/
    └── check-env.mjs               ← Validates all required vars before start
```

---

## Variable Map

| Variable | Backend | Web App | Mobile | Infra |
|---|---|---|---|---|
| `DB_HOST` | ✅ | | | ✅ |
| `DB_PORT` | ✅ | | | |
| `DB_NAME` | ✅ | | | ✅ |
| `DB_USER` | ✅ | | | ✅ |
| `DB_PASSWORD` | ✅ | | | ✅ |
| `JWT_SECRET` | ✅ | | | |
| `JWT_EXPIRATION_MS` | ✅ | | | |
| `SPRING_PROFILES_ACTIVE` | ✅ | | | ✅ |
| `PORT` | ✅ | | | |
| `BACKEND_API_BASE_URL` | | ✅ | | |
| `NEXT_PUBLIC_APP_URL` | | ✅ | | |
| `SESSION_SECRET` | | ✅ | | |
| `OPENAPI_SPEC_URL` | | ✅ | | |
| `ENABLE_PASSKEY_AUTH` | | ✅ | | |
| `ENABLE_DEV_API_DOCS` | | ✅ | | |
| `EXPO_PUBLIC_API_BASE_URL` | | | ✅ | |
| `EXPO_PUBLIC_GATEWAY_URL` | | | ✅ | |
| `EXPO_PUBLIC_CERTIFICATE_PIN_HASH` | | | ✅ | |
| `EXPO_PUBLIC_AUTO_LOCK_TIMEOUT_MS` | | | ✅ | |
| `EXPO_PUBLIC_ENABLE_SECURE_SCREEN` | | | ✅ | |
| `EXPO_PUBLIC_ENABLE_ROOT_DETECTION` | | | ✅ | |
| `NGINX_PORT` | | | | ✅ |
| `NGINX_SSL_PORT` | | | | ✅ |
| `BACKEND_UPSTREAM_HOST` | | | | ✅ |
| `BACKEND_UPSTREAM_PORT` | | | | ✅ |

---

## 1. Installation

Install dotenvx globally once:

```bash
npm install -g @dotenvx/dotenvx
```

Or install it per-project (already in `devDependencies` for web-app and Expo):

```bash
cd web-app && npm install
cd ../ExpoBankingApp && npm install
```

---

## 2. First-Time Setup

```bash
# 1. Copy example files for each service
cp backend/.env.example backend/.env
cp web-app/.env.example web-app/.env.local

# 2. Validate all required vars are present
node scripts/check-env.mjs

# 3. Start the database first
cd backend && docker-compose up -d postgres && cd ..
```

---

## 3. Running Services (Development)

### Backend (Spring Boot)
```bash
cd backend

# Windows
dev.bat

# Or directly
dotenvx run --env-file=.env -- ./gradlew.bat bootRun
```

### Web App (Next.js)
```bash
cd web-app
npm run dev
# Internally: dotenvx run --env-file=.env.local -- next dev
```

### Mobile App (Expo)
```bash
cd ExpoBankingApp
npm run start
# Internally: dotenvx run --env-file=.env -- npx expo start
```

### All at Once (from root)
```bash
npm run dev
```

---

## 4. Running Services (Staging)

```bash
cd web-app && npm run dev:staging
cd backend && dev.bat staging
cd ExpoBankingApp && npm run start:staging
```

---

## 5. Encrypting Production Secrets

dotenvx encrypts your production env files so they can be safely committed to version control:

```bash
# Encrypt each service's .env.production
npm run encrypt:all

# Or individually
dotenvx encrypt --env-file=backend/.env.production
dotenvx encrypt --env-file=web-app/.env.production
dotenvx encrypt --env-file=ExpoBankingApp/.env.production
```

After encryption:
- `.env.production` values are encrypted ciphertext
- `.env.keys` contains the DOTENVX_KEY — **commit this file** (it's already allowed in `.gitignore`)
- Set `DOTENVX_KEY` as a CI/CD environment secret in GitHub Actions / Docker / Kubernetes

---

## 6. Git Safety Rules

| File | Committed? |
|---|---|
| `.env` | ❌ Blocked |
| `.env.local` | ❌ Blocked |
| `.env.staging` | ❌ Blocked |
| `.env.production` (before encrypt) | ❌ Blocked |
| `.env.production` (after dotenvx encrypt) | ✅ Safe to commit |
| `.env.example` | ✅ Always committed |
| `.env.keys` | ✅ Committed (encrypted key file) |

---

## 7. CI/CD Integration

In your GitHub Actions workflow, set these secrets in repository settings:

```yaml
# .github/workflows/deploy.yml
- name: Run with encrypted env
  env:
    DOTENVX_KEY: ${{ secrets.DOTENVX_KEY }}
  run: dotenvx run --env-file=backend/.env.production -- ./gradlew bootRun
```
