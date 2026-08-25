import { NextResponse } from "next/server";
import { env } from "@/server/config/env";

export async function GET(request: Request) {
  const sessionCookie = request.headers.get("cookie");
  const requestId = crypto.randomUUID();

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/products`, {
      headers: {
        "X-Request-Id": requestId,
        Cookie: sessionCookie || "",
      },
    });

    const data = await res.json().catch(() => ([]));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Products proxy error" }, { status: 500 });
  }
}
