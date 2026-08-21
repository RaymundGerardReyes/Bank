import { NextResponse } from "next/server";
import { env } from "@/config/env";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/bank_session=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;
  const requestId = crypto.randomUUID();

  try {
    const body = await request.json();
    const res = await fetch(`${env.backendApiBaseUrl}/webhooks/simulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
        "X-Client-Id": "client_1", // Default to merchant 1 for now
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Backend offline" }, { status: 503 });
  }
}
