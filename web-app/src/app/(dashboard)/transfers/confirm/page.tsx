"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { PasskeyPrompt } from "@/components/security/PasskeyPrompt";
import { idempotencyKeyService } from "@/services/transaction/idempotencyKeyService";
import { transactionService } from "@/services/transaction/transactionService";
import { useAuthStore } from "@/state/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TransferSession {
  sourceAccountNumber: string;
  recipientAccountNumber: string;
  amount: number;
  description?: string;
  scheduledDate?: string;
  idempotencyKey: string;
}

export default function TransferConfirmPage() {
  const router = useRouter();
  const { user } = useAuthStore(); // Grab logged-in user for the email
  const [session, setSession] = useState<TransferSession | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State to hold the final backend transaction data for the receipt
  const [receiptData, setReceiptData] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = sessionStorage.getItem("pending_transfer_session");
      if (raw) {
        try {
          setSession(JSON.parse(raw));
        } catch {
          router.push("/transfers");
        }
      } else {
        router.push("/transfers");
      }
    }
  }, [router]);

  const handlePasskeyAuth = async () => {
    if (!session) return;
    setLoading(true);
    setError("");

    try {
      // 1. Simulate WebAuthn Biometric verification
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 2. Execute actual financial transfer
      const response = await transactionService.transferInternal({
        sourceAccountNumber: session.sourceAccountNumber,
        recipientAccountNumber: session.recipientAccountNumber,
        amount: session.amount,
        description: session.description,
        scheduledDate: session.scheduledDate,
        idempotencyKey: session.idempotencyKey,
      });

      // Store backend response to render the receipt
      const txData = response.data;
      setReceiptData(txData);

      // 3. Trigger Background SMTP Dispatch
      fetch("/api/proxy/transactions/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionReference: txData.transactionReference || txData.transactionRef,
          amount: txData.amount,
          date: new Date(txData.createdAt).toLocaleString(),
          sourceEmail: user?.email || "user@example.com", // Fetch from AuthStore
          recipientEmail: "recipient@example.com" // In a real app, you might fetch this based on account
        })
      }).catch(console.error); // Fire and forget

      // 4. Reset idempotency
      idempotencyKeyService.resetKey();
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("pending_transfer_session");
      }

    } catch (err: unknown) {
      setError((err as Error).message || "Transaction declined or authorization failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-accent/60 font-medium animate-pulse">
        Loading secure authorization...
      </div>
    );
  }

  // ==========================================
  // VIEW 1: THE DIGITAL RECEIPT (SUCCESS)
  // ==========================================
  if (receiptData) {
    const txRef = receiptData.transactionReference || receiptData.transactionRef || "N/A";
    const srcAcc = receiptData.sourceAccountNumber || receiptData.accountNumber || session.sourceAccountNumber;
    const destAcc = receiptData.destinationAccountNumber || receiptData.recipientAccount || session.recipientAccountNumber;

    return (
      <div className="max-w-md mx-auto flex flex-col gap-6 animate-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center text-center mt-6">
          <div className="w-16 h-16 bg-emerald-100 border-4 border-emerald-50 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-accent">Transfer Successful</h1>
          <h2 className="text-5xl font-black text-accent mt-3 mb-2">${receiptData.amount.toFixed(2)}</h2>
          <p className="text-xs font-bold text-accent/50 uppercase tracking-widest">
            {new Date(receiptData.createdAt).toLocaleString()}
          </p>
        </div>

        <Card className="bg-surface border-secondary/30 relative overflow-hidden">
          {/* Decorative receipt zig-zag top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjQiPjxwb2x5Z29uIHBvaW50cz0iMCAwLCA0IDQsIDggMCIgZmlsbD0iI0ZGRkZGRiIvPjwvc3ZnPg==')] opacity-50 w-full bg-repeat-x"></div>

          <div className="flex flex-col gap-4 mt-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-accent/50">Reference Number</span>
              <span className="font-mono font-bold text-accent">{txRef}</span>
            </div>

            <div className="w-full border-b border-dashed border-secondary/40"></div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-accent/50">From Account</span>
              <span className="font-bold text-accent">{srcAcc}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-accent/50">To Account</span>
              <span className="font-bold text-accent">{destAcc}</span>
            </div>

            {receiptData.description && (
              <>
                <div className="w-full border-b border-dashed border-secondary/40"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-accent/50">Memo</span>
                  <span className="font-bold text-accent">{receiptData.description}</span>
                </div>
              </>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-3 mt-2">
          <p className="text-center text-[11px] font-bold text-emerald-600 mb-2 bg-emerald-50 py-2 rounded-lg border border-emerald-100">
            ✉️ Official receipt sent to registered emails via SMTP.
          </p>
          <Button onClick={() => router.push("/transfers")} className="py-3 shadow-xl shadow-accent/10">
            Make Another Transfer
          </Button>
          <Button variant="ghost" onClick={() => router.push("/accounts")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE PASSKEY PROMPT (PENDING)
  // ==========================================
  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-accent">Step 3: Biometric Authorization</h1>
      <Card title="Final Security Verification">
        <div className="flex flex-col gap-4">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-600 text-sm font-semibold flex flex-col gap-3 animate-in fade-in">
              <div>⚠️ {error}</div>
              <Button variant="danger" onClick={() => setError("")} className="w-full mt-2">
                Try Step-Up Again
              </Button>
            </div>
          )}

          {!error && (
            <>
              <div className="text-center mb-4 p-4 bg-surface rounded-xl border border-secondary/30">
                <p className="text-sm font-bold text-accent/60 mb-1">Total to Transfer</p>
                <p className="text-4xl text-accent font-black">${session.amount.toFixed(2)}</p>
                <p className="text-xs font-mono text-accent/50 mt-2">
                  Destination: {session.recipientAccountNumber}
                </p>
              </div>
              <PasskeyPrompt onAuthenticate={handlePasskeyAuth} isLoading={loading} />
            </>
          )}
        </div>
      </Card>
    </div>
  );
}