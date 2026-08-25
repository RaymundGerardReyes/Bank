import { NextResponse } from "next/server";
import { env } from "@/server/config/env";

// Handles: POST /api/proxy/gateway/qr-payments/[intentId]
//          GET  /api/proxy/gateway/qr-payments/[intentId]

function extractToken(request: Request): { token: string | null; requestId: string } {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/bank_session=([^;]+)/);
  return {
    token: tokenMatch ? tokenMatch[1] : null,
    requestId: crypto.randomUUID(),
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { token, requestId } = extractToken(request);
  const { slug } = await params;
  const path = slug.join("/");

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/api/v1/gateway/payment-intents/${path}`, {
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
  const idempotencyKey = request.headers.get("Idempotency-Key") || crypto.randomUUID();

  let body: unknown = undefined;
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    body = await request.json().catch(() => ({}));
  }

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/api/v1/gateway/payment-intents/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
        "Idempotency-Key": idempotencyKey,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Backend offline" }, { status: 503 });
  }
}
