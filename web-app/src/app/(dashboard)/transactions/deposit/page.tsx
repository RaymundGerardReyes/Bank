"use client";

import React, { useState } from "react";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { transactionService } from "@/services/transaction/transactionService";

export default function DepositPage() {
  const [accountNumber, setAccountNumber] = useState("1001987654");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await transactionService.deposit(accountNumber, parseFloat(amount));
      setMsg("Deposit completed successfully!");
      setAmount("");
    } catch {
      setMsg("Deposit failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-100">Deposit Funds</h1>
      <Card title="Quick Deposit">
        <form onSubmit={handleDeposit} className="flex flex-col gap-4">
          {msg && <div className="p-3 bg-sky-500/10 text-sky-400 text-sm rounded-lg">{msg}</div>}
          <Input label="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
          <Input label="Amount (USD)" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <Button type="submit" isLoading={loading}>Submit Deposit</Button>
        </form>
      </Card>
    </div>
  );
}
