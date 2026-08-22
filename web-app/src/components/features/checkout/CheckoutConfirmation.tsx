"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { checkoutService } from "@/services/checkout/checkoutService";
import { CheckCircle2 } from "lucide-react";

interface Props {
  sessionId: string;
  onConfirmed: () => void;
}

export const CheckoutConfirmation: React.FC<Props> = ({ sessionId, onConfirmed }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await checkoutService.confirmPayment(sessionId);
      onConfirmed(); // Advances to PAID
    } catch (e: any) {
      setError(e.message || "Failed to confirm payment.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 text-center animate-in zoom-in-95 duration-300">
      <div className="p-5 bg-sky-50 border border-sky-100 rounded-xl">
        <CheckCircle2 className="w-8 h-8 text-sky-600 mx-auto mb-2" />
        <h3 className="font-bold text-sky-900 mb-1">Authorization Complete</h3>
        <p className="text-xs text-sky-700">
          Your funds have been verified. Click below to securely capture the payment and complete your order.
        </p>
      </div>

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

      <Button onClick={handleConfirm} isLoading={loading} className="w-full bg-gray-900 hover:bg-black py-4">
        Confirm & Pay Now
      </Button>
    </div>
  );
};
