'use client';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { PasskeyAuthorization } from '@/components/payments/PasskeyAuthorization';
import { CreatePaymentIntentRequest } from '@/models/GatewayModels';
import { paymentService } from '@/services/gateway/paymentService';
import { formatCurrency } from '@/utils/formatters';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ExternalPaymentReviewPage() {
    const router = useRouter();
    const [draft, setDraft] = useState<CreatePaymentIntentRequest | null>(null);
    const [isAuthorizing, setIsAuthorizing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const saved = sessionStorage.getItem('draft_external_payment');
        if (!saved) {
            router.replace('/transactions/external-payment');
        } else {
            setDraft(JSON.parse(saved));
        }
    }, [router]);

    const handlePasskeySuccess = async () => {
        if (!draft) return;
        try {
            const response = await paymentService.createPaymentIntent(draft);
            if (response.success && response.data) {
                // Clear draft and move to redirect stage
                sessionStorage.removeItem('draft_external_payment');
                const { transactionReference, checkoutUrl } = response.data;
                router.push(
                    `/transactions/external-payment/redirect?ref=${transactionReference}&url=${encodeURIComponent(checkoutUrl)}`
                );
            } else {
                setError(response.message || 'Failed to initialize payment gateway.');
                setIsAuthorizing(false);
            }
        } catch (err) {
            setError('An unexpected network error occurred.');
            setIsAuthorizing(false);
        }
    };

    if (!draft) return null;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Review Payment</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                    <AlertCircle className="shrink-0 mt-0.5" size={20} />
                    <p>{error}</p>
                </div>
            )}

            <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold border-b border-gray-100 pb-3 mb-4">Payment Summary</h3>
                <dl className="space-y-4">
                    <div className="flex justify-between">
                        <dt className="text-gray-500">From Account</dt>
                        <dd className="font-medium text-gray-900">{draft.sourceAccountId}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-500">Merchant Reference</dt>
                        <dd className="font-medium text-gray-900">{draft.merchantReference}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-500">Purpose</dt>
                        <dd className="font-medium text-gray-900">{draft.description}</dd>
                    </div>
                    <div className="flex justify-between border-t border-gray-100 pt-4 mt-2">
                        <dt className="text-lg font-medium text-gray-900">Total Amount</dt>
                        <dd className="text-xl font-bold text-blue-600">{formatCurrency(draft.amount, 'PHP')}</dd>
                    </div>
                </dl>
            </Card>

            {!isAuthorizing ? (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button variant="secondary" onClick={() => router.back()} className="w-full sm:w-auto px-8">
                        Back
                    </Button>
                    <Button
                        onClick={() => setIsAuthorizing(true)}
                        className="w-full sm:w-auto px-8 flex items-center gap-2 bg-gray-900 hover:bg-gray-800"
                    >
                        <ShieldCheck size={18} />
                        Continue Securely
                    </Button>
                </div>
            ) : (
                <Card className="p-6 border-blue-100 bg-blue-50/50">
                    <PasskeyAuthorization
                        onSuccess={handlePasskeySuccess}
                        onCancel={() => setIsAuthorizing(false)}
                        actionDescription={`Authorize payment of ${formatCurrency(draft.amount, 'PHP')}`}
                    />
                </Card>
            )}

            <p className="text-center text-sm text-gray-500 mt-8">
                You will be redirected to a secure payment page after authorization.
            </p>
        </div>
    );
}