import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { QrPhCheckoutView } from '@/components/features/checkout/QrPhCheckoutView';
import { checkoutService } from '@/services/checkout/checkoutService';

vi.mock('@/services/checkout/checkoutService', () => ({
  checkoutService: {
    simulateQrPayment: vi.fn(),
  },
}));

describe('QrPhCheckoutView Component', () => {
  const baseSession = {
    id: 'cs_test_9999',
    status: 'PAYMENT_PENDING',
    amount: 1500.0,
    currency: 'PHP',
    description: 'Order Payment #1234',
    merchantName: 'Nova Merchant Store',
    paymentMethods: ['INTERNAL_ACCOUNT', 'QR_PH'],
    selectedPaymentMethod: 'QR_PH',
    qrReference: 'QR-PH-SAMPLE-REF',
    qrPayload: '000201010212...SAMPLE_PAYLOAD',
    qrExpiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders QR Ph presentation elements correctly', () => {
    render(
      <QrPhCheckoutView
        sessionId="cs_test_9999"
        session={baseSession as any}
        onPaid={vi.fn()}
      />
    );

    expect(screen.getByText(/QR Ph National Standard/i)).toBeInTheDocument();
    expect(screen.getByText(/Scan & Pay with Any Banking App/i)).toBeInTheDocument();
    expect(screen.getByText(/QR-PH-SAMPLE-REF/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Simulate scanning and completing payment/i })).toBeInTheDocument();
  });

  it('advances timer countdown and stops at 00:00 without negative values', () => {
    render(
      <QrPhCheckoutView
        sessionId="cs_test_9999"
        session={baseSession as any}
        onPaid={vi.fn()}
      />
    );

    expect(screen.getByText(/09:59|10:00/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(11 * 60 * 1000);
    });

    expect(screen.getByText(/00:00/)).toBeInTheDocument();
    expect(screen.queryByText(/-01:00/)).not.toBeInTheDocument();
  });

  it('triggers simulation API and invokes onPaid upon successful simulated scan and pay', async () => {
    (checkoutService.simulateQrPayment as any).mockResolvedValue({
      success: true,
      data: { status: 'PAID' },
    });
    const onPaidMock = vi.fn();

    render(
      <QrPhCheckoutView
        sessionId="cs_test_9999"
        session={baseSession as any}
        onPaid={onPaidMock}
      />
    );

    const simulateBtn = screen.getByRole('button', { name: /Simulate scanning and completing payment/i });
    fireEvent.click(simulateBtn);

    await waitFor(() => {
      expect(checkoutService.simulateQrPayment).toHaveBeenCalledWith('cs_test_9999');
      expect(onPaidMock).toHaveBeenCalledTimes(1);
    });
  });

  it('allows user to click Change Payment Method when onChangeMethod is provided', () => {
    const onChangeMethodMock = vi.fn();

    render(
      <QrPhCheckoutView
        sessionId="cs_test_9999"
        session={baseSession as any}
        onPaid={vi.fn()}
        onChangeMethod={onChangeMethodMock}
      />
    );

    const changeBtn = screen.getByText(/Change payment method/i);
    fireEvent.click(changeBtn);

    expect(onChangeMethodMock).toHaveBeenCalledTimes(1);
  });

  it('correctly parses LocalDateTime strings without trailing Z without falsely expiring', () => {
    // Simulating Spring Boot LocalDateTime serialization without 'Z'
    const futureDate = new Date(Date.now() + 15 * 60 * 1000);
    const isoWithoutZ = futureDate.toISOString().replace('Z', '');

    const sessionWithIsoWithoutZ = {
      ...baseSession,
      qrExpiresAt: isoWithoutZ,
    };

    render(
      <QrPhCheckoutView
        sessionId="cs_test_9999"
        session={sessionWithIsoWithoutZ as any}
        onPaid={vi.fn()}
      />
    );

    // Should display ~15:00 countdown and NOT show the expired message
    expect(screen.queryByText(/QR code has expired/i)).not.toBeInTheDocument();
    expect(screen.getByText(/14:59|15:00/)).toBeInTheDocument();
  });

  it('renders download QR button when payload is present and handles download click', () => {
    const downloadMock = vi.fn();
    HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mockPngData');

    render(
      <QrPhCheckoutView
        sessionId="cs_test_9999"
        session={baseSession as any}
        onPaid={vi.fn()}
      />
    );

    const downloadBtn = screen.getByRole('button', { name: /Download QR code as PNG/i });
    expect(downloadBtn).toBeInTheDocument();
    fireEvent.click(downloadBtn);
  });
});

