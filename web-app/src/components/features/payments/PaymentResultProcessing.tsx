import { Card } from '@/components/ui/Card';
import { Loader2 } from 'lucide-react';

export default function PaymentResultProcessing({ intentId }: { intentId: string }) {
    return (
        <Card className="max-w-md w-full p-8 shadow-lg bg-white text-center border-t-4 border-t-blue-500">
            <div className="flex justify-center mb-6">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Processing</h2>
            <p className="text-gray-500 mb-6">
                We are waiting for final confirmation from the payment provider. This usually takes just a few seconds.
            </p>
            <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 text-sm text-yellow-800">
                <p className="font-medium">Please do not submit the payment again or close this window.</p>
                <p className="mt-2 text-xs text-yellow-600 font-mono">Trace ID: {intentId}</p>
            </div>
        </Card>
    );
}