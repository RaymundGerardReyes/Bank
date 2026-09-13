"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { PublicCheckoutSession, checkoutService } from "@/services/checkout/checkoutService";
import { formatCurrency } from "@/utils/formatters";
import { QrCode, ArrowLeft, CheckCircle2, Copy, Check, Smartphone, ShieldCheck } from "lucide-react";

interface Props {
  sessionId: string;
  session: PublicCheckoutSession;
  onPaid: () => void;
  onChangeMethod?: () => void;
}

export const QrPhCheckoutView: React.FC<Props> = ({
  sessionId,
  session,
  onPaid,
  onChangeMethod
}) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expiresAt = session.qrExpiresAt || session.expiresAt;
  const qrRef = session.qrReference || `QR-${session.id.substring(0, 10).toUpperCase()}`;

  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const expiration = new Date(expiresAt).getTime();
      const difference = expiration - now;

      if (difference <= 0) {
        setTimeLeft("00:00");
      } else {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleCopy = () => {
    if (qrRef) {
      navigator.clipboard.writeText(qrRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulatePayment = async () => {
    setSimulating(true);
    setError(null);
    try {
      await checkoutService.simulateQrPayment(sessionId);
      onPaid();
    } catch (err: any) {
      console.error("QR simulation error:", err);
      setError(err?.message || "Failed to simulate QR payment. Please try again.");
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 animate-in fade-in duration-300 max-w-sm mx-auto">
      {/* QR Ph Brand Header */}
      <div className="w-full text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide uppercase mb-2">
          <QrCode className="w-3.5 h-3.5 text-blue-600" />
          QR Ph National Standard
        </div>
        <h3 className="text-lg font-black text-gray-900">Scan & Pay with Any Banking App</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Scan using GCash, Maya, BDO, BPI, UnionBank, or any InstaPay app.
        </p>
      </div>

      {error && (
        <div className="w-full p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      {/* QR Code Presentation Box */}
      <div className="relative p-6 bg-white border-2 border-dashed border-gray-300 rounded-2xl shadow-sm flex flex-col items-center justify-center w-64 h-64">
        {/* Dynamic visual representation of the QR code */}
        <div className="w-48 h-48 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 opacity-85 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:8px_8px]" />
          
          {/* Corner Markers */}
          <div className="absolute top-2 left-2 w-7 h-7 border-4 border-gray-900 rounded-md flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-gray-900 rounded-sm" />
          </div>
          <div className="absolute top-2 right-2 w-7 h-7 border-4 border-gray-900 rounded-md flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-gray-900 rounded-sm" />
          </div>
          <div className="absolute bottom-2 left-2 w-7 h-7 border-4 border-gray-900 rounded-md flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-gray-900 rounded-sm" />
          </div>

          {/* Center Brand Badge */}
          <div className="w-11 h-11 bg-white border-2 border-blue-600 rounded-xl z-10 flex items-center justify-center shadow-md">
            <span className="text-blue-700 font-black text-sm tracking-tighter">QR Ph</span>
          </div>
        </div>

        {/* Amount overlay badge */}
        <div className="absolute -bottom-3 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {formatCurrency(session.amount, session.currency)}
        </div>
      </div>

      {/* Meta Information Bar */}
      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col gap-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">QR Reference</span>
          <button 
            onClick={handleCopy}
            className="font-mono font-bold text-gray-800 hover:text-blue-600 flex items-center gap-1 transition-colors"
            title="Click to copy reference"
          >
            {qrRef.length > 18 ? `${qrRef.substring(0, 16)}...` : qrRef}
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Time Remaining</span>
          <span className="font-mono font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
            {timeLeft || "15:00"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-2 mt-1">
        {/* Sandbox / Simulation Helper */}
        <Button
          onClick={handleSimulatePayment}
          isLoading={simulating}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-sm"
          aria-label="Simulate scanning and completing payment"
        >
          <Smartphone className="w-4 h-4" />
          Simulate App Scan & Pay
        </Button>

        {onChangeMethod && (
          <button
            onClick={onChangeMethod}
            disabled={simulating}
            className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1.5 transition-colors font-medium mt-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Change payment method
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Protected by Bangko Sentral ng Pilipinas (BSP) QR Ph Standard
      </div>
    </div>
  );
};

