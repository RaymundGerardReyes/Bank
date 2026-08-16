# syntax=docker/dockerfile:1

# ============================================================
# 1. DEPENDENCIES STAGE
# ============================================================
FROM node:22-alpine AS deps
WORKDIR /src

# Copy package management files first for optimal layer caching
COPY package.json package-lock.json ./

# CHANGED: Replaced strict 'npm ci' with 'npm install' to gracefully handle 
# the picomatch and WebAssembly peer dependency tree resolutions.
RUN npm install --legacy-peer-deps

# ============================================================
# 2. BUILD STAGE
# ============================================================
FROM node:22-alpine AS builder
WORKDIR /src

# Copy cached node_modules from deps stage
COPY --from=deps /src/node_modules ./node_modules
COPY . .

# Inject environment variables necessary for the Next.js build process
ENV NEXT_TELEMETRY_DISABLED=1

ARG BACKEND_API_BASE_URL
ARG NEXT_PUBLIC_APP_URL
ARG OPENAPI_SPEC_URL
ARG SESSION_SECRET
ARG ENABLE_PASSKEY_AUTH
ARG ENABLE_DEV_API_DOCS

ENV BACKEND_API_BASE_URL=$BACKEND_API_BASE_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV OPENAPI_SPEC_URL=$OPENAPI_SPEC_URL
ENV SESSION_SECRET=$SESSION_SECRET
ENV ENABLE_PASSKEY_AUTH=$ENABLE_PASSKEY_AUTH
ENV ENABLE_DEV_API_DOCS=$ENABLE_DEV_API_DOCS

RUN node scripts/clean.mjs && npx next build && mkdir -p /src/public

# ============================================================
# 3. RUNTIME STAGE
# ============================================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user specifically for running the web application
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

# Copy over only the necessary artifacts from the build stage
COPY --from=builder /src/public ./public
COPY --from=builder --chown=nextjs:nodejs /src/.next ./.next
COPY --from=builder /src/node_modules ./node_modules
COPY --from=builder /src/package.json ./package.json
COPY --from=builder /src/next.config.ts ./next.config.ts   
# Switch to the secure non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Note: The healthcheck is orchestrated by compose.yaml, but this provides a fallback
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["npx", "next", "start"]
