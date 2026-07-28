import { idempotencyKeyService } from "@/services/transaction/idempotencyKeyService";

export function attachIdempotencyKey(headers: Record<string, string>, existingKey?: string): Record<string, string> {
  const key = existingKey || idempotencyKeyService.generateKey();
  return {
    ...headers,
    "Idempotency-Key": key,
  };
}
