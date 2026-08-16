"use client";

import React, { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { transactionService } from "@/services/transaction/transactionService";
import { idempotencyKeyService } from "@/services/transaction/idempotencyKeyService";

export default function WithdrawPage() {
  const [sourceAccount, setSourceAccount] = useState("1001987654");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setError("");

    const parsedAmount = parseFloat(amount);
    const cleanAccount = sourceAccount.replace(/\s/g, '');
    if (!cleanAccount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid account number and an amount greater than ₱0.");
      return;
    }

    setLoading(true);
    try {
      const idempotencyKey = idempotencyKeyService.generateKey();

      await transactionService.withdraw({
        accountNumber: cleanAccount,
        amount: parsedAmount,
        idempotencyKey,
      });

      setSuccessMsg(`Withdrawal of ₱${parsedAmount.toFixed(2)} from account ${sourceAccount} completed.`);
      setAmount("");
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to process withdrawal. Please check account balance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-accent">Withdraw Cash & Funds</h1>
        <p className="text-sm text-accent/60 font-medium">
          Request cash withdrawal or outbound clearing from your account.
        </p>
      </div>

      <Card title="Initiate Cash Withdrawal">
        <form onSubmit={handleWithdraw} className="flex flex-col gap-4">
          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-600 text-sm font-semibold">
              {successMsg}
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-600 text-sm font-semibold">
              {error}
            </div>
          )}

          <Input
            label="Source Account Number"
            placeholder="e.g. 1001987654"
            value={sourceAccount}
            onChange={(e) => setSourceAccount(e.target.value)}
            required
          />

          <Input
            label="Withdrawal Amount (₱)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Button type="submit" isLoading={loading} className="mt-2">
            Confirm Cash Withdrawal
          </Button>
        </form>
      </Card>
    </div>
  );
}
