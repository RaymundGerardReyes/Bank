'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAccounts } from '@/hooks/useAccounts';
import { paymentService } from '@/services/gateway/paymentService';
import ExternalPaymentRedirect from '@/components/features/payments/ExternalPaymentRedirect';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/utils/formatters';
import { useRouter } from 'next/navigation';

// 1. Define strict Zod schema for external payment payload
const externalPaymentSchema = z.object({
  sourceAccountId: z.string().min(1, 'Source account is required'),
  merchantReference: z.string().min(1, 'Merchant reference is required'),
  amount: z.number({ invalid_type_error: 'Amount must be a positive number' }).positive('Amount must be greater than zero'),
  description: z.string().min(1, 'Payment purpose is required'),
});

type ExternalPaymentFormData = z.infer<typeof externalPaymentSchema>;

export default function ExternalPaymentInitiationPage() {
  const router = useRouter();
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();
  const [step, setStep] = useState<'FORM' | 'REVIEW' | 'REDIRECT'>('FORM');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<{ url: string; ref: string } | null>(null);

  const activeAccounts = accounts?.filter((a: any) => a.status === 'ACTIVE') || [];

  // 2. Initialize React Hook Form with Zod schema resolver
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ExternalPaymentFormData>({
    resolver: zodResolver(externalPaymentSchema),
    defaultValues: {
      sourceAccountId: '',
      merchantReference: '',
      amount: 0,
      description: '',
    },
  });

  // 3. Step 1 -> Step 2: Form submission safely transitions to Review
  const onProceedToReview = (data: ExternalPaymentFormData) => {
    setServerError(null);
    const draftData = {
      ...data,
      idempotencyKey: crypto.randomUUID()
    };
    sessionStorage.setItem('draft_external_payment', JSON.stringify(draftData));
    setStep('REVIEW');
  };

  // 4. Step 2 -> Step 3: Final confirmation sends data to hardened backend
  const handleConfirmPayment = async () => {
    setIsLoading(true);
    setServerError(null);

    try {
      const savedDraft = JSON.parse(sessionStorage.getItem('draft_external_payment') || '{}');
      const payload = getValues();
      
      const response = await paymentService.createPaymentIntent({
        sourceAccountId: payload.sourceAccountId,
        merchantReference: payload.merchantReference,
        amount: payload.amount,
        description: payload.description,
        idempotencyKey: savedDraft.idempotencyKey // Reuses the same key across retries
      });

      if (response.success && response.data) {
        setCheckoutData({
          url: response.data.checkoutUrl,
          ref: response.data.transactionReference || response.data.paymentIntentId,
        });
        sessionStorage.removeItem('draft_external_payment');
        setStep('REDIRECT');
      } else {
        setServerError(response.message || 'Failed to initiate payment.');
      }
    } catch (err: any) {
      setServerError(err.message || 'An unexpected network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAccountsLoading) return <div className="p-8 text-center text-gray-500">Loading accounts...</div>;

  // RENDER: REDIRECT STEP
  if (step === 'REDIRECT' && checkoutData) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <ExternalPaymentRedirect
          transactionReference={checkoutData.ref}
          checkoutUrl={checkoutData.url}
        />
      </div>
    );
  }

  // RENDER: FORM & REVIEW STEPS
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {step === 'FORM' ? 'External Gateway Payment' : 'Review Transfer Details'}
      </h1>

      <Card className="p-6">
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {serverError}
          </div>
        )}

        {step === 'FORM' ? (
          <form onSubmit={handleSubmit(onProceedToReview)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pay From Account</label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border text-sm"
                {...register('sourceAccountId')}
              >
                <option value="">Select an account...</option>
                {activeAccounts.map((acc: any) => (
                  <option key={acc.id} value={acc.accountNumber}>
                    {acc.accountName} - {acc.accountNumber} ({formatCurrency(acc.balance, acc.currency)})
                  </option>
                ))}
              </select>
              {errors.sourceAccountId && (
                <p className="text-red-500 text-xs mt-1">{errors.sourceAccountId.message}</p>
              )}
            </div>

            <div>
              <Input
                label="Merchant / Payee Reference"
                placeholder="e.g., INV-2026-001"
                {...register('merchantReference')}
              />
              {errors.merchantReference && (
                <p className="text-red-500 text-xs mt-1">{errors.merchantReference.message}</p>
              )}
            </div>

            <div>
              <Input
                label="Amount (PHP)"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <Input
                label="Payment Purpose"
                placeholder="e.g., Monthly Subscription"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button type="submit" className="px-8">
                Proceed to Review →
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-600 text-sm">Please confirm your payment details before proceeding to the secure gateway.</p>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Source Account:</span>
                <span className="font-semibold text-gray-900">{getValues('sourceAccountId')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Merchant Reference:</span>
                <span className="font-semibold text-gray-900">{getValues('merchantReference')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Purpose:</span>
                <span className="font-semibold text-gray-900">{getValues('description')}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="text-gray-900 font-bold">Total Amount:</span>
                <span className="text-blue-600 font-bold text-lg">{formatCurrency(getValues('amount'), 'PHP')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setStep('FORM')} disabled={isLoading}>
                Back to Edit
              </Button>
              <Button onClick={handleConfirmPayment} isLoading={isLoading}>
                Confirm & Pay
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}