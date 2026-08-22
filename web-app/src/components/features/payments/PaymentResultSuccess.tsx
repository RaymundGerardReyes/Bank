import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatters';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentResultSuccess({ intent }: { intent: any }) {
    const router = useRouter();

    return (
        <Card className="max-w-md w-full p-8 shadow-xl bg-white text-center border-t-4 border-t-green-500">
            <div className="flex justify-center mb-6">
                <CheckCircle2 className="text-green-500" size={64} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful</h2>
            <p className="text-gray-500 mb-6">Your transaction has been securely processed and settled.</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Reference</span>
                    <span className="font-medium text-gray-900">{intent.intentId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Amount Paid</span>
                    <span className="font-bold text-green-600">
                        {formatCurrency(intent.amount, intent.currency)}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <Button onClick={() => router.push('/transactions/history')} className="w-full">
                    View Transaction History
                </Button>
                <Button variant="secondary" onClick={() => router.push('/accounts')} className="w-full">
                    Done
                </Button>
            </div>
        </Card>
    );
}