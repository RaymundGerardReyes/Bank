const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function isRateLimited(identifier: string, maxRequests = 60, windowMs = 60000): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }

  record.count += 1;
  return record.count > maxRequests;
}
