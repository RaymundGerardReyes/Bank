export function attachCorrelationId(headers: Record<string, string>): Record<string, string> {
  const requestId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  return {
    ...headers,
    "X-Request-Id": requestId,
  };
}
