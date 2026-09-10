import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis Rate Limiter if environment variables are present
let ratelimit: Ratelimit | undefined;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    analytics: true,
  });
}

// 1. Protect UI Pages
const PROTECTED_ROUTES = [
  "/accounts",
  "/transfers",
  "/transactions",
  "/statements",
  "/products",
  "/profile",
  "/admin",
  "/account-status",
  "/audit",
  "/ops",
  "/ops-dashboard",
  "/ops-payments",
  "/ops-settlements",
  "/merchants",
  "/fraud",
  "/complaints",
  "/compliance",
  "/merchant-dashboard",
  "/payments",
  "/qr-payments",
  "/refunds",
  "/balances",
  "/settlements",
  "/api/onboard",
];

// 2. Protect Internal Next.js Proxies from being abused externally
const INTERNAL_PROXY_ROUTES = [
  "/api/proxy"
];

const ADMIN_OPS_ROUTES = [
  "/admin",
  "/account-status",
  "/audit",
  "/ops",
  "/ops-dashboard",
  "/ops-payments",
  "/ops-settlements",
  "/merchants",
  "/fraud",
  "/complaints",
  "/compliance",
];

const MERCHANT_ROUTES = [
  "/merchant-dashboard",
  "/payments",
  "/qr-payments",
  "/refunds",
  "/balances",
  "/settlements",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname === "/api/health") {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("bank_session")?.value;
  
  // Rate Limiting (Stateless Edge)
  if (ratelimit) {
    try {
      const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ success: false, message: "Too many requests" }, { status: 429 });
        }
        return new NextResponse("Too Many Requests", { status: 429 });
      }
    } catch (error) {
      // FAIL-SAFE: If Upstash is temporarily unreachable, log the error but allow the request.
      console.error("[Middleware] Redis rate limiter unavailable:", error);
    }
  }

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
  const isInternalProxyRoute = INTERNAL_PROXY_ROUTES.some((route) => pathname.startsWith(route));
  const isPublicProxyRoute = pathname.startsWith("/api/proxy/auth");
  const isAdminOpsRoute = ADMIN_OPS_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
  const isMerchantRoute = MERCHANT_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
  const isExternalApiRoute = pathname === "/api/v1" || pathname.startsWith("/api/v1/");

  // --- ENTERPRISE FIX: Block unauthorized access to UI AND Internal API Proxies ---
  if (!isExternalApiRoute && ((isProtectedRoute && !isPublicProxyRoute) || (isInternalProxyRoute && !isPublicProxyRoute))) {
    if (!sessionToken) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Unauthorized: Invalid or missing session token" }, { status: 401 });
      }
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // --- PHASE 1: Server-Side Role Guarding & Expiration Check (Edge JWT Decode) ---
    try {
      const decoded = jwtDecode<{ role: string; exp?: number }>(sessionToken);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
      if (isAdminOpsRoute && decoded.role !== "ADMIN" && decoded.role !== "OPS_OFFICER") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
      if (isMerchantRoute && decoded.role !== "MERCHANT" && decoded.role !== "ADMIN" && decoded.role !== "OPS_OFFICER") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch {
      // If JWT is malformed, force re-login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Developer API documentation route check
  if (pathname.startsWith("/developers") && process.env.ENABLE_DEV_API_DOCS === "false") {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (allow auth endpoints to pass through for login/logout)
     * - api/health (health check probe)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api/health).*)",
  ],
};
