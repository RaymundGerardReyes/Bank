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

// GET  /api/proxy/gateway/settlement-exceptions        → list all
// GET  /api/proxy/gateway/settlement-exceptions/[id]   → get one
// POST /api/proxy/gateway/settlement-exceptions/[id]/resolve

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { token, requestId } = extractToken(request);
  const { slug } = await params;
  const path = slug ? slug.join("/") : "";

  try {
    const url = path
      ? `${env.backendApiBaseUrl}/api/v1/gateway/settlement-exceptions/${path}`
      : `${env.backendApiBaseUrl}/api/v1/gateway/settlement-exceptions`;

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { token, requestId } = extractToken(request);
  const { slug } = await params;
  const path = slug.join("/");
  const body = await request.json();

  try {
    const res = await fetch(
      `${env.backendApiBaseUrl}/api/v1/gateway/settlement-exceptions/${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-Id": requestId,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Backend offline" }, { status: 503 });
  }
}
