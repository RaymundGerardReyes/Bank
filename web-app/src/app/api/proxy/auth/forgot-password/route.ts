import { env } from "@/config/env";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const requestId = crypto.randomUUID();
        const response = await fetch(`${env.backendApiBaseUrl}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Request-Id": requestId },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to send reset link" }, { status: 500 });
    }
}
