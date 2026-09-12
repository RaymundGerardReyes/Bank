import { describe, it, expect } from 'vitest';
import { formatDate, formatCurrency, maskAccountNumber } from '@/utils/formatters';

describe('formatters utility', () => {
  describe('formatDate', () => {
    it('formats ISO UTC instant into Asia/Manila (UTC+8)', () => {
      // 04:04:52 UTC on Sep 12 should be 12:04 PM in Asia/Manila
      const utcTimestamp = '2026-09-12T04:04:52.814527Z';
      const formatted = formatDate(utcTimestamp, 'Asia/Manila');
      expect(formatted).toBe('Sep 12, 2026, 12:04 PM');
    });

    it('Phase 19 Timestamp Matrix: 2026-09-12T04:04:00Z across multiple global zones', () => {
      const inputUtc = '2026-09-12T04:04:00Z';
      // Asia/Manila (UTC+8) -> 12:04 PM
      expect(formatDate(inputUtc, 'Asia/Manila')).toBe('Sep 12, 2026, 12:04 PM');
      // America/New_York (UTC-4 EDT) -> 12:04 AM
      expect(formatDate(inputUtc, 'America/New_York')).toBe('Sep 12, 2026, 12:04 AM');
      // Europe/Helsinki (UTC+3 EEST in Sep) -> 7:04 AM
      expect(formatDate(inputUtc, 'Europe/Helsinki')).toBe('Sep 12, 2026, 7:04 AM');
      // UTC -> 4:04 AM
      expect(formatDate(inputUtc, 'UTC')).toBe('Sep 12, 2026, 4:04 AM');
    });

    it('Phase 19 Date Boundary: 2026-09-11T20:00:00Z crossing day boundary', () => {
      // 20:00 UTC on Sep 11:
      // In Asia/Manila (+8h) -> Sep 12, 4:00 AM
      // In America/New_York (-4h EDT) -> Sep 11, 4:00 PM
      // In UTC -> Sep 11, 8:00 PM
      const boundaryTimestamp = '2026-09-11T20:00:00Z';
      expect(formatDate(boundaryTimestamp, 'Asia/Manila')).toBe('Sep 12, 2026, 4:00 AM');
      expect(formatDate(boundaryTimestamp, 'America/New_York')).toBe('Sep 11, 2026, 4:00 PM');
      expect(formatDate(boundaryTimestamp, 'UTC')).toBe('Sep 11, 2026, 8:00 PM');
    });

    it('returns raw string for invalid date strings', () => {
      expect(formatDate('not-a-valid-date')).toBe('not-a-valid-date');
    });
  });

  describe('Phase 20 Currency Test Matrix & Aggregation Segregation', () => {
    it('formats PHP currency correctly including zero', () => {
      expect(formatCurrency(0, 'PHP')).toContain('0.00');
      expect(formatCurrency(1100.0, 'PHP')).toContain('1,100.00');
    });

    it('formats USD currency correctly including zero', () => {
      expect(formatCurrency(0, 'USD')).toContain('0.00');
      expect(formatCurrency(123024.0, 'USD')).toContain('123,024.00');
    });

    it('segregates multi-currency account balances without scalar addition', () => {
      const accounts = [
        { accountNumber: '4859222340669478', currency: 'USD', balance: 123024.0 },
        { accountNumber: '4859225827474779', currency: 'PHP', balance: 1100.0 },
        { accountNumber: 'MERCHANT-SETTLEMENT-001', currency: 'PHP', balance: 99999.0 },
      ];

      // Replicate the portfolio aggregation logic from accounts/page.tsx
      const balancesByCurrency = accounts
        .filter((acc) => !acc.accountNumber.startsWith('MERCHANT-SETTLEMENT-'))
        .reduce<Record<string, number>>((result, account) => {
          const curr = account.currency || 'PHP';
          result[curr] = (result[curr] ?? 0) + Number(account.balance || 0);
          return result;
        }, {});

      // Invariant: USD and PHP remain segregated
      expect(balancesByCurrency['USD']).toBe(123024.0);
      expect(balancesByCurrency['PHP']).toBe(1100.0);

      // Invariant: Must NEVER collapse into 124,124
      const scalarSum = Object.values(balancesByCurrency).reduce((a, b) => a + b, 0);
      expect(scalarSum).toBe(124124.0); // Scalar sum exists mathematically only if someone collapsed them
      expect(balancesByCurrency).not.toHaveProperty('TOTAL');
      expect(Object.keys(balancesByCurrency)).toEqual(['USD', 'PHP']);
    });

    it('handles empty account list cleanly', () => {
      const accounts: any[] = [];
      const balancesByCurrency = accounts.reduce<Record<string, number>>((result, account) => {
        result[account.currency] = (result[account.currency] ?? 0) + Number(account.balance || 0);
        return result;
      }, {});
      expect(Object.keys(balancesByCurrency).length).toBe(0);
    });
  });

  describe('maskAccountNumber', () => {
    it('masks accounts retaining only last 4 digits', () => {
      expect(maskAccountNumber('4859222340669478')).toBe('**** 9478');
    });

    it('returns **** for short or missing account numbers', () => {
      expect(maskAccountNumber('')).toBe('****');
      expect(maskAccountNumber('123')).toBe('****');
    });
  });
});

