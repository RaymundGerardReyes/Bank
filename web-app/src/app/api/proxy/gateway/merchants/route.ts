import { NextResponse } from "next/server";
import { env } from "@/config/env";

function extractToken(request: Request): { token: string | null; requestId: string } {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/bank_session=([^;]+)/);
  return {
    token: tokenMatch ? tokenMatch[1] : null,
    requestId: crypto.randomUUID(),
  };
}

// GET /api/proxy/gateway/merchants  → lists all merchants
export async function GET(request: Request) {
  const { token, requestId } = extractToken(request);

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/api/v1/gateway/merchants`, {
      headers: {
        "Content-Type": "application/json",
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

// POST /api/proxy/gateway/merchants  → creates a new merchant
export async function POST(request: Request) {
  const { token, requestId } = extractToken(request);
  const body = await request.json();

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/api/v1/gateway/merchants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Backend offline" }, { status: 503 });
  }
}
