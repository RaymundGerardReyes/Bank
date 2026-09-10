import { render, screen, waitFor } from '@testing-library/react';
import ExternalPaymentStatusPage from '@/app/(dashboard)/transactions/external-payment/status/page';
import { paymentService } from '@/services/gateway/paymentService';
import { useSearchParams } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
    useSearchParams: vi.fn(),
}));

vi.mock('@/services/gateway/paymentService', () => ({
    paymentService: {
        getPaymentIntent: vi.fn(),
    },
}));

describe('ExternalPaymentStatusPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays loading state initially', () => {
        (useSearchParams as any).mockReturnValue({
            get: () => 'PI-123',
        });
        
        // Mock unresolved promise to keep it in loading state
        (paymentService.getPaymentIntent as any).mockReturnValue(new Promise(() => {}));

        render(<ExternalPaymentStatusPage />);
        
        expect(screen.getByText('Confirming your payment')).toBeInTheDocument();
        expect(screen.getByText(/We're checking the payment status/)).toBeInTheDocument();
    });

    it('displays success state when backend returns SUCCESS', async () => {
        (useSearchParams as any).mockReturnValue({
            get: () => 'PI-123',
        });
        
        (paymentService.getPaymentIntent as any).mockResolvedValue({
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
        (useSearchParams as any).mockReturnValue({
            get: () => 'PI-123',
        });
        
        (paymentService.getPaymentIntent as any).mockResolvedValue({
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
