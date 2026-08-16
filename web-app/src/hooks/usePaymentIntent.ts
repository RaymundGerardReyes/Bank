import { useQuery } from '@tanstack/react-query';

interface PaymentIntentStatusData {
    id: number;
    intentId: string;
    merchantId: number;
    customerAccountNumber: string;
    amount: number;
    currency: string;
    status: 'CREATED' | 'AUTHORIZED' | 'CHECKOUT_CREATED' | 'REDIRECTED' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
    description: string;
}

interface PaymentIntentResponse {
    success: boolean;
    data: PaymentIntentStatusData;
    message: string;
}

const fetchPaymentIntent = async (id: string): Promise<PaymentIntentResponse> => {
    const response = await fetch(`/api/proxy/payment-intents/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch payment intent status');
    }
    return response.json();
};

export const usePaymentIntent = (intentId: string) => {
    return useQuery({
        queryKey: ['paymentIntent', intentId],
        queryFn: () => fetchPaymentIntent(intentId),
        refetchInterval: (query) => {
            const status = query.state.data?.data?.status;
            // Stop polling if we reach a terminal state
            if (status && ['SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED'].includes(status)) {
                return false;
            }
            return 3000; // Poll every 3 seconds while in PROCESSING or REDIRECTED state
        },
        retry: 5,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff max 10s
        enabled: !!intentId, // Only run if we have an intentId
    });
};