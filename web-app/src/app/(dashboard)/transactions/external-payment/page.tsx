"use client";

import React, { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { transactionService } from "@/services/transaction/transactionService";
import { idempotencyKeyService } from "@/services/transaction/idempotencyKeyService";

export default function ExternalPaymentPage() {
  const [sourceAcc, setSourceAcc] = useState("1001987654");
  const [routingNo, setRoutingNo] = useState("");
  const [recipientAcc, setRecipientAcc] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setError("");

    const parsedAmount = parseFloat(amount);
    const cleanSource = sourceAcc.replace(/\s/g, '');
    const cleanRouting = routingNo.replace(/\s/g, '');
    const cleanDest = recipientAcc.replace(/\s/g, '');

    if (
      !cleanSource ||
      !cleanRouting ||
      !cleanDest ||
      !recipientName.trim() ||
      isNaN(parsedAmount) ||
      parsedAmount <= 0
    ) {
      setError("Please complete all fields and ensure the amount is greater than $0.");
      return;
    }

    if (cleanRouting.length !== 9 || !/^\d+$/.test(cleanRouting)) {
      setError("Routing number must be exactly 9 numeric digits.");
      return;
    }

    setLoading(true);
    try {
      const idempotencyKey = idempotencyKeyService.generateKey();

      await transactionService.externalPayment({
        sourceAccountNumber: cleanSource,
        routingNumber: cleanRouting,
        recipientAccountNumber: cleanDest,
        recipientName,
        amount: parsedAmount,
        idempotencyKey,
      });

      setSuccessMsg(`External wire of $${parsedAmount.toFixed(2)} to ${recipientName} initiated.`);
      setRoutingNo("");
      setRecipientAcc("");
      setRecipientName("");
      setAmount("");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to process external payment.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-accent">External Bank Wire Transfer</h1>
        <p className="text-sm text-accent/60 font-medium">
          Send money externally to any financial institution via ACH or Wire.
        </p>
      </div>

      <Card title="Wire Transfer Details">
        <form onSubmit={handlePayment} className="flex flex-col gap-4">
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
            label="Source Account"
            value={sourceAcc}
            onChange={(e) => setSourceAcc(e.target.value)}
            required
          />

          <Input
            label="Routing Number (9-Digits)"
            placeholder="e.g. 021000021"
            value={routingNo}
            onChange={(e) => setRoutingNo(e.target.value)}
            maxLength={9}
            required
          />

          <Input
            label="Recipient Account Number"
            placeholder="e.g. 9876543210"
            value={recipientAcc}
            onChange={(e) => setRecipientAcc(e.target.value)}
            required
          />

          <Input
            label="Recipient Full Name / Business"
            placeholder="e.g. Raymund Reyes"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            required
          />

          <Input
            label="Transfer Amount ($)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Button type="submit" isLoading={loading} className="mt-2">
            Send External Wire Transfer
          </Button>
        </form>
      </Card>
    </div>
  );
}
