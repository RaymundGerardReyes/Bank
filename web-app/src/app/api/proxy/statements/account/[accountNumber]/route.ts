import { env } from "@/server/config/env";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ accountNumber: string }> }
) {
    const { accountNumber } = await params;

    // Safely extract the token
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/bank_session=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    const requestId = crypto.randomUUID();

    try {
        const res = await fetch(`${env.backendApiBaseUrl}/statements/account/${accountNumber}`, {
            headers: {
                "Content-Type": "application/json",
                "X-Request-Id": requestId,
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
        });
        const data = await res.json().catch(() => ({}));
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        return NextResponse.json({ success: false, message: "Statement proxy error" }, { status: 500 });
    }
}