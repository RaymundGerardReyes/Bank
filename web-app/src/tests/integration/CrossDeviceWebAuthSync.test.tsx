import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PasskeyAuthorization } from '@/components/features/payments/PasskeyAuthorization';
import { transactionService } from '@/services/transaction/transactionService';
import { startAuthentication } from '@simplewebauthn/browser';

vi.mock('@simplewebauthn/browser', () => ({
  startAuthentication: vi.fn(),
}));

vi.mock('@/services/transaction/transactionService', () => ({
  transactionService: {
    createTransactionChallenge: vi.fn(),
    createIntent: vi.fn(),
    createPushRequest: vi.fn(),
    getAuthStatus: vi.fn(),
  },
}));

describe('CrossDeviceWebAuthSync Integration Tests', () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });

    (transactionService.createTransactionChallenge as any).mockResolvedValue({
      challenge: 'test-cryptographic-challenge',
      timeout: 60000,
      rpId: 'localhost',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Path 1: Mobile Push Fallback -> Polling Status PENDING -> AUTHORIZED -> Invokes onSuccess', async () => {
    // 1. Simulate WebAuthn throwing NotAllowedError (user has no desktop passkey / chooses mobile fallback)
    const notAllowedError = new Error('The operation either timed out or was not allowed');
    notAllowedError.name = 'NotAllowedError';
    (startAuthentication as any).mockRejectedValue(notAllowedError);

    // 2. Mock intent creation and push request initiation
    (transactionService.createIntent as any).mockResolvedValue({
      success: true,
      data: { id: 701 },
    });
    (transactionService.createPushRequest as any).mockResolvedValue({
      success: true,
      data: { status: 'PENDING' },
    });

    // 3. Mock polling status progression: PENDING on tick 1, AUTHORIZED on tick 2
    const getAuthStatusMock = transactionService.getAuthStatus as any;
    getAuthStatusMock
      .mockResolvedValueOnce({ success: true, data: { status: 'PENDING' } })
      .mockResolvedValueOnce({ success: true, data: { status: 'AUTHORIZED' } });

    render(
      <PasskeyAuthorization
        amount={1500}
        recipient="NovaBank ••••4321"
        actionDescription="Transfer Funds"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Click "Use Passkey to Authorize"
    const authorizeButton = screen.getByRole('button', { name: /Use Passkey to Authorize/i });
    fireEvent.click(authorizeButton);

    // Verify transition into "Check Your Phone" state with PEER LIVE SYNC badge
    await waitFor(() => {
      expect(screen.getByText(/Check Your Phone/i)).toBeInTheDocument();
      expect(screen.getByText(/PEER LIVE SYNC/i)).toBeInTheDocument();
    });

    expect(transactionService.createIntent).toHaveBeenCalledTimes(1);
    expect(transactionService.createPushRequest).toHaveBeenCalledWith(701, expect.objectContaining({
      amount: 1500,
      destinationAccount: 'NovaBank ••••4321',
    }));

    // Advance 3000ms for Tick 1: PENDING
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    expect(getAuthStatusMock).toHaveBeenCalledTimes(1);
    expect(mockOnSuccess).not.toHaveBeenCalled();

    // Advance another 3000ms for Tick 2: AUTHORIZED
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    expect(getAuthStatusMock).toHaveBeenCalledTimes(2);

    // Verify onSuccess called with verified assertion payload
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnSuccess).toHaveBeenCalledWith(expect.objectContaining({
      id: 'oob-mobile-auth-701',
      response: expect.objectContaining({
        authenticatorData: 'oob-mobile-verified',
        userHandle: 'intent-701',
      }),
    }));
  });

  it('Path 2: Mobile Push Fallback -> Mobile User Denies (DENIED/FAILED) -> Displays Rejection Error', async () => {
    const notAllowedError = new Error('Biometric cancelled');
    notAllowedError.name = 'NotAllowedError';
    (startAuthentication as any).mockRejectedValue(notAllowedError);

    (transactionService.createIntent as any).mockResolvedValue({
      success: true,
      data: { id: 702 },
    });
    (transactionService.createPushRequest as any).mockResolvedValue({
      success: true,
      data: { status: 'PENDING' },
    });

    // Mobile user denies on tick 1
    const getAuthStatusMock = transactionService.getAuthStatus as any;
    getAuthStatusMock.mockResolvedValueOnce({ success: true, data: { status: 'DENIED' } });

    render(
      <PasskeyAuthorization
        amount={2500}
        recipient="NovaBank ••••9999"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Use Passkey to Authorize/i }));

    await waitFor(() => {
      expect(screen.getByText(/Check Your Phone/i)).toBeInTheDocument();
    });

    // Advance 3000ms for polling tick
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });

    expect(getAuthStatusMock).toHaveBeenCalledTimes(1);
    expect(mockOnSuccess).not.toHaveBeenCalled();

    // Verify rejection error is presented and polling halts
    await waitFor(() => {
      expect(screen.getByText(/Transaction authorization was rejected by your mobile device\./i)).toBeInTheDocument();
    });

    // Advance another 10s to ensure polling terminated
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });
    expect(getAuthStatusMock).toHaveBeenCalledTimes(1);
  });

  it('Path 3: Mobile Push Fallback -> 60-Second Polling Expiration -> Displays Timeout Error', async () => {
    const notAllowedError = new Error('Device not found');
    notAllowedError.name = 'NotAllowedError';
    (startAuthentication as any).mockRejectedValue(notAllowedError);

    (transactionService.createIntent as any).mockResolvedValue({
      success: true,
      data: { id: 703 },
    });
    (transactionService.createPushRequest as any).mockResolvedValue({
      success: true,
      data: { status: 'PENDING' },
    });

    // Polling always returns PENDING
    const getAuthStatusMock = transactionService.getAuthStatus as any;
    getAuthStatusMock.mockResolvedValue({ success: true, data: { status: 'PENDING' } });

    render(
      <PasskeyAuthorization
        amount={500}
        recipient="NovaBank ••••1111"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Use Passkey to Authorize/i }));

    await waitFor(() => {
      expect(screen.getByText(/Check Your Phone/i)).toBeInTheDocument();
    });

    // Advance 60 seconds to trigger timeout
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60000);
    });

    // Verify timeout message displayed and onSuccess not called
    await waitFor(() => {
      expect(screen.getByText(/Mobile authorization timed out\./i)).toBeInTheDocument();
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('Path 4: Direct WebAuthn Passkey Hardware Success -> Invokes onSuccess Without Mobile Push', async () => {
    const mockAssertion = {
      id: 'cred-direct-webauthn-123',
      rawId: 'cred-direct-webauthn-123',
      response: {
        authenticatorData: 'auth-data-hardware',
        clientDataJSON: 'client-json-hardware',
        signature: 'valid-sig-hardware',
      },
      type: 'public-key',
    };

    (startAuthentication as any).mockResolvedValue(mockAssertion);

    render(
      <PasskeyAuthorization
        amount={800}
        recipient="NovaBank ••••5555"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Use Passkey to Authorize/i }));

    await waitFor(() => {
      expect(startAuthentication).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).toHaveBeenCalledWith(mockAssertion);
    });

    // Ensure mobile push / intent creation was never called
    expect(transactionService.createIntent).not.toHaveBeenCalled();
    expect(transactionService.createPushRequest).not.toHaveBeenCalled();
  });
});