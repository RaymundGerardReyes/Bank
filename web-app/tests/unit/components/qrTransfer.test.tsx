import QrPhTransferPage from '@/app/(dashboard)/transfers/qr/page';
import { transactionService } from '@/services/transaction/transactionService';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
// Mock dependencies
vi.mock('@/hooks/useAccounts', () => ({
  useAccounts: () => ({
    data: [
      { accountNumber: '1234567890', accountType: 'Checking', balance: 5000, status: 'ACTIVE' },
    ],
    isLoading: false,
  }),
}));

vi.mock('@/services/transaction/transactionService', () => ({
  transactionService: {
    qrPhPayment: vi.fn(),
  },
  normalizeTransactionResult: vi.fn((res) => {
    if (!res || !res.success) {
      return { status: 'FAILED', failureCode: res?.error || 'UNKNOWN', failureMessage: res?.message || 'Error' };
    }
    return { status: res.data.status, transactionReference: res.data.transactionReference };
  }),
}));

vi.mock('@/services/transaction/idempotencyKeyService', () => ({
  idempotencyKeyService: {
    getOrCreateKey: vi.fn(() => 'test-key'),
    clearKey: vi.fn(),
  },
}));

describe('QrPhTransferPage State Machine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should transition to FAILED with QR_PH_UNAVAILABLE when integration is unavailable', async () => {
    // Fake timers to skip the setTimeout in simulateScan
    vi.useFakeTimers();
    render(<QrPhTransferPage />);

    // In Form Step (Ready to Scan)
    fireEvent.click(screen.getByText(/Open Camera/i));

    // Fast-forward timeout
    vi.runAllTimers();

    // Now in Review Step
    await waitFor(() => {
      expect(screen.getByText(/Confirm & Authenticate/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Confirm & Authenticate/i));

    // In Passkey mock step
    const authSpy = vi.spyOn(transactionService, 'qrPhPayment').mockRejectedValueOnce(
      new Error('QR Ph integration unavailable.')
    );

    fireEvent.click(screen.getByText(/Simulate Passkey Success/i));

    // Restore timers
    vi.useRealTimers();

    await waitFor(() => {
      expect(screen.getByText(/Transfer Failed/i)).toBeInTheDocument();
      expect(screen.getByText(/QR Ph integration unavailable./i)).toBeInTheDocument();
    });

    expect(authSpy).toHaveBeenCalled();
  });
});
