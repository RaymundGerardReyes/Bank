import { NextResponse } from "next/server";
import { env } from "@/server/config/env";

export async function POST(request: Request) {
  try {
    const sessionCookie = request.headers.get("cookie");
    const requestId = crypto.randomUUID();

    const response = await fetch(`${env.backendApiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
        Cookie: sessionCookie || "",
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const res = NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
      data: data.data || data,
    });

    if (data.token) {
      res.cookies.set("bank_session", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 60,
      });
    }

    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to refresh authentication session" },
      { status: 500 }
    );
  }
}
