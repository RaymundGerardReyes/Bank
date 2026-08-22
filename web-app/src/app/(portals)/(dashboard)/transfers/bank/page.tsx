"use client";

import React, { useEffect, useState } from "react";
import { TransactionLayout } from "@/components/features/payments/TransactionLayout";
import { TransactionReview } from "@/components/features/payments/TransactionReview";
import { PasskeyAuthorization } from "@/components/features/payments/PasskeyAuthorization";
import { TransactionReceipt } from "@/components/features/payments/TransactionReceipt";
import { TransactionProcessing } from "@/components/features/payments/TransactionProcessing";
import { TransactionError } from "@/components/features/payments/TransactionError";
import { TransactionUnknown } from "@/components/features/payments/TransactionUnknown";
import { RecipientVerification } from "@/components/features/payments/RecipientVerification";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAccounts } from "@/hooks/useAccounts";
import { transactionService, normalizeTransactionResult } from "@/services/transaction/transactionService";
import { idempotencyKeyService } from "@/services/transaction/idempotencyKeyService";
import { TransactionState, TransactionResult } from "@/models/TransactionTypes";

export default function BankTransferPage() {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();

  const [step, setStep] = useState<TransactionState>("FORM");

  // Payment Payload State
  const [sourceAccount, setSourceAccount] = useState("");
  const [bankCode, setBankCode] = useState(""); // Representing Routing Number conceptually
  const [recipientAccount, setRecipientAccount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  
  // Transaction Result State
  const [result, setResult] = useState<TransactionResult | null>(null);

  const TRANSFER_FEE = 15.00; // Conceptual standard InstaPay/Bank fee

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
    if (!bankCode.trim() || !recipientAccount.trim() || !recipientName.trim()) {
      setResult({ status: "FAILED", failureMessage: "All recipient details are required." });
      return;
    }

    setStep("REVIEW");
  };

  const handleConfirm = () => {
    setStep("AUTHENTICATING");
  };

  const handleAuthSuccess = async (assertion: any) => {
    setStep("SUBMITTING");

    // 🚀 FULL DEV BYPASS: Skip backend completely if dummy assertion is detected
    if (assertion?.id === "mock-credential-id") {
      setTimeout(() => {
        setResult({
          status: "SUCCESS",
          transactionReference: `DEV-EXT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          processedAt: new Date().toISOString(),
        });
        setStep("SUCCESS");
        idempotencyKeyService.clearKey();
      }, 1000);
      return;
    }

    try {
      const payload = {
        sourceAccountNumber: sourceAccount,
        routingNumber: bankCode.trim(), // Maps to the API's routingNumber
        recipientAccountNumber: recipientAccount.trim(),
        recipientName: recipientName.trim(),
        amount: parseFloat(amount),
        assertion,
        idempotencyKey: idempotencyKeyService.getOrCreateKey(),
      };

      const response = await transactionService.externalPayment(payload);
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

  const renderForm = () => (
    <form onSubmit={handleReview} className="flex flex-col gap-5">
      {result?.failureMessage && step === "FORM" && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-bold">
          {result.failureMessage}
        </div>
      )}

      {/* Source Account */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-bold text-accent">From Account</label>
        {accountsLoading ? (
          <div className="px-3.5 py-3 bg-surface border border-secondary/20 rounded-lg text-accent/50 font-medium animate-pulse">
            Loading...
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

      <div className="w-full h-px bg-secondary/20 my-2"></div>

      {/* Recipient Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-bold text-accent">Recipient Bank</label>
          <select
            value={bankCode}
            onChange={(e) => setBankCode(e.target.value)}
            className="px-3.5 py-3 bg-surface border border-secondary/40 rounded-lg text-accent font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all cursor-pointer appearance-none"
            required
          >
            <option value="" disabled>Select Bank...</option>
            <option value="010101010">BDO Unibank</option>
            <option value="020202020">BPI</option>
            <option value="030303030">Metrobank</option>
            <option value="040404040">UnionBank</option>
          </select>
        </div>
        
        <Input
          label="Account Number"
          placeholder="000000000"
          value={recipientAccount}
          onChange={(e) => setRecipientAccount(e.target.value)}
          required
          className="font-mono"
        />
      </div>

      <Input
        label="Recipient Name"
        placeholder="Enter recipient name"
        value={recipientName}
        onChange={(e) => setRecipientName(e.target.value)}
        required
      />

      <div className="w-full h-px bg-secondary/20 my-2"></div>

      {/* Amount */}
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

      <Button type="submit" className="w-full mt-4 py-3.5 text-lg shadow-xl shadow-accent/10">
        Review Transfer
      </Button>
    </form>
  );

  return (
    <TransactionLayout title="Bank Transfer" subtitle="Send funds securely to another bank." currentState={step}>
      {step === "FORM" && renderForm()}
      {step === "REVIEW" && (
        <>
          <RecipientVerification 
            name={recipientName}
            bankName={bankCode === '010101010' ? 'BDO' : bankCode === '020202020' ? 'BPI' : 'Bank'}
            maskedAccount={`••••${recipientAccount.slice(-4)}`}
            isVerified={true} // In a real app, this would be based on a backend validation call
          />
          <TransactionReview
            from={`NovaBank ••••${sourceAccount.slice(-4)}`}
            to={`${recipientName} (${bankCode === '010101010' ? 'BDO' : bankCode === '020202020' ? 'BPI' : 'Bank'})`}
            details={[
              { label: "Account Number", value: recipientAccount },
            ]}
            amount={parseFloat(amount)}
            fee={TRANSFER_FEE}
            rail="Bank Transfer (InstaPay)"
            onConfirm={handleConfirm}
            onEdit={() => setStep("FORM")}
          />
        </>
      )}
      {step === "AUTHENTICATING" && (
        <PasskeyAuthorization
          amount={parseFloat(amount)}
          recipient={recipientName}
          onSuccess={handleAuthSuccess}
          onCancel={() => setStep("FORM")}
        />
      )}
      {(step === "PROCESSING" || step === "SUBMITTING") && (
        <TransactionProcessing message="Processing transfer via Network..." />
      )}
      {(step === "SUCCESS" || step === "PENDING") && result && (
        <TransactionReceipt
          status={step as "SUCCESS" | "PENDING"}
          reference={result.transactionReference}
          amount={parseFloat(amount)}
          recipient={recipientName}
          type="InstaPay / Bank Transfer"
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
