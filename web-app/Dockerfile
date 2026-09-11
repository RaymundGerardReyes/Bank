# ============================================================
# 1. DEPENDENCIES STAGE
# ============================================================
FROM node:22-alpine AS deps
WORKDIR /src

# Copy package management files first for optimal layer caching
COPY package.json package-lock.json ./

# Cache npm downloads using BuildKit cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm install --legacy-peer-deps

# Strip the invalid 'v' prefix from Upstash package versions if present
RUN sed -i 's/"version": "v/"version": "/g' node_modules/@upstash/ratelimit/package.json 2>/dev/null || true
RUN sed -i 's/"version": "v/"version": "/g' node_modules/@upstash/core-analytics/package.json 2>/dev/null || true

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

ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_PLATFORM_DOMAIN
ARG NEXT_PUBLIC_WEBAUTHN_RP_ID

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_PLATFORM_DOMAIN=$NEXT_PUBLIC_PLATFORM_DOMAIN
ENV NEXT_PUBLIC_WEBAUTHN_RP_ID=$NEXT_PUBLIC_WEBAUTHN_RP_ID

# Skip strict Zod validation during the standalone build since secrets are injected at runtime
ENV SKIP_ENV_VALIDATION=1

# Use BuildKit cache for Next.js build cache (.next/cache)
RUN --mount=type=cache,target=/src/.next/cache \
    node scripts/clean.mjs && npx next build && mkdir -p /src/public

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
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/api/health || wget --quiet --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["npx", "next", "start"]
