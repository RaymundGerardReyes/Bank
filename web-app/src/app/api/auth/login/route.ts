import { NextResponse } from "next/server";
import { env } from "@/config/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requestId = crypto.randomUUID();

    const response = await fetch(`${env.backendApiBaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Set httpOnly session cookie
    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      data: data.data || data,
    });

    res.cookies.set("bank_session", data.token || "demo-session-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
