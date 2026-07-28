"use client";

import React, { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { transactionService } from "@/services/transaction/transactionService";

export default function TransfersPage() {
  const [sourceAccount, setSourceAccount] = useState("1001987654");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setError("");
    setLoading(true);

    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Please enter a valid positive transfer amount.");
      }

      await transactionService.transferInternal({
        sourceAccountNumber: sourceAccount,
        recipientAccountNumber: recipientAccount,
        amount: parsedAmount,
        description,
      });

      setSuccessMsg(`Transfer of $${parsedAmount.toFixed(2)} to account ${recipientAccount} submitted successfully!`);
      setRecipientAccount("");
      setAmount("");
      setDescription("");
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to execute transfer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-100">Internal Funds Transfer</h1>

      <Card title="Initiate Transfer">
        <form onSubmit={handleTransfer} className="flex flex-col gap-4">
          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
              {successMsg}
            </div>
          )}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Source Account"
            value={sourceAccount}
            onChange={(e) => setSourceAccount(e.target.value)}
            required
          />
          <Input
            label="Recipient Account Number"
            placeholder="e.g. 2001987655"
            value={recipientAccount}
            onChange={(e) => setRecipientAccount(e.target.value)}
            required
          />
          <Input
            label="Amount (USD)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Input
            label="Description (Optional)"
            placeholder="Transfer reference note"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button type="submit" isLoading={loading} className="mt-2">
            Confirm & Execute Transfer
          </Button>
        </form>
      </Card>
    </div>
  );
}
