import { NextRequest, NextResponse } from "next/server";
import { env } from "@/server/config/env";

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get("bank_session")?.value;

  if (sessionToken) {
    try {
      await fetch(`${env.backendApiBaseUrl}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "X-Internal-BFF-Key": env.internalBffApiKey,
          "X-Request-Id": crypto.randomUUID(),
        },
      });
    } catch (error) {
      console.warn("[Logout Proxy] Failed to notify backend of token invalidation:", error);
    }
  }

  const res = NextResponse.json({ success: true, message: "Logged out successfully" });
  res.cookies.set("bank_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}
