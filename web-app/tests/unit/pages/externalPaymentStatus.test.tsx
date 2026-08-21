import { render, screen, waitFor } from '@testing-library/react';
import ExternalPaymentStatusPage from '@/app/(dashboard)/transactions/external-payment/status/page';
import { paymentService } from '@/services/gateway/paymentService';
import { useSearchParams } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
    useSearchParams: jest.fn(),
}));

jest.mock('@/services/gateway/paymentService', () => ({
    paymentService: {
        getPaymentIntent: jest.fn(),
    },
}));

describe('ExternalPaymentStatusPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('displays loading state initially', () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: () => 'PI-123',
        });
        
        // Mock unresolved promise to keep it in loading state
        (paymentService.getPaymentIntent as jest.Mock).mockReturnValue(new Promise(() => {}));

        render(<ExternalPaymentStatusPage />);
        
        expect(screen.getByText('Confirming your payment')).toBeInTheDocument();
        expect(screen.getByText(/We're checking the payment status/)).toBeInTheDocument();
    });

    it('displays success state when backend returns SUCCESS', async () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: () => 'PI-123',
        });
        
        (paymentService.getPaymentIntent as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                intentId: 'PI-123',
                status: 'SUCCESS',
                amount: 150.0,
                currency: 'PHP',
                createdAt: new Date().toISOString(),
            }
        });

        render(<ExternalPaymentStatusPage />);
        
        await waitFor(() => {
            expect(screen.getByText('Payment Successful')).toBeInTheDocument();
            expect(screen.getByText('Your transaction has been securely completed.')).toBeInTheDocument();
        });
    });

    it('displays failure state when backend returns FAILED', async () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: () => 'PI-123',
        });
        
        (paymentService.getPaymentIntent as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                intentId: 'PI-123',
                status: 'FAILED',
                amount: 150.0,
                currency: 'PHP',
                createdAt: new Date().toISOString(),
            }
        });

        render(<ExternalPaymentStatusPage />);
        
        await waitFor(() => {
            expect(screen.getByText('Payment Unsuccessful')).toBeInTheDocument();
        });
    });
});
