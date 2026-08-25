"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { FingerprintIcon } from "lucide-react";
import { startAuthentication } from "@simplewebauthn/browser";
import { transactionService } from "@/services/transaction/transactionService";

interface PasskeyAuthorizationProps {
  amount?: number;
  recipient?: string;
  actionDescription?: string;
  onSuccess: (assertion?: any) => void;
  onCancel: () => void;
}

export const PasskeyAuthorization: React.FC<PasskeyAuthorizationProps> = ({
  amount = 0,
  recipient = "Payment Gateway",
  actionDescription,
  onSuccess,
  onCancel,
}) => {
  const [authenticating, setAuthenticating] = useState(false);
  const [waitingForMobile, setWaitingForMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocalDev, setIsLocalDev] = useState(false);

  // Safely check if we are in a local or development environment
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const isLocalDomain = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";
      const isDevEnv = process.env.NODE_ENV === "development";
      
      setIsLocalDev(isLocalDomain || isDevEnv);
    }
  }, []);

  const handleSimulate = () => {
    if (!isLocalDev) {
      console.error("Security Violation: Bypass is strictly forbidden outside of local development.");
      return;
    }

    onSuccess({
      id: "mock-credential-id",
      rawId: "mock-credential-id",
      response: {
        authenticatorData: "mock-data",
        clientDataJSON: "mock-data",
        signature: "mock-signature",
        userHandle: "mock-user-handle",
      },
      type: "public-key",
      clientExtensionResults: {},
    });
  };

  const pollMobileApproval = async (intentId: number) => {
    // In a full integration, this would poll GET /api/v1/transactions/intents/{intentId}/authorization/status
    const pollInterval = setInterval(async () => {
      try {
        const res = await transactionService.getAuthStatus(intentId);
        if (res.data?.status === 'AUTHORIZED' || res.data?.status === 'VERIFIED') {
          clearInterval(pollInterval);
          setWaitingForMobile(false);
          handleSimulate(); // Trigger success automatically once mobile approves
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 3000);

    // Timeout after 60 seconds
    setTimeout(() => {
      clearInterval(pollInterval);
      if (waitingForMobile) {
         setWaitingForMobile(false);
         setError("Mobile authorization timed out.");
      }
    }, 60000);
  };

  const handleAuthorize = async () => {
    setAuthenticating(true);
    setError(null);
    let shouldStopLoading = true;

    try {
      const rpIdToUse = process.env.NEXT_PUBLIC_WEBAUTHN_RP_ID || (typeof window !== "undefined" ? window.location.hostname : "");

      const challengeOptions = await transactionService.createTransactionChallenge({
        amount,
        recipient,
        ...(rpIdToUse ? { rpId: rpIdToUse } : {})
      });

      const assertion = await startAuthentication({ optionsJSON: challengeOptions });
      onSuccess(assertion);
    } catch (err: any) {
      console.error("WebAuthn Error:", err);
      
      if (err.name === 'NotAllowedError') {
        shouldStopLoading = false;
        console.warn("WebAuthn denied/timeout. Falling back to Sync Queueing Mobile Approval.");
        setAuthenticating(false);
        setWaitingForMobile(true);
        
        try {
          // 1. Create Intent for Push Fallback (in real app, this might be created earlier)
          const intentRes = await transactionService.createIntent({
            rail: "INTERNAL", // Simplified for fallback demo
            sourceAccountId: "UNKNOWN",
            recipient: recipient,
            amount: amount,
            currency: "PHP",
            fee: 0.00,
            total: amount,
            idempotencyKey: "PUSH-" + new Date().getTime()
          });
          const data = intentRes.data as { id?: number };
          if (!data?.id) throw new Error("Invalid intent response: missing ID");
          const intentId = data.id;
          
          // 2. Trigger Push Request
          await transactionService.createPushRequest(intentId, {
            amount: amount,
            sourceAccount: "Auto-detect",
            destinationAccount: recipient
          });
          
          // 3. Poll
          pollMobileApproval(intentId);
        } catch (pushErr) {
          console.error("Push Error", pushErr);
          setWaitingForMobile(false);
          setError("Failed to initiate mobile authorization.");
        }
        return;
      }

      if (isLocalDev) {
        shouldStopLoading = false;
        console.warn("Dev Mode Detected: WebAuthn failed. Falling back to Sync Queueing.");
        setAuthenticating(false);
        setWaitingForMobile(true);
        
        try {
          const intentRes = await transactionService.createIntent({
            rail: "INTERNAL",
            sourceAccountId: "DEV-ACCOUNT",
            recipient: recipient,
            amount: amount,
            currency: "PHP",
            fee: 0.00,
            total: amount,
            idempotencyKey: "DEV-PUSH-" + new Date().getTime()
          });
          const data = intentRes.data as { id?: number };
          if (!data?.id) throw new Error("Invalid intent response: missing ID");
          const intentId = data.id;
          
          await transactionService.createPushRequest(intentId, {
            amount: amount,
            sourceAccount: "Dev Account",
            destinationAccount: recipient
          });
          
          pollMobileApproval(intentId);
        } catch (pushErr) {
          console.error("Push Error", pushErr);
          setWaitingForMobile(false);
          setError("Failed to initiate mobile authorization.");
        }
        return;
      }

      setError("Failed to verify Passkey. Please try again or use another method.");
    } finally {
      if (shouldStopLoading) {
        setAuthenticating(false);
      }
    }
  };

  if (waitingForMobile) {
    return (
      <div className="flex flex-col gap-6 items-center text-center py-8 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-2 relative">
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <FingerprintIcon className="w-8 h-8 text-indigo-600 animate-pulse" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-600 tracking-wider mb-3 animate-pulse">
            PEER LIVE SYNC
          </div>
          <h2 className="text-2xl font-black text-accent mb-2">Check Your Phone</h2>
          <p className="text-sm text-accent/70 font-medium max-w-xs mx-auto mb-2">
            We've sent a secure push notification to your Expo Banking App to verify this transfer of <strong>₱{amount.toFixed(2)}</strong>.
          </p>
        </div>
        <Button variant="ghost" onClick={onCancel} className="w-full mt-4">
          Cancel Transfer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 items-center text-center py-6 animate-in zoom-in-95 duration-500">
      
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2">
        <FingerprintIcon className={`w-10 h-10 text-primary ${authenticating ? "animate-pulse" : ""}`} />
      </div>

      <div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 tracking-wider mb-3">
          WEBAUTHN SECURED
        </div>
        <h2 className="text-2xl font-black text-accent mb-2">Authorize Transfer</h2>
        <p className="text-sm text-accent/70 font-medium max-w-xs mx-auto mb-2">
          You are authorizing a transfer of <strong className="text-accent">₱{amount.toFixed(2)}</strong> to <strong className="text-accent">{recipient}</strong>.
        </p>

        {error && (
          <p className="text-sm text-rose-500 font-medium animate-in fade-in">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full mt-4">
        <Button
          onClick={handleAuthorize}
          className="w-full py-4 text-lg shadow-xl shadow-primary/20"
          disabled={authenticating}
        >
          {authenticating ? "Verifying Passkey..." : "Use Passkey to Authorize"}
        </Button>

        <Button
          variant="ghost"
          onClick={onCancel}
          className="w-full"
          disabled={authenticating}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
