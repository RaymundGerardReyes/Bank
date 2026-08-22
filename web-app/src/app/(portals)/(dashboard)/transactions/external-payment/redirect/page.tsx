import { redirect } from 'next/navigation';

export default function ExternalPaymentRedirectPage() {
    // This route is disabled to prevent open-redirect vulnerabilities.
    // The redirect logic is now handled securely within the review page itself.
    redirect('/transactions/external-payment');
}