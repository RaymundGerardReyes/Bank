import { useQuery } from '@tanstack/react-query';
import { checkoutService, PaymentSessionStatusResponse } from '../services/checkout/checkoutService';

/**
 * Custom hook to monitor the state of a PaymentSession.
 * It strictly enforces polling every 3 seconds ONLY while the session
 * is in the "PROCESSING" state, terminating automatically upon SUCCESS or FAILED.
 */
export const useCheckoutSession = (sessionId: string) => {
    return useQuery<PaymentSessionStatusResponse, Error>({
        queryKey: ['checkoutSessionStatus', sessionId],
        queryFn: () => checkoutService.getSessionStatus(sessionId),
        enabled: !!sessionId,

        // React Query v5 syntax: evaluates the current data to determine refetch interval dynamically
        refetchInterval: (query) => {
            const status = query.state?.data?.status;

            if (status === 'PROCESSING') {
                return 3000; // Poll every 3 seconds
            }

            return false; // Stop polling on any other state (SUCCESS, FAILED, EXPIRED, ACTIVE)
        },

        // Keep polling even if the user temporarily switches tabs
        refetchIntervalInBackground: true,
    });
};