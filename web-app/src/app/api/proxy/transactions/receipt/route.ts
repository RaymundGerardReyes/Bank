import { env } from "@/config/env";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const requestId = crypto.randomUUID();

    // Safely extract the token
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/bank_session=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    try {
        const res = await fetch(`${env.backendApiBaseUrl}/transactions/receipt/send`, {
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
        return NextResponse.json({ success: false, message: "Receipt proxy error" }, { status: 500 });
    }
}