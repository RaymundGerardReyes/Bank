// scripts/check-env.mjs
// Run via: node scripts/check-env.mjs
// Validates ALL required vars from the single root .env before starting any service.

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const ENV_FILE = resolve(ROOT, '.env');

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const content = readFileSync(filePath, 'utf-8');
  const vars = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    vars[key.trim()] = rest.join('=').trim();
  }
  return vars;
}

const REQUIRED = {
  '🟦  Backend':       ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET', 'JWT_EXPIRATION_MS', 'SPRING_PROFILES_ACTIVE', 'PORT'],
  '🟩  Web App':       ['BACKEND_API_BASE_URL', 'NEXT_PUBLIC_APP_URL', 'SESSION_SECRET', 'OPENAPI_SPEC_URL'],
  '🟨  Mobile (Expo)': ['EXPO_PUBLIC_API_BASE_URL', 'EXPO_PUBLIC_GATEWAY_URL', 'EXPO_PUBLIC_CERTIFICATE_PIN_HASH', 'EXPO_PUBLIC_AUTO_LOCK_TIMEOUT_MS'],
  '🟧  Infra':         ['NGINX_PORT', 'BACKEND_UPSTREAM_HOST', 'BACKEND_UPSTREAM_PORT'],
};

if (!existsSync(ENV_FILE)) {
  console.error(`\n⛔  Root .env not found at: ${ENV_FILE}`);
  console.error('    This is the single source of truth for ALL services.');
  console.error('    It is gitignored — you must create it manually on each machine.\n');
  process.exit(1);
}

console.log(`\n📄  Loading: ${ENV_FILE}\n`);
const vars = parseEnvFile(ENV_FILE);

let hasError = false;
for (const [service, required] of Object.entries(REQUIRED)) {
  const missing = required.filter((k) => !vars[k]);
  if (missing.length > 0) {
    console.error(`${service}  ❌  Missing:`);
    for (const m of missing) console.error(`       - ${m}`);
    hasError = true;
  } else {
    console.log(`${service}  ✅  OK (${required.length} vars)`);
  }
}

if (hasError) {
  console.error('\n⛔  Fix the missing vars in d:/Java/Bank/.env before starting services.\n');
  process.exit(1);
} else {
  console.log('\n✅  All environment checks passed! Safe to start services.\n');
}
