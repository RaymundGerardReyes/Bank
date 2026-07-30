import { env } from "@/config/env";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1. Safely extract the token natively without relying on next/headers
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/bank_session=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;
  const requestId = crypto.randomUUID();

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/accounts`, {
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
        // 2. Map the extracted token to the Spring Boot Bearer header
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Backend offline" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/bank_session=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;
  const requestId = crypto.randomUUID();
  const body = await request.json();

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
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