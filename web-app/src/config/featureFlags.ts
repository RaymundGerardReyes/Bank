import { env } from "./env";

export const featureFlags = {
  enablePasskey: env.enablePasskeyAuth,
  enableDevApiDocs: env.enableDevApiDocs,
  enableMfaRequired: true,
  enableAuditTrail: true,
};
