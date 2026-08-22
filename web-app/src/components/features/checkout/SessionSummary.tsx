import { SessionValidationResponse } from '@/services/checkout/checkoutService';
import { formatCurrency } from '@/utils/formatters';
import SessionTimer from './SessionTimer';

interface Props {
    session: SessionValidationResponse;
}

export default function SessionSummary({ session }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Payment Summary</span>
                <SessionTimer expiresAt={session.expiresAt} />
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">Paying to</p>
                    <p className="text-xl font-semibold text-gray-900">{session.institutionName}</p>
                </div>

                <div className="flex justify-between items-end border-t border-gray-100 pt-5 mt-2">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Reference Number</p>
                        <p className="font-mono text-sm font-medium text-gray-900">{session.institutionReference}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                        <p className="text-3xl font-bold text-gray-900 tracking-tight">
                            {formatCurrency(session.amount, session.currency)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}