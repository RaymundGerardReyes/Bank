import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { endpoint, method, apiKey, body } = await req.json();

    if (!endpoint || !method || !apiKey) {
      return NextResponse.json({ error: "Missing endpoint, method, or apiKey" }, { status: 400 });
    }

    const backendUrl = `http://localhost:8085/api${endpoint}`;

    const headers: Record<string, string> = {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
      "X-Request-Id": crypto.randomUUID(),
    };

    const startTime = Date.now();
    const response = await fetch(backendUrl, {
      method,
      headers,
      body: body && (method === "POST" || method === "PUT" || method === "PATCH") ? JSON.stringify(body) : undefined,
    });
    const responseTimeMs = Date.now() - startTime;

    let responseData: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      responseTimeMs,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to execute proxy request" }, { status: 500 });
  }
}
