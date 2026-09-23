import { apiClient } from '../api/apiClient';

export interface FxRatesResponse {
  base: string;
  rates: Record<string, number>;
  ratesToPhp: Record<string, number>;
  timestamp: string;
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

export const fxService = {
  getRates: async (base: string = 'PHP'): Promise<FxRatesResponse> => {
    try {
      const response = await apiClient.get<FxRatesResponse>(`/fx/rates?base=${base}`);
      if (response.data && response.data.ratesToPhp) {
        return response.data;
      }
      throw new Error('Invalid FX payload');
    } catch (err) {
      return {
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
      };
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

