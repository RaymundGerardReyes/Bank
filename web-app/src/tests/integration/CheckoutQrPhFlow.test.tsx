import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { CheckoutOrchestrator } from '@/components/features/checkout/CheckoutOrchestrator';
import { checkoutService } from '@/services/checkout/checkoutService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/services/checkout/checkoutService');

describe('Checkout QR Ph Integration Flow', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('navigates from ACTIVE state with QR Ph option -> PAYMENT_PENDING with QrPhCheckoutView -> PAID', async () => {
    const activeSession = {
      id: 'cs_live_integration_123',
      status: 'ACTIVE',
      merchantName: 'Metro Merchant Inc.',
      amount: 2500.0,
      currency: 'PHP',
      description: 'Invoice #9876',
      paymentMethods: ['INTERNAL_ACCOUNT', 'QR_PH'],
      locked: false,
    };

    const pendingQrSession = {
      ...activeSession,
      status: 'PAYMENT_PENDING',
      selectedPaymentMethod: 'QR_PH',
      qrReference: 'QR-PH-INT-999',
      qrPayload: '000201010212...SAMPLE',
      qrExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };

    const paidSession = {
      ...pendingQrSession,
      status: 'PAID',
      locked: true,
    };

    // 1. Initial load returns ACTIVE session
    (checkoutService.getSessionDetails as any).mockResolvedValueOnce({
      success: true,
      data: activeSession,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CheckoutOrchestrator sessionId="cs_live_integration_123" />
      </QueryClientProvider>
    );

    // Verify ACTIVE state renders both options
    await waitFor(() => {
      expect(screen.getByText(/Select a Payment Method/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Pay with QR Ph/i })).toBeInTheDocument();
    });

    // 2. Mock method selection returning PAYMENT_PENDING
    (checkoutService.selectPaymentMethod as any).mockResolvedValueOnce({
      success: true,
      data: { status: 'PAYMENT_PENDING' },
    });
    (checkoutService.getSessionDetails as any).mockResolvedValueOnce({
      success: true,
      data: pendingQrSession,
    });

    // Click QR Ph
    fireEvent.click(screen.getByRole('button', { name: /Pay with QR Ph/i }));

    // Verify transitions to QR Ph presentation
    await waitFor(() => {
      expect(screen.getByText(/Scan & Pay with Any Banking App/i)).toBeInTheDocument();
      expect(screen.getByText(/QR-PH-INT-999/i)).toBeInTheDocument();
    });

    // 3. Simulate QR scan and payment confirmation
    (checkoutService.simulateQrPayment as any).mockResolvedValueOnce({
      success: true,
      data: { status: 'PAID' },
    });
    (checkoutService.getSessionDetails as any).mockResolvedValueOnce({
      success: true,
      data: paidSession,
    });

    fireEvent.click(screen.getByRole('button', { name: /Simulate scanning and completing payment/i }));

    // Verify transitions to PAID terminal state
    await waitFor(() => {
      expect(screen.getByText(/Payment completed successfully/i)).toBeInTheDocument();
    });
  });
});

