
export interface RequestOptions extends RequestInit {
  idempotencyKey?: string;
}

export class ApiError extends Error {
  public response: any;
  constructor(message: string, response: any) {
    super(message);
    this.name = "ApiError";
    this.response = response;
  }
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
  
  let apiPath = `/api/proxy${cleanEndpoint}`;
  if (cleanEndpoint.startsWith("/auth")) {
    apiPath = `/api${cleanEndpoint}`;
  } else if (cleanEndpoint.startsWith("/api/v1/")) {
    apiPath = cleanEndpoint; // Direct backend calls (e.g., checkout API on webhook domain)
  }

  const baseUrl = typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_APP_URL || "";
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${apiPath}`;

  const response = await fetch(url, {
    ...restOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new ApiError(errorData.message || `HTTP ${response.status}: Request failed`, errorData);
  }

  return response.json() as Promise<T>;
}

export const httpClient = {
  get: async <T>(url: string, options?: RequestOptions): Promise<T> => {
    return apiFetch<T>(url, { ...options, method: "GET" });
  },
  post: async <T>(url: string, body?: any, options?: RequestOptions): Promise<T> => {
    return apiFetch<T>(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },
  put: async <T>(url: string, body?: any, options?: RequestOptions): Promise<T> => {
    return apiFetch<T>(url, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },
  delete: async <T>(url: string, options?: RequestOptions): Promise<T> => {
    return apiFetch<T>(url, { ...options, method: "DELETE" });
  },
};

export default httpClient;
