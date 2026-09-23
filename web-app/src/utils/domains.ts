/**
 * Domain Derivation and Canonical URL Utilities
 * 
 * Provides centralized root domain derivation and API base URL construction,
 * eliminating duplicate domain declarations and guaranteeing that nested
 * subdomains (e.g., api.pay.mundbank.ph) are never generated.
 */

/**
 * Resolves the root apex domain (e.g. from PLATFORM_DOMAIN, hostname, or "localhost").
 * Sanitizes input by stripping protocols, ports, and accidental service prefixes
 * (api., pay., bank., applicant., admin., ops., portal.).
 * Handles localhost and 127.0.0.1.
 */
export function getRootDomain(fallback: string = "localhost", currentHost?: string): string {
  const envDomain =
    process.env.NEXT_PUBLIC_BASE_DOMAIN ||
    process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ||
    process.env.PLATFORM_DOMAIN;

  let rawDomain = envDomain;

  // If no env domain is configured, and a custom fallback was explicitly passed, use it
  if (!rawDomain && fallback !== "localhost") {
    rawDomain = fallback;
  }

  // If in browser context with a real host (non-localhost/non-test), use window or provided hostname
  if (!rawDomain) {
    const hostname = currentHost || (typeof window !== "undefined" && window.location ? window.location.hostname : "");
    if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
      rawDomain = hostname;
    }
  }

  // Fall back to default
  if (!rawDomain) {
    rawDomain = fallback;
  }

  let clean = rawDomain
    .trim()
    .replace(/^https?:\/\//i, "")
    .split("/")[0]
    .split(":")[0]
    .toLowerCase();

  if (!clean) {
    return fallback;
  }

  if (clean === "localhost" || clean === "127.0.0.1") {
    return clean;
  }

  const knownPrefixes = [
    "api.",
    "pay.",
    "bank.",
    "applicant.",
    "admin.",
    "ops.",
    "portal.",
  ];

  let stripped = true;
  while (stripped) {
    stripped = false;
    for (const prefix of knownPrefixes) {
      if (clean.startsWith(prefix)) {
        const candidate = clean.substring(prefix.length);
        if (candidate.length > 0) {
          clean = candidate;
          stripped = true;
          break;
        }
      }
    }
  }

  // Remove trailing dots if any
  clean = clean.replace(/\.+$/, "");

  if (clean === "localhost" || clean === "127.0.0.1") {
    return clean;
  }

  return clean || fallback;
}

/**
 * Constructs the canonical public API base URL (e.g., "https://api.yourdomain.com"
 * or "http://localhost:8080" in local development).
 * Guarantees never to generate nested subdomains.
 */
export function getApiBaseUrl(fallback: string = "localhost"): string {
  // Allow explicit direct override if provided
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/+$/, "");
  }

  const root = getRootDomain(fallback);

  if (root === "localhost" || root === "127.0.0.1") {
    return "http://localhost:8080";
  }

  if (root.startsWith("api.")) {
    return `https://${root}`;
  }

  return `https://api.${root}`;
}

