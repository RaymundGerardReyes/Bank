import { apiClient } from '../api/apiClient';

export interface FxRatesResponse {
  base: string;
  rates: Record<string, number>;
  ratesToPhp: Record<string, number>;
  timestamp: string;
  provider?: string;
  providerAttribution?: string;
  isLive?: boolean;
  timeLastUpdateUtc?: string;
  timeNextUpdateUtc?: string;
  disclaimer?: string;
}

export const DEFAULT_RATES_TO_PHP: Record<string, number> = {
  PHP: 1.0,
  USD: 62.6280,
  EUR: 63.50,
  GBP: 74.80,
  CAD: 42.80,
  SGD: 44.50,
  JPY: 0.38,
};

let cachedRatesResponse: FxRatesResponse | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60_000; // 60 seconds

const createFallbackResponse = (): FxRatesResponse => ({
  base: 'PHP',
  rates: {
    PHP: 1.0,
    USD: 1 / 62.6280,
    EUR: 1 / 63.50,
    GBP: 1 / 74.80,
    CAD: 1 / 42.80,
    SGD: 1 / 44.50,
    JPY: 1 / 0.38,
  },
  ratesToPhp: DEFAULT_RATES_TO_PHP,
  timestamp: new Date().toISOString(),
  provider: 'FALLBACK_BENCHMARK',
  providerAttribution: 'Hardened Reference Rates',
  isLive: false,
  disclaimer: 'Reference rates applied. Market rates may vary.',
});

export const fxService = {
  getRates: async (base: string = 'PHP', refresh: boolean = false): Promise<FxRatesResponse> => {
    const now = Date.now();
    if (!refresh && cachedRatesResponse && now - lastFetchTime < CACHE_TTL_MS) {
      return cachedRatesResponse;
    }

    try {
      const response = await apiClient.get<FxRatesResponse>(
        `/fx/rates?base=${base}${refresh ? '&refresh=true' : ''}`
      );
      if (response.data && response.data.ratesToPhp) {
        cachedRatesResponse = response.data;
        lastFetchTime = Date.now();
        return response.data;
      }
      throw new Error('Invalid FX payload');
    } catch {
      // Graceful fallback to hardened reference rates
      const fallback = createFallbackResponse();
      // Cache fallback briefly (30s) to throttle network retries during unauthenticated / offline states
      cachedRatesResponse = fallback;
      lastFetchTime = Date.now() - 30_000;
      return fallback;
    }
  },

  convertAmountToPhp: (
    amount: number,
    currency: string = 'PHP',
    ratesToPhp: Record<string, number> = DEFAULT_RATES_TO_PHP
  ): number => {
    const rate = ratesToPhp[currency.toUpperCase()] ?? DEFAULT_RATES_TO_PHP[currency.toUpperCase()] ?? 1.0;
    return amount * rate;
  },
};
