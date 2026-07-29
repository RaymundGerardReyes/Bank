import { env } from "@/config/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("bank_session")?.value;
  const requestId = crypto.randomUUID();

  try {
    const res = await fetch(`${env.backendApiBaseUrl}/statements`, {
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
    });
    const data = await res.json().catch(() => ([]));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Statements proxy error" }, { status: 500 });
  }
}