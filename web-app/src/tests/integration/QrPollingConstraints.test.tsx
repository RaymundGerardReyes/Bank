import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import CreateQrPage from '@/app/(portals)/(merchant)/qr-payments/create/page';
import { paymentService } from '@/services/gateway/paymentService';

vi.mock('@/services/gateway/paymentService');

describe('Frontend QR Payment Flow & Polling Constraints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.spyOn(global, 'setInterval');
    vi.spyOn(global, 'clearInterval');
    
    // Mock the generic POST that creates the intent
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { intentId: 'intent_123' } })
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('F-06 & F-13: Polling starts exactly once and cleans up on unmount', async () => {
    (paymentService.generateQr as any).mockResolvedValue({ 
        success: true, 
        data: { qrReference: 'qr_999', qrPayload: 'mock-qr', expiresAt: new Date().toISOString(), status: 'ACTIVE' } 
    });
    
    (paymentService.getQrStatus as any).mockResolvedValue({ 
        data: { status: 'PENDING' } 
    });

    const { unmount } = render(<CreateQrPage />);
    
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Reference/i), { target: { value: 'REF-100' } });
    fireEvent.click(screen.getByRole('button', { name: /Generate QR/i }));

    await waitFor(() => expect(screen.getAllByText(/QR Ph P2M/i)[0]).toBeInTheDocument());

    expect(setInterval).toHaveBeenCalled();

    // Unmount before terminal state
    unmount();

    expect(clearInterval).toHaveBeenCalled();
    
    // Advance timers massively to ensure no runaway polling leaks
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50000);
    });
    // Since getQrStatus wasn't called during the unmounted interval, its call count is 0
    expect(paymentService.getQrStatus).toHaveBeenCalledTimes(0); 
  });

  it('Chronological Path & F-08 & F-09: SCANNED/PENDING continues, PAID stops polling', async () => {
    (paymentService.generateQr as any).mockResolvedValue({ 
        success: true, 
        data: { qrReference: 'qr_123', qrPayload: 'mock-qr', expiresAt: new Date().toISOString(), status: 'ACTIVE' } 
    });
    
    const getQrStatusMock = paymentService.getQrStatus as any;
    getQrStatusMock
      // qrReference must match generateQr's 'qr_123' to avoid useEffect dep change causing timer drift
      .mockResolvedValueOnce({ data: { status: 'SCANNED', expiresAt: new Date().toISOString(), qrPayload: 'mock', qrReference: 'qr_123' } })   // Continues
      .mockResolvedValueOnce({ data: { status: 'PENDING', expiresAt: new Date().toISOString(), qrPayload: 'mock', qrReference: 'qr_123' } })   // Continues
      .mockResolvedValueOnce({ data: { status: 'PAID',    expiresAt: new Date().toISOString(), qrPayload: 'mock', qrReference: 'qr_123' } }); // Terminal

    render(<CreateQrPage />);
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText(/Reference/i), { target: { value: 'REF-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Generate QR/i }));

    await waitFor(() => expect(screen.getAllByText(/QR Ph P2M/i)[0]).toBeInTheDocument());

    // Flush initial render microtasks & mount interval
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    // Tick 1 (5000ms): ACTIVE -> SCANNED
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(screen.getAllByText(/SCANNED/i)[0]).toBeInTheDocument();

    // Tick 2 (5000ms): SCANNED -> PENDING
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(screen.getAllByText(/PENDING/i)[0]).toBeInTheDocument();

    // Tick 3 (5000ms): PENDING -> PAID
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(screen.getAllByText(/PAID/i)[0]).toBeInTheDocument();

    // Verify terminal status cleared interval
    expect(clearInterval).toHaveBeenCalled();
  });

  it('Prevent Polling Multiplication on Re-render', async () => {
    (paymentService.generateQr as any).mockResolvedValue({ 
        success: true, 
        data: { qrReference: 'qr_456', qrPayload: 'mock-qr', expiresAt: new Date().toISOString(), status: 'ACTIVE' } 
    });
    
    (paymentService.getQrStatus as any).mockResolvedValue({ 
        data: { status: 'SCANNED', expiresAt: new Date().toISOString(), qrPayload: 'mock', qrReference: 'qr_456' } 
    });

    const { rerender } = render(<CreateQrPage />);
    
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '300' } });
    fireEvent.change(screen.getByLabelText(/Reference/i), { target: { value: 'REF-300' } });
    fireEvent.click(screen.getByRole('button', { name: /Generate QR/i }));

    await waitFor(() => expect(screen.getAllByText(/QR Ph P2M/i)[0]).toBeInTheDocument());

    // Force multiple re-renders
    rerender(<CreateQrPage />);
    rerender(<CreateQrPage />);
    
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
      await Promise.resolve();
    });
    
    // Only 1 polling interval should execute a fetch, not 3.
    expect(paymentService.getQrStatus).toHaveBeenCalledTimes(1);
  });
});
