import { NextResponse } from "next/server";
import { env } from "@/config/env";

export async function GET(request: Request) {
  const sessionCookie = request.headers.get("cookie");
  const requestId = crypto.randomUUID();

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/apikeys`, {
      headers: {
        "X-Request-Id": requestId,
        Cookie: sessionCookie || "",
      },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Backend offline" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const sessionCookie = request.headers.get("cookie");
  const requestId = crypto.randomUUID();

  try {
    const body = await request.json();
    const res = await fetch(`${env.backendApiBaseUrl}/apikeys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
        Cookie: sessionCookie || "",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Backend offline" }, { status: 503 });
  }
}
