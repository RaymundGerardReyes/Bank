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
import { Button } from "@/components/ui/Button";
import { QrCodeIcon, CameraIcon, UploadCloudIcon } from "lucide-react";
import { useAccounts } from "@/hooks/useAccounts";
import { transactionService, normalizeTransactionResult } from "@/services/transaction/transactionService";
import { idempotencyKeyService } from "@/services/transaction/idempotencyKeyService";
import { TransactionState, TransactionResult } from "@/models/TransactionTypes";

export default function QrPhTransferPage() {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();

  const [step, setStep] = useState<TransactionState>("FORM");
  
  // Payment Payload State
  const [sourceAccount, setSourceAccount] = useState("");
  const [qrPayload, setQrPayload] = useState("");
  const [amount, setAmount] = useState(0);
  const [recipientName, setRecipientName] = useState("");
  const [bankName, setBankName] = useState("");
  const [maskedAccount, setMaskedAccount] = useState("");
  
  // Transaction Result State
  const [result, setResult] = useState<TransactionResult | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);

  const TRANSFER_FEE = 0.00; // QR Ph P2P is often free

  useEffect(() => {
    if (accounts && accounts.length > 0 && !sourceAccount) {
      const activeAccount = accounts.find(acc => acc.status === "ACTIVE") || accounts[0];
      setSourceAccount(activeAccount.accountNumber);
    }
  }, [accounts, sourceAccount]);

  const simulateScan = () => {
    setIsScanning(true);
    // Simulate camera scanning and payload decoding
    setTimeout(() => {
      setIsScanning(false);
      setQrPayload("QRPH-MOCK-PAYLOAD-12345");
      setRecipientName("Scanned Recipient");
      setBankName("Example Bank");
      setMaskedAccount("•••• 9284");
      setAmount(1500.00);
      setStep("REVIEW");
    }, 2000);
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
          transactionReference: `DEV-QRPH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          processedAt: new Date().toISOString(),
        });
        setStep("SUCCESS");
        idempotencyKeyService.clearKey();
      }, 1000);
      return;
    }

    try {
      const payload: any = {
        sourceAccountNumber: sourceAccount,
        qrPayload: qrPayload,
        amount: parseFloat(amount as any),
        assertion, // Phase D: WebAuthn signed assertion
      };

      const response = await transactionService.qrPhPayment(payload);
      const normalized = normalizeTransactionResult(response);
      
      setResult(normalized);
      setStep(normalized.status);
      
      if (normalized.status === "SUCCESS" || normalized.status === "PENDING") {
        idempotencyKeyService.clearKey();
      }
    } catch (err: any) {
      const normalized = normalizeTransactionResult({
        success: false,
        error: "QR_PH_UNAVAILABLE",
        message: err.message || "QR Ph integration unavailable.",
      });
      setResult(normalized);
      setStep(normalized.status);
    }
  };

  const renderForm = () => (
    <>
      {!isScanning ? (
        <div className="flex flex-col items-center gap-8 py-8 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="w-32 h-32 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
            <QrCodeIcon className="w-16 h-16 text-indigo-500 relative z-10" />
            <div className="absolute inset-0 bg-indigo-500/10 translate-y-full animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>

          <div className="text-center max-w-sm">
            <h2 className="text-2xl font-black text-accent mb-2">Ready to Scan</h2>
            <p className="text-sm text-accent/70 font-medium leading-relaxed">
              Position the QR code within the frame to automatically detect the recipient and amount.
            </p>
          </div>

          {/* Account Selection for Source */}
          <div className="flex flex-col gap-1.5 w-full mt-2">
            <label className="text-sm font-bold text-accent">Pay From</label>
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
                    {acc.accountType} •••• {acc.accountNumber.slice(-4)} {acc.status !== "ACTIVE" ? `(${acc.status})` : `($${acc.balance.toFixed(2)})`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
            <Button onClick={simulateScan} className="flex-1 py-4 flex gap-2 items-center justify-center shadow-xl shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700">
              <CameraIcon className="w-5 h-5" /> Open Camera
            </Button>
            <Button variant="secondary" className="flex-1 py-4 flex gap-2 items-center justify-center">
              <UploadCloudIcon className="w-5 h-5" /> Upload Image
            </Button>
          </div>
          
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 py-12 animate-in fade-in duration-500">
          <div className="w-full max-w-sm aspect-square bg-slate-900 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-4 border-2 border-indigo-500/50 rounded-xl"></div>
            <div className="w-full h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] absolute top-0 animate-[scan-line_2s_linear_infinite]"></div>
            <span className="text-slate-400 text-sm font-medium">Looking for QR code...</span>
          </div>
          <Button variant="ghost" onClick={() => setIsScanning(false)} className="mt-4">
            Cancel Scan
          </Button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0%, 100% { transform: translateY(100%); }
          50% { transform: translateY(-100%); }
        }
        @keyframes scan-line {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}} />
    </>
  );

  return (
    <TransactionLayout title="QR Ph" subtitle="Scan or upload a national QR Ph code for fast, interoperable payments." currentState={step}>
      {step === "FORM" && renderForm()}
      {step === "REVIEW" && (
        <>
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 text-center text-indigo-700 font-bold text-sm flex items-center justify-center gap-2">
            <QrCodeIcon className="w-5 h-5" /> QR Ph Payload Decoded
          </div>
          <RecipientVerification 
            name={recipientName}
            bankName={bankName}
            maskedAccount={maskedAccount}
            isVerified={true}
          />
          <TransactionReview
            from={`NovaBank ••••${sourceAccount.slice(-4)}`}
            to={`${recipientName} (${bankName})`}
            amount={amount}
            fee={TRANSFER_FEE}
            rail="QR Ph"
            onConfirm={handleConfirm}
            onEdit={() => setStep("FORM")}
          />
        </>
      )}
      {step === "AUTHENTICATING" && (
        <PasskeyAuthorization
          amount={amount}
          recipient={recipientName}
          onSuccess={handleAuthSuccess}
          onCancel={() => setStep("FORM")}
        />
      )}
      {(step === "PROCESSING" || step === "SUBMITTING") && (
        <TransactionProcessing message="Processing QR Ph payment..." />
      )}
      {(step === "SUCCESS" || step === "PENDING") && result && (
        <TransactionReceipt
          status={step as "SUCCESS" | "PENDING"}
          reference={result.transactionReference}
          amount={amount}
          recipient={recipientName}
          type="QR Ph Payment"
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
