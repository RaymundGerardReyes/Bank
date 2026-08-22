import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AlertTriangle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentResultFailed({
    intent,
    status
}: {
    intent: any;
    status: string;
}) {
    const router = useRouter();

    const isExpired = status === 'EXPIRED';
    const Icon = isExpired ? AlertTriangle : XCircle;
    const title = isExpired ? 'Payment Session Expired' : 'Payment Failed';
    const message = isExpired
        ? 'Your secure checkout session has expired. No funds were deducted.'
        : 'The payment provider declined the transaction or it was cancelled.';

    return (
        <Card className="max-w-md w-full p-8 shadow-lg bg-white text-center border-t-4 border-t-red-500">
            <div className="flex justify-center mb-6">
                <Icon className="text-red-500" size={56} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-500 mb-6">{message}</p>

            <div className="flex flex-col gap-3">
                <Button onClick={() => router.push('/transactions/external-payment')} className="w-full">
                    {isExpired ? 'Start New Payment' : 'Try Again'}
                </Button>
                <Button variant="secondary" onClick={() => router.push('/accounts')} className="w-full">
                    Back to Accounts
                </Button>
            </div>
        </Card>
    );
}