export const env = {
  backendApiBaseUrl: process.env.BACKEND_API_BASE_URL || "http://localhost:8085/api/v1",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  sessionSecret: process.env.SESSION_SECRET || "default-dev-session-secret-must-be-changed-in-prod",
  openApiSpecUrl: process.env.OPENAPI_SPEC_URL || "http://localhost:8085/v3/api-docs",
  enablePasskeyAuth: process.env.ENABLE_PASSKEY_AUTH !== "false",
  enableDevApiDocs: process.env.ENABLE_DEV_API_DOCS !== "false",
};
