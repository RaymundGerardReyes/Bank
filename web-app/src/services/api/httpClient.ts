import { env } from "@/config/env";

export interface RequestOptions extends RequestInit {
  idempotencyKey?: string;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { idempotencyKey, headers: customHeaders, ...restOptions } = options;

  const requestId = typeof crypto !== "undefined" && crypto.randomUUID 
    ? crypto.randomUUID() 
    : `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Request-Id": requestId,
    ...(customHeaders as Record<string, string>),
  };

  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const apiPath = cleanEndpoint.startsWith("/auth") 
    ? `/api${cleanEndpoint}` 
    : `/api/proxy${cleanEndpoint}`;

  const url = endpoint.startsWith("http") ? endpoint : `${env.appUrl}${apiPath}`;

  const response = await fetch(url, {
    ...restOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP ${response.status}: Request failed`);
  }

  return response.json() as Promise<T>;
}
