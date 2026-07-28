import { NextResponse } from "next/server";
import { env } from "@/config/env";

export async function GET(request: Request) {
  const sessionCookie = request.headers.get("cookie");
  const requestId = crypto.randomUUID();

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/transactions/history`, {
      headers: {
        "X-Request-Id": requestId,
        Cookie: sessionCookie || "",
      },
    });

    const data = await res.json().catch(() => ([]));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Transactions proxy error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const idempotencyKey = request.headers.get("Idempotency-Key") || crypto.randomUUID();
  const requestId = request.headers.get("X-Request-Id") || crypto.randomUUID();

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/transactions/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
        "X-Request-Id": requestId,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Transaction proxy error" }, { status: 500 });
  }
}
