"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../common/Button";
import { FingerprintIcon } from "lucide-react";
import { startAuthentication } from "@simplewebauthn/browser";
import { transactionService } from "@/services/transaction/transactionService";
import { env } from "@/config/env";

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

    // Developer bypass: Send mock cryptographic signature
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

  const handleAuthorize = async () => {
    setAuthenticating(true);
    setError(null);

    try {
      const rpIdToUse = env.rpId || (typeof window !== "undefined" ? window.location.hostname : "");

      // 1. Request cryptographic challenge
      const challengeOptions = await transactionService.createTransactionChallenge({
        amount,
        recipient,
        ...(rpIdToUse ? { rpId: rpIdToUse } : {})
      });

      // 2. Invoke platform authenticator
      const assertion = await startAuthentication({ optionsJSON: challengeOptions });

      // 3. Return the signed assertion
      onSuccess(assertion);
    } catch (err: any) {
      console.error("WebAuthn Error:", err);
      
      // --- AUTOMATIC DEV BYPASS ---
      // If WebAuthn fails or is cancelled locally, automatically succeed using dummy data
      if (isLocalDev) {
        console.warn("Dev Mode Detected: WebAuthn failed or was cancelled. Automatically applying dummy signature bypass.");
        handleSimulate();
        return;
      }

      // Production error handling
      if (err.name === 'NotAllowedError') {
        setError("Passkey authorization was cancelled or timed out.");
      } else {
        setError("Failed to verify Passkey. Please try again or use another method.");
      }
    } finally {
      setAuthenticating(false);
    }
  };

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

        {isLocalDev && (
          <button
            onClick={handleSimulate}
            className="text-[10px] text-slate-400 hover:text-slate-600 underline mt-2 transition-colors"
            disabled={authenticating}
          >
            Force Instant Bypass
          </button>
        )}
      </div>
    </div>
  );
};
