import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { QrPaymentCard } from '@/components/features/gateway/QrPaymentCard';
import CreateQrPage from '@/app/(portals)/(merchant)/qr-payments/create/page';
import { paymentService } from '@/services/gateway/paymentService';

vi.mock('@/services/gateway/paymentService');

describe('Frontend QR Payment Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // Mock the generic POST that creates the intent
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { intentId: 'intent_123' } })
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('QrPaymentCard (Presentation)', () => {
    it('FE-UNIT-03 & FE-UNIT-05: Countdown initialization and zero bound', () => {
      const futureExpiry = new Date(Date.now() + 2 * 60 * 1000).toISOString(); // 2 mins
      const mockQr = {
          qrReference: 'qr_123',
          paymentIntentId: 'intent_123',
          qrPayload: 'mock-payload',
          status: 'ACTIVE',
          expiresAt: futureExpiry
      };
      
      render(<QrPaymentCard qrPayment={mockQr as any} />);
      
      expect(screen.getByText(/02:00/)).toBeInTheDocument();

      // Wrap timer advancements in act() so React processes the state update
      act(() => {
        vi.advanceTimersByTime(3 * 60 * 1000);
      });
      
      // Timer stops at zero
      expect(screen.getByText(/00:00/)).toBeInTheDocument();
      expect(screen.queryByText(/-01:00/)).not.toBeInTheDocument();
    });
  });

  describe('Create QR Page (Workflow & Polling)', () => {
    it('FE-PATH-02 & FE-PATH-04: Creates intent first, generates QR second', async () => {
      (paymentService.generateQr as any).mockResolvedValue({ 
          success: true, 
          data: { qrReference: 'qr_999', qrPayload: 'mock-qr', expiresAt: new Date().toISOString(), status: 'ACTIVE' } 
      });
      
      render(<CreateQrPage />);
      
      fireEvent.change(screen.getByLabelText(/Amount \(PHP\)/i), { target: { value: '1000' } });
      fireEvent.change(screen.getByLabelText(/Reference/i), { target: { value: 'TEST-123' } });
      fireEvent.click(screen.getByRole('button', { name: /Generate QR/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(paymentService.generateQr).toHaveBeenCalledWith('intent_123'); // From the fetch mock
      });
      
      expect(screen.getAllByText(/QR Ph P2M/i)[0]).toBeInTheDocument();
    });

    it('FE-PATH-09 & FE-PATH-10: Polling terminates on PAID or EXPIRED', async () => {
      (paymentService.generateQr as any).mockResolvedValue({ 
          success: true,
          data: { qrReference: 'qr_123', qrPayload: 'mock-qr', expiresAt: new Date(Date.now() + 15 * 60000).toISOString(), status: 'ACTIVE' } 
      });
      
      const getQrStatusMock = paymentService.getQrStatus as any;
      getQrStatusMock
        .mockResolvedValueOnce({ data: { status: 'SCANNED', expiresAt: new Date().toISOString(), qrPayload: 'mock-qr', qrReference: 'qr_123' } }) // Tick 1
        .mockResolvedValueOnce({ data: { status: 'PENDING', expiresAt: new Date().toISOString(), qrPayload: 'mock-qr', qrReference: 'qr_123' } }) // Tick 2
        .mockResolvedValueOnce({ data: { status: 'PAID', expiresAt: new Date().toISOString(), qrPayload: 'mock-qr', qrReference: 'qr_123' } });   // Tick 3: Terminal

      render(<CreateQrPage />);
      
      fireEvent.change(screen.getByLabelText(/Amount \(PHP\)/i), { target: { value: '500' } });
      fireEvent.change(screen.getByLabelText(/Reference/i), { target: { value: 'TEST-123' } });
      fireEvent.click(screen.getByRole('button', { name: /Generate QR/i }));

      // Wait for initial render to finish
      await waitFor(() => expect(screen.getAllByText(/QR Ph P2M/i)[0]).toBeInTheDocument());

      // Advance 15 seconds (3 ticks of 5000ms)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(15000);
      });

      expect(getQrStatusMock).toHaveBeenCalledTimes(3);
      expect(screen.getAllByText('PAID')[0]).toBeInTheDocument();

      // Advance another 10 seconds to ensure polling stopped
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });
      expect(getQrStatusMock).toHaveBeenCalledTimes(3); // Count remains 3
    });
  });
});
