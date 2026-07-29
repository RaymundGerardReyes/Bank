import { NextResponse } from "next/server";
import { env } from "@/config/env";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  const { id, action } = await params;
  const sessionCookie = request.headers.get("cookie");
  const requestId = crypto.randomUUID();

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/apikeys/${id}/${action}`, {
      method: "POST",
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
