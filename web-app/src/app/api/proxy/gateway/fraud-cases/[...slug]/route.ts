import { NextResponse } from "next/server";
import { env } from "@/server/config/env";

function extractToken(request: Request): { token: string | null; requestId: string } {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/bank_session=([^;]+)/);
  return {
    token: tokenMatch ? tokenMatch[1] : null,
    requestId: crypto.randomUUID(),
  };
}

// GET /api/proxy/gateway/fraud-cases       → list all cases
// GET /api/proxy/gateway/fraud-cases/[id]  → get one case

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { token, requestId } = extractToken(request);
  const { slug } = await params;
  const path = slug ? slug.join("/") : "";

  try {
    const url = path
      ? `${env.backendApiBaseUrl}/api/v1/gateway/fraud-cases/${path}`
      : `${env.backendApiBaseUrl}/api/v1/gateway/fraud-cases`;

    const res = await fetch(url, {
      headers: {
        "X-Request-Id": requestId,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Backend offline" }, { status: 503 });
  }
}
