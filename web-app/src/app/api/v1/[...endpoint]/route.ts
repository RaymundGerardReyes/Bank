import { NextRequest, NextResponse } from "next/server";
import { env } from "@/server/config/env";

type RouteProps = { params: Promise<{ endpoint: string[] }> };

const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH", "DELETE"]);

async function resolveEndpointPath(props: RouteProps): Promise<string> {
  const { endpoint } = await props.params;
  return endpoint.join("/");
}

function buildTargetUrl(endpointPath: string, search: string): string {
  const base = env.backendInternalUrl || env.backendApiBaseUrl;
  return `${base}/api/v1/${endpointPath}${search}`;
}

function copyHeader(source: Headers, target: Headers, name: string) {
  const value = source.get(name);
  if (value) {
    target.set(name, value);
  }
}

function buildForwardHeaders(request: NextRequest): Headers {
  const headers = new Headers();

  copyHeader(request.headers, headers, "accept");
  copyHeader(request.headers, headers, "content-type");
  copyHeader(request.headers, headers, "idempotency-key");
  copyHeader(request.headers, headers, "authorization");
  copyHeader(request.headers, headers, "x-api-key");
  copyHeader(request.headers, headers, "x-real-ip");
  copyHeader(request.headers, headers, "x-forwarded-for");
  copyHeader(request.headers, headers, "x-forwarded-proto");
  copyHeader(request.headers, headers, "cf-connecting-ip");
  copyHeader(request.headers, headers, "cf-ray");

  headers.set("x-request-id", request.headers.get("x-request-id") ?? crypto.randomUUID());

  return headers;
}

async function proxyPublicApiRequest(
  request: NextRequest,
  props: RouteProps
): Promise<NextResponse> {
  const endpointPath = await resolveEndpointPath(props);
  const targetUrl = buildTargetUrl(endpointPath, request.nextUrl.search);
  const body = METHODS_WITH_BODY.has(request.method) ? await request.text() : undefined;

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers: buildForwardHeaders(request),
      body,
      cache: "no-store",
    });

    const responseBody = await upstream.text();
    const responseHeaders = new Headers();
    const contentType = upstream.headers.get("content-type");
    const requestId = upstream.headers.get("x-request-id");

    if (contentType) {
      responseHeaders.set("content-type", contentType);
    }
    if (requestId) {
      responseHeaders.set("x-request-id", requestId);
    }

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(
      `[PUBLIC API PROXY] Failed to reach backend at ${targetUrl}:`,
      error instanceof Error ? error.message : error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Service temporarily unavailable. Please try again.",
      },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, props: RouteProps) {
  return proxyPublicApiRequest(req, props);
}

export async function POST(req: NextRequest, props: RouteProps) {
  return proxyPublicApiRequest(req, props);
}

export async function PUT(req: NextRequest, props: RouteProps) {
  return proxyPublicApiRequest(req, props);
}

export async function PATCH(req: NextRequest, props: RouteProps) {
  return proxyPublicApiRequest(req, props);
}

export async function DELETE(req: NextRequest, props: RouteProps) {
  return proxyPublicApiRequest(req, props);
}

export async function OPTIONS(req: NextRequest, props: RouteProps) {
  return proxyPublicApiRequest(req, props);
}
