import { describe, it, expect, vi, beforeEach } from 'vitest';
import { transactionService, normalizeTransactionResult } from '@/services/transaction/transactionService';
import { idempotencyKeyService } from '@/services/transaction/idempotencyKeyService';
import * as httpClient from '@/services/api/httpClient';

vi.mock('@/services/api/httpClient', () => ({
  apiFetch: vi.fn(),
}));

vi.mock('@/services/transaction/idempotencyKeyService', () => ({
  idempotencyKeyService: {
    generateKey: vi.fn(() => 'mock-idempotency-key'),
    getOrCreateKey: vi.fn(() => 'mock-idempotency-key'),
    clearKey: vi.fn(),
  },
}));

describe('transactionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('normalizeTransactionResult', () => {
    it('should map a COMPLETED backend status to SUCCESS', () => {
      const response = {
        success: true,
        data: {
          status: 'COMPLETED',
          transactionReference: 'TXN-123',
          processedAt: '2025-06-10T10:00:00Z',
        },
      };

      const result = normalizeTransactionResult(response);
      expect(result.status).toBe('SUCCESS');
      expect(result.transactionReference).toBe('TXN-123');
    });

    it('should map PENDING and FAILED statuses correctly', () => {
      const pendingResponse = { success: true, data: { status: 'PENDING' } };
      expect(normalizeTransactionResult(pendingResponse).status).toBe('PENDING');

      const failedResponse = { success: true, data: { status: 'FAILED' } };
      expect(normalizeTransactionResult(failedResponse).status).toBe('FAILED');
    });

    it('should return FAILED and SERVICE_UNAVAILABLE for unhandled/network errors', () => {
      const errorResponse = {
        success: false,
        error: 'NETWORK_TIMEOUT',
        message: 'Request timed out.',
      };

      const result = normalizeTransactionResult(errorResponse);
      expect(result.status).toBe('FAILED');
      expect(result.failureCode).toBe('NETWORK_TIMEOUT');
      expect(result.failureMessage).toBe('Request timed out.');
    });

    it('should provide safe defaults if response is completely undefined', () => {
      const result = normalizeTransactionResult(undefined);
      expect(result.status).toBe('FAILED');
      expect(result.failureCode).toBe('SERVICE_UNAVAILABLE');
    });
  });

  describe('externalPayment idempotency', () => {
    it('should generate and send an idempotency key if one is not provided', async () => {
      const payload = {
        sourceAccountNumber: '1234',
        routingNumber: '020202020',
        recipientAccountNumber: '5678',
        recipientName: 'Jane Doe',
        amount: 500,
      };

      await transactionService.externalPayment(payload);

      expect(idempotencyKeyService.generateKey).toHaveBeenCalled();
      expect(httpClient.apiFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          idempotencyKey: 'mock-idempotency-key',
        })
      );
    });

    it('should use the provided idempotency key to prevent duplicate transactions', async () => {
      const payload = {
        sourceAccountNumber: '1234',
        routingNumber: '020202020',
        recipientAccountNumber: '5678',
        recipientName: 'Jane Doe',
        amount: 500,
        idempotencyKey: 'explicit-duplicate-key-ABC',
      };

      await transactionService.externalPayment(payload);

      expect(httpClient.apiFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          idempotencyKey: 'explicit-duplicate-key-ABC',
        })
      );
    });
  });

  describe('qrPhPayment behavior', () => {
    it('should cleanly reject immediately simulating unavailable backend', async () => {
      const payload = {
        sourceAccountNumber: '1234',
        qrPayload: 'mock-qr-data',
        amount: 1000,
      };

      await expect(transactionService.qrPhPayment(payload)).rejects.toThrow('QR Ph integration unavailable');
    });
  });
});
