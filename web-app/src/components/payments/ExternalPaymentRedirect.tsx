'use client';

import { Card } from '@/components/common/Card';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';

interface ExternalPaymentRedirectProps {
    transactionReference: string;
    checkoutUrl: string;
}

export default function ExternalPaymentRedirect({
    transactionReference,
    checkoutUrl
}: ExternalPaymentRedirectProps) {

    useEffect(() => {
        // 2-second delay for user reassurance before hard redirect
        const timer = setTimeout(() => {
            window.location.href = checkoutUrl;
        }, 2000);
        return () => clearTimeout(timer);
    }, [checkoutUrl]);

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full p-8 text-center shadow-lg border-gray-100">
                <div className="flex justify-center mb-6 text-blue-600">
                    <ShieldCheck size={48} />
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                    Secure Payment Gateway
                </h2>
                <p className="text-gray-500 mb-8">
                    Redirecting you to complete your transaction...
                </p>

                <div className="flex justify-center mb-8">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                    <p className="font-medium text-gray-800 mb-1">Do not close this window</p>
                    <p>Reference: {transactionReference}</p>
                </div>
            </Card>
        </div>
    );
}