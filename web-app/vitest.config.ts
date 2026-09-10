import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/tests/**/*.{test,spec}.{ts,tsx}', 'tests/unit/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', 'tests/e2e/**'],
    pool: 'forks',
    poolOptions: {
      forks: {
        maxForks: 2,
      },
    },
    env: {
      BACKEND_API_BASE_URL: 'http://localhost:8080/api/v1',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      SESSION_SECRET: 'test-secret-key-12345678901234567890',
      INTERNAL_BFF_API_KEY: 'test-bff-key',
      NEXT_PUBLIC_WEBAUTHN_RP_ID: 'localhost',
      OPENAPI_SPEC_URL: 'http://localhost:8080/v3/api-docs'
    }
  },
  resolve: {
    alias: {
      '@/app/(dashboard)': path.resolve(__dirname, './src/app/(portals)/(dashboard)'),
      '@': path.resolve(__dirname, './src'),
      'server-only': path.resolve(__dirname, './src/tests/mocks/empty.ts'),
    },
  },
});
