'use client';

import ExternalPaymentRedirect from '@/components/payments/ExternalPaymentRedirect';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RedirectContent() {
    const searchParams = useSearchParams();
    const txRef = searchParams.get('ref') || 'Processing...';
    const checkoutUrl = searchParams.get('url');

    if (!checkoutUrl) {
        return (
            <div className="p-8 text-center text-red-600">
                Missing checkout URL. Please return to the dashboard.
            </div>
        );
    }

    return (
        <ExternalPaymentRedirect
            transactionReference={txRef}
            checkoutUrl={checkoutUrl}
        />
    );
}

export default function ExternalPaymentRedirectPage() {
    // Wrapping in Suspense is required by Next.js when using useSearchParams()
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading gateway transition...</div>}>
            <RedirectContent />
        </Suspense>
    );
}