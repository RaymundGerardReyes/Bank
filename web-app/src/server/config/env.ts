import "server-only";
import { z } from "zod";

export const resolveBackendUrl = (url?: string): string => {
  if (!url) return "";
  let resolved = url;
  const isDockerContainer = process.env.RUNTIME_ENV === "docker";

  if (!isDockerContainer) {
    if (resolved.includes("://backend:8080")) {
      resolved = resolved.replace("://backend:8080", "://127.0.0.1:8086");
    } else if (resolved.includes("://backend:8086")) {
      resolved = resolved.replace("://backend:8086", "://127.0.0.1:8086");
    } else if (resolved.includes("://backend")) {
      resolved = resolved.replace("://backend", "://127.0.0.1:8086");
    }
  } else {
    if (resolved.includes("://backend:8086")) {
      resolved = resolved.replace("://backend:8086", "://backend:8080");
    }
  }
  return resolved;
};

export const resolveBackendOrigin = (url?: string): string => {
  const resolved = resolveBackendUrl(url);
  if (!resolved) return "";
  try {
    const parsedUrl = new URL(resolved);
    return `${parsedUrl.protocol}//${parsedUrl.host}`;
  } catch (e) {
    return resolved;
  }
};

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

const serverEnvSchema = z.object({
  BACKEND_API_BASE_URL: z.string().url().transform(resolveBackendOrigin),
  BACKEND_INTERNAL_URL: z.preprocess(emptyToUndefined, z.string().url().optional()).transform(resolveBackendOrigin),
  NEXT_PUBLIC_APP_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().default("http://localhost:3000")
  ),
  SESSION_SECRET: z.string().min(1),
  INTERNAL_BFF_API_KEY: z.string().min(1),
  NEXT_PUBLIC_WEBAUTHN_RP_ID: z.preprocess(
    emptyToUndefined,
    z.string().min(1).default(process.env.PLATFORM_DOMAIN || "localhost")
  ),
  OPENAPI_SPEC_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().default("http://127.0.0.1:8086/v3/api-docs")
  ).transform(resolveBackendUrl),
  ENABLE_PASSKEY_AUTH: z.string().optional().default("true"),
  ENABLE_DEV_API_DOCS: z.string().optional().default("true"),
  UPSTASH_REDIS_REST_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

const parsedEnv = serverEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  if (process.env.SKIP_ENV_VALIDATION === "1" || process.env.SKIP_ENV_VALIDATION === "true") {
    console.warn("⚠️ Skipping environment validation due to SKIP_ENV_VALIDATION flag");
  } else {
    console.error("❌ Invalid environment variables:", parsedEnv.error.format());
    throw new Error("Invalid server environment variables");
  }
}

// If validation is skipped, fall back to process.env to prevent runtime crashes when reading properties
const envData = parsedEnv.success ? parsedEnv.data : (process.env as any);

export const env = {
  backendApiBaseUrl: envData.BACKEND_API_BASE_URL as string,
  backendInternalUrl: envData.BACKEND_INTERNAL_URL as string | undefined,
  appUrl: envData.NEXT_PUBLIC_APP_URL as string,
  sessionSecret: envData.SESSION_SECRET as string,
  internalBffApiKey: envData.INTERNAL_BFF_API_KEY as string,
  rpId: envData.NEXT_PUBLIC_WEBAUTHN_RP_ID as string,
  openApiSpecUrl: envData.OPENAPI_SPEC_URL as string,
  enablePasskeyAuth: envData.ENABLE_PASSKEY_AUTH as string | undefined,
  enableDevApiDocs: envData.ENABLE_DEV_API_DOCS as string | undefined,
};
