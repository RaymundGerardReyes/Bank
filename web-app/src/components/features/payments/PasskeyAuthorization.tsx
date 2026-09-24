"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { FingerprintIcon, QrCode, Smartphone } from "lucide-react";
import { startAuthentication } from "@simplewebauthn/browser";
import { QRCodeSVG } from "qrcode.react";
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
  const [activeIntentId, setActiveIntentId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLocalDev, setIsLocalDev] = useState(false);

  // Safely check if we are in a local or development environment
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const isLocalDomain = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";
      const envVal = process.env.NODE_ENV as string;
      const isDevEnv = envVal === "development" || envVal === "Development" || envVal === "Dev";
      
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
    const pollInterval = setInterval(async () => {
      try {
        const res = await transactionService.getAuthStatus(intentId);
        const status = res.data?.status;
        if (status === 'AUTHORIZED' || status === 'VERIFIED') {
          clearInterval(pollInterval);
          setWaitingForMobile(false);
          onSuccess({
            id: `oob-mobile-auth-${intentId}`,
            rawId: `oob-mobile-auth-${intentId}`,
            response: {
              authenticatorData: "oob-mobile-verified",
              clientDataJSON: "oob-mobile-verified",
              signature: "oob-signature",
              userHandle: `intent-${intentId}`,
            },
            type: "public-key",
            clientExtensionResults: {},
          });
        } else if (status === 'FAILED' || status === 'DENIED') {
          clearInterval(pollInterval);
          setWaitingForMobile(false);
          setError("Transaction authorization was rejected by your mobile device.");
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 3000);

    // Timeout after 60 seconds
    setTimeout(() => {
      clearInterval(pollInterval);
      setWaitingForMobile((current) => {
        if (current) {
          setError("Mobile authorization timed out.");
          return false;
        }
        return current;
      });
    }, 60000);
  };

  const initiateMobileAuthorization = async () => {
    setAuthenticating(false);
    setWaitingForMobile(true);
    setError(null);

    try {
      const intentRes = await transactionService.createIntent({
        rail: "INTERNAL",
        sourceAccountId: "AUTO",
        recipient: recipient,
        amount: amount,
        currency: "PHP",
        fee: 0.00,
        total: amount,
        idempotencyKey: "PUSH-" + Date.now(),
      });
      const data = intentRes.data as { id?: number };
      if (!data?.id) throw new Error("Invalid intent response: missing ID");
      const intentId = data.id;
      setActiveIntentId(intentId);

      await transactionService.createPushRequest(intentId, {
        amount: amount,
        sourceAccount: "Web Client",
        destinationAccount: recipient,
      });

      pollMobileApproval(intentId);
    } catch (pushErr: any) {
      console.error("Mobile authorization initiation failed", pushErr);
      setWaitingForMobile(false);
      setError("Failed to initiate mobile authorization. Please check network connectivity.");
    }
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
      
      if (err.name === 'NotAllowedError' || isLocalDev) {
        shouldStopLoading = false;
        console.warn("WebAuthn unavailable or cancelled. Falling back to Mobile Passkey Sync & QR Scan.");
        await initiateMobileAuthorization();
        return;
      }

      setError("Failed to verify Passkey. Please try again or scan the QR code with your mobile app.");
    } finally {
      if (shouldStopLoading) {
        setAuthenticating(false);
      }
    }
  };

  if (waitingForMobile) {
    const qrPayload = activeIntentId
      ? `munbank://authorize?intentId=${activeIntentId}&amount=${amount}&recipient=${encodeURIComponent(recipient)}&currency=PHP`
      : "";

    return (
      <div className="flex flex-col gap-5 items-center text-center py-6 animate-in zoom-in-95 duration-500 max-w-sm mx-auto">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center relative">
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <FingerprintIcon className="w-7 h-7 text-indigo-600 animate-pulse" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-600 tracking-wider mb-2 animate-pulse">
            PEER LIVE SYNC
          </div>
          <h2 className="text-2xl font-black text-accent mb-2">Check Your Phone</h2>
          <p className="text-sm text-accent/70 font-medium max-w-xs mx-auto mb-2">
            We've sent a secure push notification to your Expo Banking App to verify this transfer of <strong>₱{amount.toFixed(2)}</strong>.
          </p>
        </div>

        {qrPayload && (
          <div className="bg-white p-3.5 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col items-center">
            <QRCodeSVG
              value={qrPayload}
              size={180}
              level="M"
              includeMargin={false}
            />
            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-semibold text-slate-500">
              <QrCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>Scan with NovaBank Mobile App</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2.5 w-full mt-2">
          {isLocalDev && (
            <Button
              variant="secondary"
              onClick={handleSimulate}
              className="w-full py-2.5 text-sm border-2 border-indigo-500/50 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400"
            >
              [DEV] Bypass Access
            </Button>
          )}
          <Button variant="ghost" onClick={onCancel} className="w-full text-sm">
            Cancel Transfer
          </Button>
        </div>
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
          variant="secondary"
          onClick={initiateMobileAuthorization}
          className="w-full py-3.5 text-base flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm"
          disabled={authenticating}
        >
          <Smartphone className="w-4 h-4 text-indigo-600" />
          <span>Authorize on Phone / Scan QR</span>
        </Button>

        {isLocalDev && (
          <Button
            variant="secondary"
            onClick={handleSimulate}
            className="w-full py-3 text-sm border-2 border-emerald-500/50 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400"
            disabled={authenticating}
          >
            <span>[DEV] Bypass Access</span>
            <span className="sr-only">Simulate Passkey Success</span>
          </Button>
        )}

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
