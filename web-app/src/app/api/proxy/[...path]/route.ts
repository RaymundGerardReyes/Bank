import { env } from "@/config/env";
import { NextResponse } from "next/server";

async function proxyRequest(request: Request, pathArray: string[]) {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/bank_session=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;
  
  const requestId = request.headers.get("X-Request-Id") || crypto.randomUUID();
  const idempotencyKey = request.headers.get("Idempotency-Key");

  const method = request.method;
  let body;
  if (method !== "GET" && method !== "HEAD") {
    body = await request.text().catch(() => null);
  }

  const backendPath = pathArray.join("/");
  
  // Extract query string
  const url = new URL(request.url);
  const searchParams = url.search;
  
  const targetUrl = `${env.backendApiBaseUrl}/${backendPath}${searchParams}`;

  const headers: Record<string, string> = {
    "X-Request-Id": requestId,
    "X-Internal-BFF-Key": env.internalBffApiKey,
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
  
  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(targetUrl, {
      method,
      headers,
      body: body ? body : undefined,
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Backend proxy error" }, { status: 502 });
  }
}

export async function GET(request: Request, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return proxyRequest(request, params.path);
}

export async function POST(request: Request, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return proxyRequest(request, params.path);
}

export async function PUT(request: Request, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return proxyRequest(request, params.path);
}

export async function DELETE(request: Request, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return proxyRequest(request, params.path);
}
