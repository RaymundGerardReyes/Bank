export const idempotencyKeyService = {
  generateKey: (): string => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `idem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  },
  getOrCreateKey: (): string => {
    if (typeof window === "undefined") return idempotencyKeyService.generateKey();
    let key = sessionStorage.getItem("current_transfer_idempotency_key");
    if (!key) {
      key = idempotencyKeyService.generateKey();
      sessionStorage.setItem("current_transfer_idempotency_key", key);
    }
    return key;
  },
  resetKey: (): void => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("current_transfer_idempotency_key");
    }
  },
  clearKey: (): void => {
    idempotencyKeyService.resetKey();
  },
};
