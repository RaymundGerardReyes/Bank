export interface ApiTestRequest {
  endpoint: string;
  method: string;
  apiKey: string;
  body?: any;
}

export interface ApiTestResponse {
  status: number;
  statusText: string;
  responseTimeMs: number;
  data: any;
  error?: string;
}

export const executeApiTest = async (req: ApiTestRequest): Promise<ApiTestResponse> => {
  const response = await fetch("/api/proxy/gateway-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const errJson = await response.json();
    throw new Error(errJson.error || "Execution failed");
  }

  return response.json();
};
