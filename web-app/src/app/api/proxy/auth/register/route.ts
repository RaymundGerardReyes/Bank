import { env } from "@/config/env";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const requestId = crypto.randomUUID();
        const response = await fetch(`${env.backendApiBaseUrl}/auth/register`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "X-Request-Id": requestId,
                "X-Internal-BFF-Key": env.internalBffApiKey
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Registration failed" }, { status: 500 });
    }
}
