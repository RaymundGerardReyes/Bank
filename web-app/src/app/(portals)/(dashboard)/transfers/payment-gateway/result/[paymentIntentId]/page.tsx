'use client';

import PaymentResultFailed from '@/components/features/payments/PaymentResultFailed';
import PaymentResultProcessing from '@/components/features/payments/PaymentResultProcessing';
import PaymentResultSuccess from '@/components/features/payments/PaymentResultSuccess';
import { usePaymentIntent } from '@/hooks/usePaymentIntent';
import { AlertCircle } from 'lucide-react';
import { use } from 'react';

export default function PaymentResultPage({
    params
}: {
    params: Promise<{ paymentIntentId: string }>
}) {
    // Next.js 15: params must be unwrapped using React.use()
    const { paymentIntentId } = use(params);

    // React Query will automatically poll the backend proxy route
    const { data, isLoading, isError } = usePaymentIntent(paymentIntentId);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <PaymentResultProcessing intentId={paymentIntentId} />
            </div>
        );
    }

    if (isError || !data?.success) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="text-center bg-red-50 p-6 rounded-lg border border-red-200">
                    <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
                    <h2 className="text-lg font-bold text-red-700">Unable to Fetch Status</h2>
                    <p className="text-sm text-red-600 mt-2">
                        We could not retrieve the final status of this transaction. Please check your transaction history.
                    </p>
                </div>
            </div>
        );
    }

    const intent = data.data;

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4 bg-gray-50/50">
            {intent.status === 'SUCCESS' && (
                <PaymentResultSuccess intent={intent} />
            )}

            {['PROCESSING', 'CHECKOUT_CREATED', 'REDIRECTED', 'AUTHORIZED', 'CREATED'].includes(intent.status) && (
                <PaymentResultProcessing intentId={intent.intentId} />
            )}

            {['FAILED', 'CANCELLED', 'EXPIRED'].includes(intent.status) && (
                <PaymentResultFailed intent={intent} status={intent.status} />
            )}
        </div>
    );
}