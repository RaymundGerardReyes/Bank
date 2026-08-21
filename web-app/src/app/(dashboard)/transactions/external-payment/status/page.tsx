'use client';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { formatCurrency } from '@/utils/formatters';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { paymentService } from '@/services/gateway/paymentService';
import { PaymentIntent } from '@/models/GatewayModels';

function StatusContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const intentId = searchParams.get('intentId');

    const [intent, setIntent] = useState<PaymentIntent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pollCount, setPollCount] = useState(0);

    const MAX_POLLS = 20; // Maximum number of polling attempts
    const POLL_INTERVAL = 3000; // 3 seconds

    useEffect(() => {
        if (!intentId) {
            setError('Missing payment reference.');
            setLoading(false);
            return;
        }

        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        const checkStatus = async () => {
            try {
                const response = await paymentService.getPaymentIntent(intentId);
                if (!isMounted) return;

                if (response.success && response.data) {
                    const currentIntent = response.data;
                    setIntent(currentIntent);

                    const status = currentIntent.status;
                    const isTerminal = ['SUCCESS', 'CAPTURED', 'FAILED', 'CANCELLED', 'EXPIRED'].includes(status);

                    if (isTerminal) {
                        setLoading(false);
                    } else if (pollCount < MAX_POLLS) {
                        setPollCount(prev => prev + 1);
                        timeoutId = setTimeout(checkStatus, POLL_INTERVAL);
                    } else {
                        // Max polls reached, stop polling and show pending state
                        setLoading(false);
                    }
                } else {
                    setError(response.message || 'Failed to fetch payment status.');
                    setLoading(false);
                }
            } catch (err: any) {
                if (!isMounted) return;
                // Avoid stopping polling on a single network blip, but limit retries
                if (pollCount < MAX_POLLS) {
                    setPollCount(prev => prev + 1);
                    timeoutId = setTimeout(checkStatus, POLL_INTERVAL);
                } else {
                    setError('A network error occurred while confirming your payment.');
                    setLoading(false);
                }
            }
        };

        checkStatus();

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [intentId, pollCount]);

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-12">
                <Card className="p-8 text-center border-red-100">
                    <div className="flex justify-center mb-6 text-red-500">
                        <AlertCircle size={48} />
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-900">Unable to Verify Payment</h2>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <Button onClick={() => router.push('/transactions/external-payment')} className="w-full">
                        Return to Dashboard
                    </Button>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-md mx-auto mt-12">
                <Card className="p-8 text-center border-gray-100 shadow-sm">
                    <div className="flex justify-center mb-6">
                        <Loader2 className="animate-spin text-blue-600" size={48} />
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-900">Confirming your payment</h2>
                    <p className="text-gray-500 mb-6">
                        We're checking the payment status. Please don't submit the payment again.
                    </p>
                    <div className="bg-blue-50 text-blue-800 text-sm py-2 px-4 rounded-md inline-block">
                        Reference: {intentId}
                    </div>
                </Card>
            </div>
        );
    }

    if (!intent) return null;

    const status = intent.status;
    const isSuccess = status === 'SUCCESS' || status === 'CAPTURED';
    const isFailure = status === 'FAILED' || status === 'CANCELLED' || status === 'EXPIRED';

    return (
        <div className="max-w-md mx-auto mt-12">
            <Card className="p-8 text-center shadow-lg border-gray-100">
                <div className={`flex justify-center mb-6 ${isSuccess ? 'text-green-500' : isFailure ? 'text-red-500' : 'text-orange-500'}`}>
                    {isSuccess ? <CheckCircle2 size={56} /> : isFailure ? <XCircle size={56} /> : <AlertCircle size={56} />}
                </div>

                <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    {isSuccess ? 'Payment Successful' : isFailure ? 'Payment Unsuccessful' : 'Payment Still Confirming'}
                </h2>
                
                <p className="text-gray-500 mb-8">
                    {isSuccess 
                        ? 'Your transaction has been securely completed.' 
                        : isFailure 
                            ? 'Your payment could not be completed.' 
                            : 'Your payment is still being confirmed. We will update your account once resolved. Please do not submit another payment.'}
                </p>

                <div className="bg-gray-50 rounded-lg p-5 mb-8 text-left space-y-3">
                    <div className="flex justify-between border-b border-gray-100 pb-3">
                        <span className="text-gray-500 text-sm">Reference</span>
                        <span className="font-medium text-gray-900 text-sm">{intent.intentId}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-3">
                        <span className="text-gray-500 text-sm">Date</span>
                        <span className="font-medium text-gray-900 text-sm">{new Date(intent.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                        <span className="text-gray-900 font-medium">Amount</span>
                        <span className="font-bold text-gray-900">{formatCurrency(intent.amount, intent.currency)}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    {isFailure && (
                        <Button 
                            variant="secondary"
                            onClick={() => router.push('/transactions/external-payment')} 
                            className="w-full"
                        >
                            Try Again
                        </Button>
                    )}
                    <Button 
                        onClick={() => router.push('/dashboard')} 
                        className="w-full"
                        variant={isFailure ? 'secondary' : 'primary'}
                    >
                        Return to Dashboard
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default function ExternalPaymentStatusPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading status...</div>}>
            <StatusContent />
        </Suspense>
    );
}
