"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import React, { useState, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/Button";
import { PublicCheckoutSession, checkoutService } from "@/services/checkout/checkoutService";
import { formatCurrency } from "@/utils/formatters";
import { ArrowLeft, Copy, Check, Smartphone, ShieldCheck, Download, AlertTriangle, Clock } from "lucide-react";
import { getVectorLogoDataUri } from "./QrLogoGenerator";

const QR_CANVAS_SIZE = 280;
const QR_LOGO_SIZE = Math.round(QR_CANVAS_SIZE * 0.20); // 20% of canvas

// ---------------------------------------------------------------------------
// QR Ph Logo — inline Base64 SVG Data URI (no external asset required)
// Colors: BSP-mandated Blue (#203a70), Red (#ce2029), Yellow (#fcd116)
// Helpers: Robust Expiration Parser (Fixes timezone jump bug)
// ---------------------------------------------------------------------------
const QR_PH_LOGO_URI: string = (() => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <path d="M 20 65 V 35 Q 20 20, 35 20 H 65 L 75 30 L 65 40 H 35 Q 30 40, 30 45 V 65 Z" fill="#203a70" />
    <path d="M 80 35 V 65 Q 80 80, 65 80 H 35 L 25 70 L 35 60 H 65 Q 70 60, 70 55 V 35 Z" fill="#ce2029" />
    <circle cx="50" cy="50" r="16" fill="#fcd116" />
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
})();
export function computeTimeLeft(
  expiresAt: string | null | undefined,
  sessionStatus?: string
): { display: string; expired: boolean; urgent: boolean } {
  if (sessionStatus === "EXPIRED") {
    return { display: "00:00", expired: true, urgent: true };
  }
  if (!expiresAt) {
    return { display: "15:00", expired: false, urgent: false };
  }

const QR_CANVAS_SIZE = 280;
const QR_LOGO_SIZE = Math.round(QR_CANVAS_SIZE * 0.2); // 20% of canvas
  let normalized = expiresAt.trim();
  // If backend serializes LocalDateTime without timezone info (e.g., 2026-09-13T15:52:11.977),
  // JavaScript parsers in local time zones (e.g. GMT+8) will treat it as local time rather than UTC,
  // causing an 8-hour past jump and falsely marking the QR as expired immediately.
  if (normalized.includes("T") && !normalized.endsWith("Z") && !/[+-]\d{2}(:\d{2})?$/.test(normalized)) {
    normalized += "Z";
  }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function computeTimeLeft(expiresAt: string | null): { display: string; expired: boolean; urgent: boolean } {
  if (!expiresAt) return { display: "15:00", expired: false, urgent: false };
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return { display: "00:00", expired: true, urgent: true };
  let expiration = new Date(normalized).getTime();
  if (isNaN(expiration)) {
    expiration = new Date(expiresAt).getTime();
  }
  if (isNaN(expiration)) {
    return { display: "15:00", expired: false, urgent: false };
  }

  const diff = expiration - Date.now();
  if (diff <= 0) {
    return { display: "00:00", expired: true, urgent: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    display: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    expired: false,
    urgent: totalSeconds <= 60,
  };
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  sessionId: string;
  session: PublicCheckoutSession;
  onPaid: () => void;
  onChangeMethod?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const QrPhCheckoutView: React.FC<Props> = ({
  sessionId,
  session,
  onPaid,
  onChangeMethod,
}) => {
  const expiresAt = session.qrExpiresAt ?? session.expiresAt ?? null;
  const logoUri = getVectorLogoDataUri();

  const [timeState, setTimeState] = useState(() =>
    computeTimeLeft(session.qrExpiresAt ?? session.expiresAt ?? null)
    computeTimeLeft(expiresAt, session.status)
  );
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The actual EMVCo TLV payload from the backend — this is what gets encoded in the QR
  // The actual EMVCo TLV payload from the backend — this is encoded in the QR code
  const paymentPayload = session.qrPayload ?? "";
  const qrRef = session.qrReference ?? `QR-${session.id.substring(0, 10).toUpperCase()}`;
  const expiresAt = session.qrExpiresAt ?? session.expiresAt ?? null;

  // ------------------------------------------------------------------
  // Countdown timer — re-computes every second from qrExpiresAt
  // Countdown timer — re-computes every second from qrExpiresAt / expiresAt
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!expiresAt) return;

    // Immediate tick so the display is correct on mount
    setTimeState(computeTimeLeft(expiresAt));
    // Immediate tick on mount
    setTimeState(computeTimeLeft(expiresAt, session.status));

    const interval = setInterval(() => {
      setTimeState(computeTimeLeft(expiresAt));
      setTimeState(computeTimeLeft(expiresAt, session.status));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);
  }, [expiresAt, session.status]);

  // ------------------------------------------------------------------
  // Copy QR reference to clipboard
  // ------------------------------------------------------------------
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(qrRef).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [qrRef]);

  // ------------------------------------------------------------------
  // Simulate payment (sandbox helper)
  // ------------------------------------------------------------------
  const handleSimulatePayment = useCallback(async () => {
    setSimulating(true);
    setError(null);
    try {
      await checkoutService.simulateQrPayment(sessionId);
      onPaid();
    } catch (err: any) {
      console.error("QR simulation error:", err);
      setError(err?.message ?? "Failed to simulate QR payment. Please try again.");
    } finally {
      setSimulating(false);
    }
  }, [sessionId, onPaid]);

  // ------------------------------------------------------------------
  // Download QR code as PNG
  // Download QR code as PNG from HTML5 Canvas
  // ------------------------------------------------------------------
  const handleDownload = useCallback(() => {
    const canvas = document.getElementById("qr-canvas-element") as HTMLCanvasElement | null;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const dataUrl = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `QRPh-${qrRef}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrRef]);

  // ------------------------------------------------------------------
  // Guard: no payload yet (shouldn't happen but defensive)
  // ------------------------------------------------------------------
  const hasPayload = paymentPayload.length > 0;

  return (
    <div className="flex flex-col items-center gap-5 animate-in fade-in duration-300 max-w-sm mx-auto">

      {/* ── Brand Header ── */}
      <div className="w-full text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide uppercase mb-2">
          {/* QR Ph icon rendered via the same SVG inline */}
          {/* QR Ph National Standard icon */}
          <svg width="14" height="14" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M 20 65 V 35 Q 20 20, 35 20 H 65 L 75 30 L 65 40 H 35 Q 30 40, 30 45 V 65 Z" fill="#203a70" />
            <path d="M 80 35 V 65 Q 80 80, 65 80 H 35 L 25 70 L 35 60 H 65 Q 70 60, 70 55 V 35 Z" fill="#ce2029" />
            <circle cx="50" cy="50" r="16" fill="#fcd116" />
          </svg>
          QR Ph National Standard
        </div>
        <h3 className="text-lg font-black text-gray-900">Scan &amp; Pay with Any Banking App</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          GCash · Maya · BDO · BPI · UnionBank · InstaPay-enabled apps
        </p>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="w-full p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center font-medium flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── QR Code Canvas ── */}
      <div className="relative flex flex-col items-center">
        <div className="p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-md">
          {hasPayload ? (
            <QRCodeCanvas
              id="qr-canvas-element"
              value={paymentPayload}
              size={QR_CANVAS_SIZE}
              level="H"
              marginSize={2}
              imageSettings={{
                src: QR_PH_LOGO_URI,
                src: logoUri,
                x: undefined,
                y: undefined,
                height: QR_LOGO_SIZE,
                width: QR_LOGO_SIZE,
                excavate: true,
              }}
            />
          ) : (
            // Skeleton placeholder while payload arrives
            // Loading skeleton placeholder
            <div
              className="flex items-center justify-center bg-gray-100 rounded-lg"
              style={{ width: QR_CANVAS_SIZE, height: QR_CANVAS_SIZE }}
            >
              <svg width="56" height="56" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                <path d="M 20 65 V 35 Q 20 20, 35 20 H 65 L 75 30 L 65 40 H 35 Q 30 40, 30 45 V 65 Z" fill="#203a70" />
                <path d="M 80 35 V 65 Q 80 80, 65 80 H 35 L 25 70 L 35 60 H 65 Q 70 60, 70 55 V 35 Z" fill="#ce2029" />
                <circle cx="50" cy="50" r="16" fill="#fcd116" />
              </svg>
            </div>
          )}
        </div>

        {/* Amount pill pinned to bottom of the QR box */}
        <div className="absolute -bottom-3.5 bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide">
          {formatCurrency(session.amount, session.currency)}
        </div>
      </div>

      {/* ── Meta: Reference + Timer ── */}
      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col gap-2.5 text-xs mt-2">
        {/* QR Reference */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">QR Reference</span>
          <button
            onClick={handleCopy}
            className="font-mono font-bold text-gray-800 hover:text-blue-600 flex items-center gap-1 transition-colors"
            title="Click to copy reference"
          >
            <span className="truncate max-w-[160px]">
              {qrRef.length > 22 ? `${qrRef.substring(0, 20)}…` : qrRef}
            </span>
            {copied
              ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              : <Copy className="w-3.5 h-3.5 opacity-60 shrink-0" />
            }
          </button>
        </div>

        {/* Countdown Timer */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Time Remaining
          </span>
          <span
            className={`font-mono font-bold px-2 py-0.5 rounded border ${
              timeState.expired
                ? "text-gray-400 bg-gray-100 border-gray-200 line-through"
                : timeState.urgent
                  ? "text-rose-600 bg-rose-50 border-rose-200 animate-pulse"
                  : "text-rose-600 bg-rose-50 border-rose-100"
            }`}
          >
            {timeState.display}
          </span>
        </div>

        {timeState.expired && (
          <p className="text-center text-rose-500 font-semibold text-[11px] mt-0.5">
            QR code has expired. Please restart the checkout.
          </p>
        )}
      </div>

      {/* ── Action Buttons ── */}
      <div className="w-full flex flex-col gap-2 mt-1">
        {/* Download QR */}
        {hasPayload && (
          <button
            onClick={handleDownload}
            className="w-full py-2.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-400 bg-white rounded-xl flex items-center justify-center gap-1.5 transition-colors font-medium shadow-sm"
            aria-label="Download QR code as PNG"
          >
            <Download className="w-3.5 h-3.5" />
            Download QR Code
          </button>
        )}

        {/* Sandbox simulate button */}
        <Button
          onClick={handleSimulatePayment}
          isLoading={simulating}
          disabled={timeState.expired}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Simulate scanning and completing payment"
        >
          <Smartphone className="w-4 h-4" />
          Simulate App Scan &amp; Pay
        </Button>

        {/* Change payment method */}
        {onChangeMethod && (
          <button
            onClick={onChangeMethod}
            disabled={simulating}
            className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1.5 transition-colors font-medium mt-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Change payment method
          </button>
        )}
      </div>

      {/* ── BSP Trust Footer ── */}
      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        Protected by Bangko Sentral ng Pilipinas (BSP) QR Ph Standard
      </div>
    </div>
  );
};
