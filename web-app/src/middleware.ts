import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// 1. Protect UI Pages
const PROTECTED_ROUTES = ["/accounts", "/transfers", "/transactions", "/statements", "/products", "/profile", "/admin"];

// 2. Protect Internal Next.js Proxies from being abused externally
const INTERNAL_PROXY_ROUTES = [
  "/api/proxy/admin",
  "/api/proxy/apikeys",
  "/api/proxy/accounts",
  "/api/proxy/statements"
];

const ADMIN_ROUTES = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("bank_session")?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isInternalProxyRoute = INTERNAL_PROXY_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  // --- ENTERPRISE FIX: Block unauthorized access to UI AND Internal API Proxies ---
  if ((isProtectedRoute || isInternalProxyRoute) && !sessionToken) {

    // If it's an API request, return a strict 401 JSON response (Don't redirect APIs to HTML login)
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, message: "Unauthorized: Invalid or missing session token" }, { status: 401 });
    }

    // If it's a UI request, gracefully redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
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
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};