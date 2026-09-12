"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, AlertCircle, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  type: "SUCCESS" | "FAILED" | "EXPIRED" | "CANCELLED";
  message: string;
  reference?: string;
  returnUrl?: string;
  cancelUrl?: string;
  merchantName?: string;
  locked?: boolean;
}

const isExternalClientUrl = (url?: string): boolean => {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  // Reject internal routes, non-existent /success or /cancel endpoints, and placeholder tokens
  if (
    trimmed.includes("/checkout/") || 
    trimmed.endsWith("/success") || 
    trimmed.endsWith("/cancel") || 
    trimmed.includes("NO_RETURN_URL") || 
    trimmed.includes("CLIENT_RETURN_PENDING")
  ) {
    return false;
  }
  try {
    if (trimmed.startsWith("/")) return true;
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const TerminalStateScreen: React.FC<Props> = ({
  type,
  message,
  reference,
  returnUrl,
  cancelUrl,
  merchantName,
  locked = true,
}) => {
  const config = {
    SUCCESS: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", title: "Payment Successful" },
    FAILED: { icon: XCircle, color: "text-rose-500", bg: "bg-rose-50", title: "Payment Failed" },
    EXPIRED: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", title: "Session Expired" },
    CANCELLED: { icon: AlertCircle, color: "text-gray-500", bg: "bg-gray-100", title: "Session Cancelled" },
  };

  const { icon: Icon, color, bg, title } = config[type];

  // Resolve target return URL based on session outcome
  let resolvedTarget = type === "SUCCESS" ? returnUrl : (cancelUrl || returnUrl);

  // If not a valid external client URL, fallback to browser document.referrer
  if (!isExternalClientUrl(resolvedTarget) && typeof document !== "undefined" && document.referrer) {
    try {
      const ref = new URL(document.referrer);
      // Only use referrer if it came from an external client website (e.g. ammazona.com), not the checkout page itself
      if (ref.origin !== window.location.origin && !ref.pathname.includes("/checkout/")) {
        resolvedTarget = document.referrer;
      }
    } catch {}
  }

  const targetUrl = isExternalClientUrl(resolvedTarget) ? resolvedTarget : undefined;

  const [countdown, setCountdown] = useState(5);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!targetUrl || isPaused) return;

    if (countdown <= 0) {
      window.location.href = targetUrl;
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [targetUrl, isPaused, countdown]);

  return (
    <div className="flex flex-col items-center text-center py-6 animate-in fade-in duration-500">
      {/* Session Lock Security Badge */}
      {locked && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 mb-4 border border-gray-200 shadow-sm">
          <Lock className="w-3.5 h-3.5 text-gray-500" />
          <span>Session Finalized &amp; Locked</span>
        </div>
      )}

      {/* Outcome Status Icon */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${bg}`}>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>

      <h2 className="text-xl font-black text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-600 mb-4">{message}</p>

      {/* Reference Card */}
      {reference && (
        <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg w-full mb-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Reference Number</p>
          <p className="text-xs font-mono text-gray-700 select-all">{reference}</p>
        </div>
      )}

      {/* Locked Notice */}
      <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3 my-2 w-full text-left flex items-start gap-2">
        <Lock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <p>
          This transaction has reached a terminal state and is locked. It cannot be modified, re-authorized, or charged again across any browser or tab.
        </p>
      </div>

      {/* Return Navigation & Auto-Redirect */}
      {targetUrl ? (
        <div className="w-full mt-4 flex flex-col items-center gap-3">
          {!isPaused ? (
            <p className="text-xs text-gray-600">
              Redirecting back to <strong className="text-gray-900 font-semibold">{merchantName || "client application"}</strong> in{" "}
              <span className="inline-block px-1.5 py-0.5 rounded bg-gray-200 font-mono font-bold text-gray-900 text-xs">
                {countdown}s
              </span>
            </p>
          ) : (
            <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
              Auto-redirect paused
            </p>
          )}

          <Button
            onClick={() => {
              window.location.href = targetUrl;
            }}
            className="w-full py-3.5 bg-gray-900 hover:bg-black text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to {merchantName || "Client Application"}
          </Button>

          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
          >
            {isPaused ? "Resume auto-redirect" : "Pause auto-redirect"}
          </button>
        </div>
      ) : (
        <div className="w-full mt-4 flex flex-col items-center gap-3">
          <p className="text-xs text-gray-500">
            Payment has been finalized. You may safely return to your client application or close this window.
          </p>
          {typeof window !== "undefined" && window.history.length > 1 && (
            <Button
              onClick={() => window.history.back()}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Previous Page
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
