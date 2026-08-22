'use client';

import { PaymentMethodSelector } from '@/components/features/checkout/PaymentMethodSelector';
import RetryPaymentFlow from '@/components/features/checkout/RetryPaymentFlow';
import SessionSummary from '@/components/features/checkout/SessionSummary';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useCheckoutSession } from '@/hooks/useCheckoutSession';
import { checkoutService, PaymentMethod } from '@/services/checkout/checkoutService';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';

export default function CheckoutPage({ params }: { params: Promise<{ sessionId: string }> }) {
    const resolvedParams = use(params);
    const sessionId = resolvedParams.sessionId;

    const router = useRouter();
    const searchParams = useSearchParams();

    // UX: Determine if we landed here via a processor failure redirect
    const isDeclined = searchParams.get('status') === 'failed' || searchParams.get('declined') === 'true';
    const [isProcessing, setIsProcessing] = useState(false);

    // 1. Initial Validation Load
    const { data: sessionData, isLoading, error } = useQuery({
        queryKey: ['validateSession', sessionId],
        queryFn: () => checkoutService.validateSession(sessionId),
        retry: false
    });

    // 2. Background Polling (Activated when needed via hook configuration)
    const { data: statusData } = useCheckoutSession(sessionId);

    // Propagate routing on terminal states dynamically
    useEffect(() => {
        if (statusData?.status === 'SUCCESS' || statusData?.status === 'EXPIRED') {
            router.replace(`/pay/${sessionId}/result`);
        }
    }, [statusData, router, sessionId]);

    const handleInitiate = async (method: PaymentMethod) => {
        try {
            setIsProcessing(true);
            const response = await checkoutService.initiatePayment(sessionId, method);

            if (response.checkoutUrl) {
                // Handoff to external processor (Paynamics/Maya)
                window.location.href = response.checkoutUrl;
            } else {
                // Bank-hosted instruction screen (OTC/QR)
                router.push(`/pay/${sessionId}/processing`);
            }
        } catch (err) {
            console.error("[CHECKOUT] Failed to initiate method routing:", err);
            // Failsafe routing
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = () => {
        // Optionally map to an explicit cancel endpoint, then exit
        router.replace(`/pay/${sessionId}/result?status=cancelled`);
    };

    if (isLoading) return <LoadingOverlay message="Establishing secure connection..." />;

    if (error || !sessionData?.valid) {
        router.replace(`/pay/${sessionId}/result`);
        return null;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {isDeclined ? (
                // Show specific Retry UI if the previous attempt failed
                <RetryPaymentFlow
                    onRetry={handleInitiate}
                    onCancel={handleCancel}
                    isProcessing={isProcessing}
                />
            ) : (
                // Default Clean Flow
                <>
                    <SessionSummary session={sessionData} />
                    <PaymentMethodSelector onSelect={handleInitiate} isProcessing={isProcessing} />
                </>
            )}

        </div>
    );
}