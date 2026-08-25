import { env } from "@/server/config/env";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/bank_session=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;
  const requestId = crypto.randomUUID();
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/webhooks/${id}`, {
      method: "DELETE",
      headers: {
        "X-Request-Id": requestId,
        "X-Client-Id": "client_1", // Default to merchant 1 for now
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Backend offline" }, { status: 503 });
  }
}
