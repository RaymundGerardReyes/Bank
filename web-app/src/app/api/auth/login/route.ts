import { env } from "@/server/config/env";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requestId = crypto.randomUUID();
    const payload = {
      email: body.email || body.username,
      password: body.password,
    };

    const response = await fetch(`${env.backendApiBaseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
        "X-Internal-BFF-Key": env.internalBffApiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // FIX: Accurately extract the real JWT from the nested ApiResponse structure
    const actualToken = data.data?.token || data.token;

    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      data: data.data || data,
    });

    // Save the REAL token into the HttpOnly session cookie
    res.cookies.set("bank_session", actualToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    return res;
  } catch (error) {
    console.error("[Login Proxy Error] Failed to reach backend:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}