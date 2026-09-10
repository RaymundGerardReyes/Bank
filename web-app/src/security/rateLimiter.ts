const requestCounts = new Map<string, { count: number; resetTime: number }>();

const MAX_CACHE_ENTRIES = 5000;

export function isRateLimited(identifier: string, maxRequests = 60, windowMs = 60000): boolean {
  const now = Date.now();

  // Bounded memory defense: periodically evict expired records
  if (requestCounts.size > MAX_CACHE_ENTRIES) {
    for (const [key, val] of requestCounts.entries()) {
      if (now > val.resetTime) {
        requestCounts.delete(key);
      }
    }
  }

  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }

  record.count += 1;
  return record.count > maxRequests;
}
