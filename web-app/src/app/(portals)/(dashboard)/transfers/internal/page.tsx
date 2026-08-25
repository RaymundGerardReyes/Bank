"use client";

import React, { useEffect, useState } from "react";
import { TransactionLayout } from "@/components/features/payments/TransactionLayout";
import { TransactionReview } from "@/components/features/payments/TransactionReview";
import { PasskeyAuthorization } from "@/components/features/payments/PasskeyAuthorization";
import { TransactionReceipt } from "@/components/features/payments/TransactionReceipt";
import { TransactionProcessing } from "@/components/features/payments/TransactionProcessing";
import { TransactionError } from "@/components/features/payments/TransactionError";
import { TransactionUnknown } from "@/components/features/payments/TransactionUnknown";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAccounts } from "@/hooks/useAccounts";
import { transactionService, normalizeTransactionResult } from "@/services/transaction/transactionService";
import { idempotencyKeyService } from "@/services/transaction/idempotencyKeyService";
import { TransactionState, TransactionResult } from "@/models/TransactionTypes";

export default function InternalTransferPage() {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();

  // State Machine Step
  const [step, setStep] = useState<TransactionState>("FORM");

  // Payment Payload State
  const [sourceAccount, setSourceAccount] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  
  // Transaction Result State
  const [result, setResult] = useState<TransactionResult | null>(null);

  // Default Source Account
  useEffect(() => {
    if (accounts && accounts.length > 0 && !sourceAccount) {
      const activeAccount = accounts.find(acc => acc.status === "ACTIVE") || accounts[0];
      setSourceAccount(activeAccount.accountNumber);
    }
  }, [accounts, sourceAccount]);

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setResult({ status: "FAILED", failureMessage: "Please enter a valid positive transfer amount." });
      return;
    }
    if (!sourceAccount || !recipientAccount.trim()) {
      setResult({ status: "FAILED", failureMessage: "Source and recipient accounts are required." });
      return;
    }
    if (sourceAccount === recipientAccount.trim()) {
      setResult({ status: "FAILED", failureMessage: "Cannot transfer to the same account." });
      return;
    }

    setStep("REVIEW");
  };

  const handleConfirm = () => {
    setStep("AUTHENTICATING");
  };

  const handleAuthSuccess = async (assertion: any) => {
    setStep("SUBMITTING");

    try {
      const payload: any = {
        sourceAccountNumber: sourceAccount,
        recipientAccountNumber: recipientAccount.trim(),
        amount: parseFloat(amount),
        description: description.trim() || undefined,
        idempotencyKey: idempotencyKeyService.getOrCreateKey(),
        assertion,
      };

      const response = await transactionService.transferInternal(payload);
      const normalized = normalizeTransactionResult(response);
      
      setResult(normalized);
      setStep(normalized.status);
      
      if (normalized.status === "SUCCESS" || normalized.status === "PENDING") {
        idempotencyKeyService.clearKey();
      }
    } catch (err: any) {
      const normalized = normalizeTransactionResult({
        success: false,
        error: "UNKNOWN_ERROR",
        message: err.message || "An unexpected error occurred.",
      });
      setResult(normalized);
      setStep(normalized.status);
    }
  };

  // -------------------------------------------------------------
  // Render Helpers
  // -------------------------------------------------------------
  const renderForm = () => (
    <form onSubmit={handleReview} className="flex flex-col gap-5">
      {result?.failureMessage && step === "FORM" && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-bold">
          {result.failureMessage}
        </div>
      )}

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
                {acc.accountType} •••• {acc.accountNumber.slice(-4)} {acc.status !== "ACTIVE" ? `(${acc.status})` : `(₱${acc.balance.toFixed(2)})`}
              </option>
            ))}
          </select>
        )}
      </div>

      <Input
        label="To Account"
        placeholder="Recipient's account number"
        value={recipientAccount}
        onChange={(e) => setRecipientAccount(e.target.value)}
        required
        className="font-mono"
      />

      <Input
        label="Amount (PHP)"
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
        Review Transfer
      </Button>
    </form>
  );

  return (
    <TransactionLayout title="Between My Accounts" subtitle="Transfer instantly between your NovaBank accounts." currentState={step}>
      {step === "FORM" && renderForm()}
      {step === "REVIEW" && (
        <TransactionReview
          from={`NovaBank ••••${sourceAccount.slice(-4)}`}
          to={`NovaBank ••••${recipientAccount.slice(-4)}`}
          amount={parseFloat(amount)}
          fee={0} // Internal transfers are free
          rail="Internal Transfer"
          onConfirm={handleConfirm}
          onEdit={() => setStep("FORM")}
        />
      )}
      {step === "AUTHENTICATING" && (
        <PasskeyAuthorization
          amount={parseFloat(amount)}
          recipient={`NovaBank ••••${recipientAccount.slice(-4)}`}
          onSuccess={handleAuthSuccess}
          onCancel={() => setStep("FORM")}
        />
      )}
      {(step === "PROCESSING" || step === "SUBMITTING") && (
        <TransactionProcessing message="Processing transfer..." />
      )}
      {(step === "SUCCESS" || step === "PENDING") && result && (
        <TransactionReceipt
          status={step as "SUCCESS" | "PENDING"}
          reference={result.transactionReference}
          amount={parseFloat(amount)}
          recipient={`NovaBank ••••${recipientAccount.slice(-4)}`}
          type="Internal Transfer"
          timestamp={result.processedAt}
        />
      )}
      {step === "FAILED" && (
        <TransactionError 
          error={result?.failureMessage || "An error occurred"} 
          onRetry={() => { setStep("FORM"); setResult(null); }} 
          onCancel={() => { setStep("FORM"); setResult(null); }} 
        />
      )}
      {step === "UNKNOWN" && (
        <TransactionUnknown 
          message={result?.failureMessage || "Your connection was lost during processing."} 
          onCheckHistory={() => { /* Real app would navigate to history */ setStep("FORM"); setResult(null); }} 
          onDismiss={() => { setStep("FORM"); setResult(null); }} 
        />
      )}
    </TransactionLayout>
  );
}
