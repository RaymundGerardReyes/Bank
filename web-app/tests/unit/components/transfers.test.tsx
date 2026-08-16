import BankTransferPage from '@/app/(dashboard)/transfers/bank/page';
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
    externalPayment: vi.fn(),
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

describe('BankTransferPage State Machine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillOutForm = () => {
    fireEvent.change(screen.getByLabelText(/Recipient Bank/i), { target: { value: '010101010' } });
    fireEvent.change(screen.getByLabelText(/Account Number/i), { target: { value: '987654321' } });
    fireEvent.change(screen.getByLabelText(/Recipient Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } });
    fireEvent.click(screen.getByText(/Review Transfer/i));
  };

  it('should transition to FAILED on backend validation failure (e.g. 400 Bad Request)', async () => {
    render(<BankTransferPage />);
    fillOutForm();

    // In Review step
    fireEvent.click(screen.getByText(/Confirm & Authenticate/i));

    // In Passkey mock step
    const authSpy = vi.spyOn(transactionService, 'externalPayment').mockResolvedValueOnce({
      success: false,
      message: 'Insufficient funds for transfer.',
      error: 'INSUFFICIENT_FUNDS'
    } as any);

    fireEvent.click(screen.getByText(/Simulate Passkey Success/i));

    await waitFor(() => {
      expect(screen.getByText(/Transfer Failed/i)).toBeInTheDocument();
      expect(screen.getByText(/Insufficient funds for transfer./i)).toBeInTheDocument();
    });

    expect(authSpy).toHaveBeenCalled();
  });

  it('should allow user to cancel authentication without failing the transaction', () => {
    render(<BankTransferPage />);
    fillOutForm();

    // In Review step
    fireEvent.click(screen.getByText(/Confirm & Authenticate/i));

    // In Passkey mock step, click Cancel instead of Success
    fireEvent.click(screen.getByText(/Cancel/i));

    // Should return to FORM step safely
    expect(screen.getByText(/Review Transfer/i)).toBeInTheDocument();
    expect(transactionService.externalPayment).not.toHaveBeenCalled();
  });

  it('should transition to SUCCESS on successful completion', async () => {
    render(<BankTransferPage />);
    fillOutForm();

    fireEvent.click(screen.getByText(/Confirm & Authenticate/i));

    const authSpy = vi.spyOn(transactionService, 'externalPayment').mockResolvedValueOnce({
      success: true,
      data: {
        status: 'SUCCESS',
        transactionReference: 'TXN-001',
      }
    } as any);

    fireEvent.click(screen.getByText(/Simulate Passkey Success/i));

    await waitFor(() => {
      expect(screen.getByText(/Transaction Successful/i)).toBeInTheDocument();
      expect(screen.getByText(/TXN-001/i)).toBeInTheDocument();
    });

    expect(authSpy).toHaveBeenCalled();
  });
});
