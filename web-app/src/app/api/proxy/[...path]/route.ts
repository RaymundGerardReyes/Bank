import { NextRequest, NextResponse } from "next/server";
import { env } from "@/server/config/env";

/**
 * Unified Internal Forwarding Function
 * Serves as the strict boundary between the Next.js edge and the internal Spring Boot API.
 */
async function forwardRequest(
  request: NextRequest, 
  { params }: { params: Promise<{ path: string[] }> }
) {
  // 1. Resolve route params dynamically
  const resolvedParams = await params;
  const pathString = resolvedParams.path.join("/");
  
  // 2. Construct the internal URL, preserving the query string
  const searchParams = request.nextUrl.search;
  const targetUrl = `${env.backendInternalUrl}/api/v1/${pathString}${searchParams}`;

  // 3. Allowlist safe headers (Strict Header Policy)
  const headers = new Headers();

  // A. Safe Standard Headers
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const accept = request.headers.get("accept");
  if (accept) headers.set("accept", accept);

  // B. Authentication State
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  // C. BFF Identity Verification
  // This satisfies Spring Boot's BffIdentityFilter requirements
  headers.set("X-Internal-BFF-Key", env.internalBffApiKey);

  // D. Tracing and Infrastructure Forwarding (From Nginx)
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  headers.set("x-request-id", requestId);

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) headers.set("x-forwarded-for", forwardedFor);

  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) headers.set("x-forwarded-proto", forwardedProto);

  const realIp = request.headers.get("x-real-ip");
  if (realIp) headers.set("x-real-ip", realIp);

  // 4. Preserve request body where applicable
  const hasBody = ["POST", "PUT", "PATCH", "DELETE"].includes(request.method);
  const body = hasBody ? await request.text() : undefined;

  // 5. Call the backend over the internal Docker network
  try {
    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store", // Ensure proxy requests are never heavily cached
    });

    // 6. Return an intentionally controlled response
    const responseData = await backendResponse.text();
    
    const responseHeaders = new Headers();
    const backendContentType = backendResponse.headers.get("content-type");
    if (backendContentType) {
      responseHeaders.set("content-type", backendContentType);
    }

    return new NextResponse(responseData, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
    
  } catch (error) {
    console.error(`[BFF Proxy Error] Failed to reach internal backend at ${targetUrl}:`, error);
    return NextResponse.json(
      { success: false, message: "Internal Gateway Error" },
      { status: 502 }
    );
  }
}

// 7. Only expose the methods your backend actually needs
export async function GET(req: NextRequest, props: { params: Promise<{ path: string[] }> }) { 
  return forwardRequest(req, props); 
}
export async function POST(req: NextRequest, props: { params: Promise<{ path: string[] }> }) { 
  return forwardRequest(req, props); 
}
export async function PUT(req: NextRequest, props: { params: Promise<{ path: string[] }> }) { 
  return forwardRequest(req, props); 
}
export async function PATCH(req: NextRequest, props: { params: Promise<{ path: string[] }> }) { 
  return forwardRequest(req, props); 
}
export async function DELETE(req: NextRequest, props: { params: Promise<{ path: string[] }> }) { 
  return forwardRequest(req, props); 
}
