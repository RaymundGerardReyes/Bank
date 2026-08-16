import { PaymentMethod } from '@/services/checkout/checkoutService';
import { AlertCircle, Building2, CreditCard, Smartphone, XCircle } from 'lucide-react';

interface Props {
    onRetry: (method: PaymentMethod) => void;
    onCancel: () => void;
    isProcessing: boolean;
}

export default function RetryPaymentFlow({ onRetry, onCancel, isProcessing }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden animate-in fade-in zoom-in duration-300">

            {/* Decline Header */}
            <div className="bg-red-50 p-8 flex flex-col items-center border-b border-red-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-5 shadow-sm">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment method declined</h2>
                <p className="text-sm text-red-800 font-medium bg-red-100/50 px-3 py-1 rounded-md">
                    No funds were deducted.
                </p>
            </div>

            {/* Retry Options */}
            <div className="p-6 space-y-4">
                <h3 className="font-medium text-gray-900 mb-4 text-center">Would you like to try another method?</h3>

                <button
                    onClick={() => onRetry('EWALLET')}
                    disabled={isProcessing}
                    className="w-full flex items-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                    <Smartphone className="w-6 h-6 text-blue-600 mr-4" />
                    <span className="font-medium text-gray-900">E-Wallet / QR</span>
                </button>

                <button
                    onClick={() => onRetry('ONLINE_BANKING')}
                    disabled={isProcessing}
                    className="w-full flex items-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                    <Building2 className="w-6 h-6 text-blue-600 mr-4" />
                    <span className="font-medium text-gray-900">Online Banking</span>
                </button>

                <button
                    onClick={() => onRetry('CARD')}
                    disabled={isProcessing}
                    className="w-full flex items-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                    <CreditCard className="w-6 h-6 text-blue-600 mr-4" />
                    <span className="font-medium text-gray-900">Credit / Debit Card</span>
                </button>

                {/* Cancel Action */}
                <div className="pt-5 border-t border-gray-100 mt-4">
                    <button
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center p-4 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        <XCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Cancel Payment</span>
                    </button>
                </div>
            </div>
        </div>
    );
}