import { generateUUID } from '../../utils/formatters';

let currentDraftKey: string | null = null;

export const idempotencyKeyService = {
  getOrCreateKey: (): string => {
    if (!currentDraftKey) {
      currentDraftKey = generateUUID();
    }
    return currentDraftKey;
  },

  resetKey: (): void => {
    currentDraftKey = null;
  },
};
