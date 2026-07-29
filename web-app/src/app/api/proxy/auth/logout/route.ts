import { env } from "@/config/env";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const requestId = crypto.randomUUID();
        const response = await fetch(`${env.backendApiBaseUrl}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Request-Id": requestId },
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ success: true, message: "Logged out locally" });
    }
}
