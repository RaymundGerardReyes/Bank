"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { transactionService } from "@/services/transaction/transactionService";
import { idempotencyKeyService } from "@/services/transaction/idempotencyKeyService";

export default function DepositPage() {
  const [accountNo, setAccountNo] = useState("1001987654");
  const [amount, setAmount] = useState("");
  const [showBalance, setShowBalance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setError("");

    const parsedAmount = parseFloat(amount);
    const cleanAccount = accountNo.replace(/\s/g, '');

    if (!cleanAccount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid account number and an amount greater than ₱0.");
      return;
    }

    setLoading(true);
    try {
      // Fresh UUID key per deposit attempt (matching mobile DepositScreen.tsx pattern)
      const idempotencyKey = idempotencyKeyService.generateKey();

      await transactionService.deposit({
        accountNumber: cleanAccount,
        amount: parsedAmount,
        idempotencyKey,
      });

      setSuccessMsg(`Successfully deposited ₱${parsedAmount.toFixed(2)} into account ${accountNo}.`);
      setAmount("");
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to process deposit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-accent">Deposit Cash & Funds</h1>
          <p className="text-sm text-accent/60 font-medium">
            Directly deposit funds into your verified bank account.
          </p>
        </div>

        {/* Web Privacy Control Mitigation */}
        <button
          type="button"
          onClick={() => setShowBalance(!showBalance)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-secondary/40 text-accent/80 hover:bg-surface"
        >
          {showBalance ? "🙈 Mask Privacy View" : "👁️ Show Privacy View"}
        </button>
      </div>

      <Card title="Initiate Deposit">
        <form onSubmit={handleDeposit} className="flex flex-col gap-4">
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

          <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg text-xs font-medium text-accent/70">
            🔒 Session Guard: Balance display is {showBalance ? "₱24,850.00 PHP" : "•••••••• PHP"}. Screenshot protection policy active.
          </div>

          <Input
            label="Account Number"
            placeholder="e.g. 1001987654"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
            required
          />

          <Input
            label="Deposit Amount (₱)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Button type="submit" isLoading={loading} className="mt-2">
            Confirm & Execute Deposit
          </Button>
        </form>
      </Card>
    </div>
  );
}
