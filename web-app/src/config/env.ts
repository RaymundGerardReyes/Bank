export const env = {
  backendApiBaseUrl: process.env.BACKEND_API_BASE_URL,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  sessionSecret: process.env.SESSION_SECRET,

  // --- ENTERPRISE SECURITY FIX ---
  // Target the specific sanitized group instead of the root global dump
  openApiSpecUrl: process.env.OPENAPI_SPEC_URL,

  enablePasskeyAuth: process.env.ENABLE_PASSKEY_AUTH !== "false",
  enableDevApiDocs: process.env.ENABLE_DEV_API_DOCS !== "false",
};