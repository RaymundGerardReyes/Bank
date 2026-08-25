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

export async function GET(request: Request) {
  const { token, requestId } = extractToken(request);

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/api/v1/gateway/settlement-windows`, {
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
