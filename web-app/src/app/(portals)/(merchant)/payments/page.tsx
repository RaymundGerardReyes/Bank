'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MoneyDisplay } from '@/components/features/gateway/MoneyDisplay';
import { paymentService } from '@/services/gateway/paymentService';
import { CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

interface PageProps {
  params: Promise<{ intentId?: string }>;
}

export default function PaymentCheckoutPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const intentId = resolvedParams?.intentId || 'PI-DEFAULT';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [intentData, setIntentData] = useState<any>(null); // Replace 'any' with your PaymentIntent model

  useEffect(() => {
    setIntentData({
      id: intentId,
      amount: 1500.00,
      currency: 'PHP',
      merchantName: 'Acme Corp Electronics',
      description: 'Order #10294 - Wireless Headphones'
    });
  }, [intentId]);

  const handleProceedToCheckout = async () => {
    setIsLoading(true);
    try {
      // 1. Build the request mapped to the Phase 3 backend DTO
      const requestPayload = {
        paymentIntentId: intentId,
        amount: intentData.amount,
        currency: intentData.currency,
        description: intentData.description,
        customerReference: 'CUST-98765',
        successUrl: `${window.location.origin}/payments/${intentId}/success`,
        failUrl: `${window.location.origin}/payments/${intentId}/error`,
        cancelUrl: `${window.location.origin}/payments/${intentId}`,
        merchantOrderId: `ORD-${Math.floor(Math.random() * 10000)}`
      };

      // 2. Call our generic gateway service
      const response = await paymentService.createCheckoutSession(intentId, requestPayload);

      // 3. Redirect seamlessly to the provider's hosted checkout (e.g., Paynamics)
      if (response.success && response.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        alert('Failed to generate checkout session. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An unexpected error occurred connecting to the payment gateway.');
      setIsLoading(false);
    }
  };

  if (!intentData) return <div className="p-8 text-center">Loading payment details...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 shadow-xl bg-white rounded-2xl border border-gray-100">

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="bg-blue-50 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Secure Checkout</h1>
          <p className="text-sm text-gray-500">{intentData.merchantName}</p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Total Amount</span>
            <MoneyDisplay
              amount={intentData.amount}
              currency={intentData.currency}
              className="text-2xl font-bold text-gray-900"
            />
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              <span className="font-semibold text-gray-800">Ref:</span> {intentData.description}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleProceedToCheckout}
          disabled={isLoading}
          className="w-full h-14 text-lg bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center gap-2 rounded-xl transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Connecting to Gateway...
            </>
          ) : (
            <>
              <CreditCard size={24} />
              Pay {intentData.currency} {intentData.amount.toFixed(2)}
            </>
          )}
        </Button>

        {/* Footer Trust Badges */}
        <div className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
          <span>Powered by our Secure Gateway Network</span>
        </div>
      </Card>
    </div>
  );
}