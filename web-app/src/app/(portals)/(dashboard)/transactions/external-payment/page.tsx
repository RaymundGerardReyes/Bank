'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAccounts } from '@/hooks/useAccounts';
import { formatCurrency } from '@/utils/formatters';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ExternalPaymentInitiationPage() {
  const router = useRouter();
  const { data: accounts, isLoading } = useAccounts();
  const [formData, setFormData] = useState({
    sourceAccountId: '',
    merchantReference: '',
    amount: '',
    description: ''
  });

  const activeAccounts = accounts?.filter((a: any) => a.status === 'ACTIVE') || [];

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Save draft state to session storage to pass to Review page
    sessionStorage.setItem('draft_external_payment', JSON.stringify({
      ...formData,
      amount: parseFloat(formData.amount)
    }));
    router.push('/transactions/external-payment/review');
  };

  if (isLoading) return <div className="p-8 text-center">Loading accounts...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">External Gateway Payment</h1>

      <Card className="p-6">
        <form onSubmit={handleContinue} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pay From Account</label>
            <select
              required
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border"
              value={formData.sourceAccountId}
              onChange={(e) => setFormData({ ...formData, sourceAccountId: e.target.value })}
            >
              <option value="">Select an account...</option>
              {activeAccounts.map((acc: any) => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountName} - {acc.accountNumber} ({formatCurrency(acc.balance, acc.currency)})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Merchant / Payee Reference"
            required
            placeholder="e.g., INV-2026-001"
            value={formData.merchantReference}
            onChange={(e) => setFormData({ ...formData, merchantReference: e.target.value })}
          />

          <Input
            label="Amount (PHP)"
            type="number"
            min="1"
            step="0.01"
            required
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />

          <Input
            label="Payment Purpose"
            required
            placeholder="e.g., Monthly Subscription"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" className="px-8">
              Continue to Review →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}