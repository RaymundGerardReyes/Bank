"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { useAccounts } from "@/hooks/useAccounts";
import { idempotencyKeyService } from "@/services/transaction/idempotencyKeyService";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function TransfersPage() {
  const router = useRouter();

  // 1. Dynamically fetch the authenticated user's accounts
  const { data: accounts, isLoading: accountsLoading } = useAccounts();

  const [sourceAccount, setSourceAccount] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [error, setError] = useState("");

  // 2. Automatically select the primary account when data loads
  useEffect(() => {
    if (accounts && accounts.length > 0 && !sourceAccount) {
      // Find the first active account to use as the default source
      const activeAccount = accounts.find(acc => acc.status === "ACTIVE") || accounts[0];
      setSourceAccount(activeAccount.accountNumber);
    }
  }, [accounts, sourceAccount]);

  useEffect(() => {
    idempotencyKeyService.getOrCreateKey();
  }, []);

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid positive transfer amount.");
      return;
    }
    if (!sourceAccount) {
      setError("A valid source account is required.");
      return;
    }
    if (!recipientAccount.trim()) {
      setError("Please enter a recipient account number.");
      return;
    }

    const idempotencyKey = idempotencyKeyService.getOrCreateKey();
    const transferSession = {
      sourceAccountNumber: sourceAccount,
      recipientAccountNumber: recipientAccount,
      amount: parsedAmount,
      description,
      scheduledDate: scheduledDate || undefined,
      idempotencyKey,
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("pending_transfer_session", JSON.stringify(transferSession));
    }
    router.push("/transfers/review");
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500">

      {/* Minimalist Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-accent tracking-tight">Move Money</h1>
        <p className="text-sm text-accent/60 font-medium mt-1">
          Instantly transfer funds between internal accounts.
        </p>
      </div>

      <Card className="border-none shadow-2xl shadow-secondary/10">
        <form onSubmit={handleProceed} className="flex flex-col gap-5">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-bold animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* Dynamic Source Account Dropdown */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-bold text-accent">From Account</label>
            {accountsLoading ? (
              <div className="px-3.5 py-3 bg-surface border border-secondary/20 rounded-lg text-accent/50 font-medium animate-pulse">
                Loading secure accounts...
              </div>
            ) : (
              <select
                value={sourceAccount}
                onChange={(e) => setSourceAccount(e.target.value)}
                className="px-3.5 py-3 bg-surface border border-secondary/40 rounded-lg text-accent font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all cursor-pointer appearance-none"
                required
              >
                {accounts?.map((acc) => (
                  <option key={acc.accountNumber} value={acc.accountNumber} disabled={acc.status !== "ACTIVE"}>
                    {acc.accountType} •••• {acc.accountNumber.slice(-4)} {acc.status !== "ACTIVE" ? `(${acc.status})` : `($${acc.balance.toFixed(2)})`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="w-full h-px bg-secondary/20 my-2"></div>

          <Input
            label="To Recipient Account"
            placeholder="Enter account number"
            value={recipientAccount}
            onChange={(e) => setRecipientAccount(e.target.value)}
            required
            className="font-mono"
          />

          <Input
            label="Amount (USD)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="text-2xl font-black text-accent h-14"
          />

          <Input
            label="Memo (Optional)"
            placeholder="What is this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button type="submit" className="w-full mt-4 py-3.5 text-lg shadow-xl shadow-accent/10">
            Review Details
          </Button>
        </form>
      </Card>
    </div>
  );
}