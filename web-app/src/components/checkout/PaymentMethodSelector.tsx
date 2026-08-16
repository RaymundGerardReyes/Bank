import { PaymentMethod } from '@/services/checkout/checkoutService';
import { Building2, CreditCard, Smartphone, Wallet } from 'lucide-react';

interface Props {
    onSelect: (method: PaymentMethod) => void;
    isProcessing: boolean;
}

export default function PaymentMethodSelector({ onSelect, isProcessing }: Props) {
    const methods = [
        { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, Mastercard, JCB' },
        { id: 'EWALLET', label: 'E-Wallet / QR', icon: Smartphone, description: 'GCash, Maya, GrabPay' },
        { id: 'ONLINE_BANKING', label: 'Online Banking', icon: Building2, description: 'BPI, UnionBank, BDO' },
        { id: 'CASH_OTC', label: 'Cash / OTC', icon: Wallet, description: '7-Eleven, Cebuana, MLhuillier' },
    ] as const;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Select Payment Method</h3>
            <div className="space-y-3">
                {methods.map((m) => {
                    const Icon = m.icon;
                    return (
                        <button
                            key={m.id}
                            onClick={() => onSelect(m.id as PaymentMethod)}
                            disabled={isProcessing}
                            className="w-full group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none text-left"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:border-blue-200 transition-colors">
                                    <Icon className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{m.label}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
                                </div>
                            </div>

                            {/* Custom Radio Button Indicator */}
                            <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-blue-500 flex items-center justify-center transition-colors">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}