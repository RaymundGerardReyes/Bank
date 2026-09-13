import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { PaymentMethodSelector } from '@/components/features/checkout/PaymentMethodSelector';
import { checkoutService } from '@/services/checkout/checkoutService';

vi.mock('@/services/checkout/checkoutService', () => ({
  checkoutService: {
    selectPaymentMethod: vi.fn(),
  },
}));

describe('PaymentMethodSelector Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders both Nova Bank Account and QR Ph options by default', () => {
    render(<PaymentMethodSelector sessionId="cs_test_123" />);

    expect(screen.getByText(/Select a Payment Method/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pay with Nova Bank Account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pay with QR Ph/i })).toBeInTheDocument();
  });

  it('calls checkoutService.selectPaymentMethod with QR_PH when QR Ph button is clicked', async () => {
    (checkoutService.selectPaymentMethod as any).mockResolvedValue({
      success: true,
      data: { status: 'PAYMENT_PENDING' },
    });
    const onMethodSelectedMock = vi.fn();

    render(
      <PaymentMethodSelector
        sessionId="cs_test_123"
        onMethodSelected={onMethodSelectedMock}
      />
    );

    const qrPhButton = screen.getByRole('button', { name: /Pay with QR Ph/i });
    fireEvent.click(qrPhButton);

    await waitFor(() => {
      expect(checkoutService.selectPaymentMethod).toHaveBeenCalledWith('cs_test_123', {
        paymentMethod: 'QR_PH',
      });
      expect(onMethodSelectedMock).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onSelect prop directly when provided instead of invoking checkoutService', async () => {
    const onSelectMock = vi.fn();

    render(<PaymentMethodSelector onSelect={onSelectMock} />);

    const qrPhButton = screen.getByRole('button', { name: /Pay with QR Ph/i });
    fireEvent.click(qrPhButton);

    expect(onSelectMock).toHaveBeenCalledWith('QR_PH');
    expect(checkoutService.selectPaymentMethod).not.toHaveBeenCalled();
  });

  it('renders only QR Ph when availableMethods specifies only QR_PH', () => {
    render(
      <PaymentMethodSelector
        sessionId="cs_test_123"
        availableMethods={['QR_PH']}
      />
    );

    expect(screen.getByRole('button', { name: /Pay with QR Ph/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Pay with Nova Bank Account/i })).not.toBeInTheDocument();
  });

  it('renders only Nova Bank Account when availableMethods specifies only INTERNAL_ACCOUNT', () => {
    render(
      <PaymentMethodSelector
        sessionId="cs_test_123"
        availableMethods={['INTERNAL_ACCOUNT']}
      />
    );

    expect(screen.getByRole('button', { name: /Pay with Nova Bank Account/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Pay with QR Ph/i })).not.toBeInTheDocument();
  });

  it('renders fallback message when availableMethods is empty', () => {
    render(
      <PaymentMethodSelector
        sessionId="cs_test_123"
        availableMethods={[]}
      />
    );

    expect(screen.getByText(/No payment methods available for this session/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Pay with Nova Bank Account/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Pay with QR Ph/i })).not.toBeInTheDocument();
  });

  it('displays error message when selecting a payment method fails', async () => {
    (checkoutService.selectPaymentMethod as any).mockRejectedValue(new Error('Network error selecting method'));

    render(<PaymentMethodSelector sessionId="cs_test_123" />);

    const qrPhButton = screen.getByRole('button', { name: /Pay with QR Ph/i });
    fireEvent.click(qrPhButton);

    await waitFor(() => {
      expect(screen.getByText(/Network error selecting method/i)).toBeInTheDocument();
    });
  });
});

