import { describe, it, expect, vi, beforeEach } from 'vitest';
// Adjust the import paths according to your exact web-app structure
import { transactionService } from '@/services/transaction/transactionService';
import { httpClient } from '@/services/api/httpClient';

// 1. Mock the underlying HTTP client so we don't make real network requests
vi.mock('@/services/api/httpClient', () => ({
  httpClient: {
    post: vi.fn(),
  },
}));

describe('Transaction Service - API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('P01: should successfully execute an internal transfer', async () => {
    // Arrange
    const mockPayload = {
      sourceAccountNumber: 'ACC-123',
      destinationAccountNumber: 'ACC-456',
      amount: 50.00,
      description: 'Test transfer'
    };
    const mockResponse = { data: { success: true, transactionReference: 'TXN-123' } };
    vi.mocked(httpClient.post).mockResolvedValue(mockResponse);

    // Act
    const result = await transactionService.executeInternalTransfer(mockPayload);

    // Assert
    expect(httpClient.post).toHaveBeenCalledWith('/transfers/internal', mockPayload);
    expect(result).toEqual(mockResponse.data);
  });

  it('P02: should throw an error when the destination account is not found (404)', async () => {
    // Arrange
    const mockPayload = {
      sourceAccountNumber: 'ACC-123',
      destinationAccountNumber: 'INVALID-999',
      amount: 50.00
    };

    const mockError = {
      response: {
        status: 404,
        data: { message: "Transfer failed: Destination account 'INVALID-999' does not exist." }
      }
    };

    // Simulate the exact 404 error thrown by the Spring Boot backend
    vi.mocked(httpClient.post).mockRejectedValue(mockError);

    // Act & Assert
    await expect(transactionService.executeInternalTransfer(mockPayload)).rejects.toEqual(mockError);
  });
});
