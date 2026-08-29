import { NextRequest, NextResponse } from "next/server";
import { env } from "@/server/config/env";

// ─────────────────────────────────────────────────────────────────────────────
// BFF Gateway — Unified Backend-For-Frontend Proxy
//
// This is the SINGLE, authoritative boundary between the Next.js edge layer
// and the internal Spring Boot API. Every authenticated browser request that
// needs backend data MUST flow through here.
//
// Security guarantees provided by this layer:
//   • Bearer token extracted exclusively from the HTTP-only `bank_session` cookie
//     (never exposed to client JavaScript)
//   • X-Internal-BFF-Key header attached to satisfy BffIdentityFilter
//   • Strict header allowlist — no arbitrary client headers leak to the backend
//   • Distributed tracing via X-Request-Id propagation
//
// URL mapping:
//   Browser  → /api/proxy/<endpoint>          (Next.js BFF)
//   Backend  → /api/v1/<endpoint>             (Spring Boot)
// ─────────────────────────────────────────────────────────────────────────────

type RouteProps = { params: Promise<{ endpoint: string[] }> };

/**
 * Extracts the backend endpoint path from the incoming request URL.
 * Strips the `/api/proxy/` prefix to isolate the backend resource path.
 *
 * Example:
 *   /api/proxy/statements/account/4859228705057459
 *   → statements/account/4859228705057459
 */
function resolveEndpointPath(request: NextRequest): string {
  return request.nextUrl.pathname.replace(/^\/api\/proxy\//, "");
}

/**
 * Builds the fully-qualified internal backend URL, preserving any
 * query parameters sent by the client.
 */
function buildTargetUrl(endpointPath: string, search: string): string {
  const base = env.backendInternalUrl || env.backendApiBaseUrl;
  return `${base}/api/v1/${endpointPath}${search}`;
}

/**
 * Constructs an allowlisted, hardened set of request headers.
 * Only explicitly permitted headers are forwarded — all others are dropped.
 */
function buildForwardHeaders(request: NextRequest, targetUrl: string): Headers {
  const headers = new Headers();

  // ── Standard Content Headers ─────────────────────────────────────────────
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const accept = request.headers.get("accept");
  if (accept) headers.set("accept", accept);

  // ── Authentication — extracted from HTTP-only cookie, never from JS ───────
  const sessionToken = request.cookies.get("bank_session")?.value;

  if (sessionToken) {
    headers.set("authorization", `Bearer ${sessionToken}`);
  } else {
    // Log at warn level — absence of session is expected on public routes
    // but should be visible when debugging protected resource failures.
    console.warn(
      `[BFF] No bank_session cookie for ${request.method} ${targetUrl}`
    );
  }

  // ── BFF Identity — required by Spring Boot's BffIdentityFilter ───────────
  headers.set("X-Internal-BFF-Key", env.internalBffApiKey);

  // ── Distributed Tracing & Idempotency ────────────────────────────────────
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  headers.set("x-request-id", requestId);

  const idempotencyKey = request.headers.get("idempotency-key");
  if (idempotencyKey) {
    headers.set("idempotency-key", idempotencyKey);
  }

  // ── Infrastructure / Reverse Proxy Headers ───────────────────────────────
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) headers.set("x-forwarded-for", forwardedFor);

  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) headers.set("x-forwarded-proto", forwardedProto);

  const realIp = request.headers.get("x-real-ip");
  if (realIp) headers.set("x-real-ip", realIp);

  return headers;
}

/**
 * Central forwarding function.
 * Proxies the incoming Next.js request to the internal Spring Boot backend,
 * returning the backend's response verbatim (status code + body + content-type).
 */
async function forwardToBackend(
  request: NextRequest,
  _props: RouteProps
): Promise<NextResponse> {
  const endpointPath = resolveEndpointPath(request);
  const targetUrl = buildTargetUrl(endpointPath, request.nextUrl.search);
  const headers = buildForwardHeaders(request, targetUrl);

  // Only attach a body for methods that semantically carry one
  const methodsWithBody = new Set(["POST", "PUT", "PATCH", "DELETE"]);
  const body = methodsWithBody.has(request.method)
    ? await request.text()
    : undefined;

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      // Disable Next.js fetch caching — proxy responses must always be fresh
      cache: "no-store",
    });

    const responseBody = await upstream.text();

    if (!upstream.ok) {
      console.error(
        `[BFF] Upstream error ${upstream.status} — ${request.method} ${targetUrl}\n` +
          responseBody.substring(0, 400)
      );
    }

    // Forward only the content-type header back to the client
    const responseHeaders = new Headers();
    const upstreamContentType = upstream.headers.get("content-type");
    if (upstreamContentType) {
      responseHeaders.set("content-type", upstreamContentType);
    }

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    // Network-level failure — backend unreachable inside the Docker network
    console.error(
      `[BFF] Failed to reach backend at ${targetUrl}:`,
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Service temporarily unavailable. Please try again.",
      },
      { status: 502 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP Method Exports
// Expose only the verbs your Spring Boot backend actually handles.
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest, props: RouteProps) {
  return forwardToBackend(req, props);
}
export async function POST(req: NextRequest, props: RouteProps) {
  return forwardToBackend(req, props);
}
export async function PUT(req: NextRequest, props: RouteProps) {
  return forwardToBackend(req, props);
}
export async function PATCH(req: NextRequest, props: RouteProps) {
  return forwardToBackend(req, props);
}
export async function DELETE(req: NextRequest, props: RouteProps) {
  return forwardToBackend(req, props);
}
