import { apiFetch } from "@/services/api/httpClient";
import { endpoints } from "@/services/api/endpoints";

export interface FxRatesResponse {
  base: string;
  rates: Record<string, number>;
  ratesToPhp: Record<string, number>;
  timestamp: string;
}

// Fallback market reference rates to PHP
export const DEFAULT_RATES_TO_PHP: Record<string, number> = {
  PHP: 1.0,
  USD: 62.6280,
  EUR: 63.50,
  GBP: 74.80,
  CAD: 42.80,
  SGD: 44.50,
  JPY: 0.38,
};

export const fxService = {
  getRates: async (base: string = "PHP"): Promise<FxRatesResponse> => {
    try {
      const res = await apiFetch<FxRatesResponse>(`${endpoints.fx.rates}?base=${base}`);
      if (res && res.ratesToPhp) {
        return res;
      }
      throw new Error("Invalid FX rates payload");
    } catch (err) {
      console.warn("Falling back to standard banking reference FX rates:", err);
      return {
        base: "PHP",
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
      };
    }
  },

  convertAmountToPhp: (
    amount: number,
    currency: string = "PHP",
    ratesToPhp: Record<string, number> = DEFAULT_RATES_TO_PHP
  ): number => {
    const rate = ratesToPhp[currency.toUpperCase()] ?? DEFAULT_RATES_TO_PHP[currency.toUpperCase()] ?? 1.0;
    return amount * rate;
  },
};

