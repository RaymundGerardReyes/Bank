import { env } from "@/server/config/env";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const idempotencyKey = request.headers.get("Idempotency-Key") || crypto.randomUUID();
  const requestId = request.headers.get("X-Request-Id") || crypto.randomUUID();
  
  // Safely extract the token
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/bank_session=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/transfers/internal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
        "X-Request-Id": requestId,
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Transfer proxy error" }, { status: 500 });
  }
}