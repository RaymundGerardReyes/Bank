"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { checkoutService } from "@/services/checkout/checkoutService";
import { QrCode, WalletCards } from "lucide-react";

interface Props {
  sessionId?: string;
  availableMethods?: string[];
  onMethodSelected?: () => void;
  onSelect?: (method: any) => void;
  isProcessing?: boolean;
}

export const PaymentMethodSelector: React.FC<Props> = ({ 
  sessionId, 
  availableMethods = ["INTERNAL_ACCOUNT", "QR_PH"], 
  onMethodSelected,
  onSelect,
  isProcessing = false
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (method: string) => {
    if (onSelect) {
      onSelect(method);
      return;
    }
    setError(null);
    setSelectedMethod(method);
    setLoading(true);
    try {
      if (sessionId) {
        await checkoutService.selectPaymentMethod(sessionId, { paymentMethod: method });
      }
      if (onMethodSelected) {
        onMethodSelected(); // Triggers React Query to fetch the new PAYMENT_PENDING state
      }
    } catch (err: any) {
      console.error("Failed to select method:", err);
      setError(err?.message || "Failed to select payment method. Please try again.");
    } finally {
      setLoading(false);
      setSelectedMethod(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <h3 className="text-sm font-bold text-gray-700 text-center mb-2">Select a Payment Method</h3>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg text-center font-medium">
          {error}
        </div>
      )}
      
      {availableMethods.includes("INTERNAL_ACCOUNT") && (
        <Button 
          onClick={() => handleSelect("INTERNAL_ACCOUNT")} 
          isLoading={loading && selectedMethod === "INTERNAL_ACCOUNT"}
          disabled={isProcessing || (loading && selectedMethod !== "INTERNAL_ACCOUNT")}
          className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center gap-2.5 font-medium transition-all shadow-sm rounded-xl"
          aria-label="Pay with Nova Bank Account"
        >
          <WalletCards className="w-5 h-5" />
          Pay with Nova Bank Account
        </Button>
      )}

      {availableMethods.includes("QR_PH") && (
        <Button 
          onClick={() => handleSelect("QR_PH")} 
          isLoading={loading && selectedMethod === "QR_PH"}
          disabled={isProcessing || (loading && selectedMethod !== "QR_PH")}
          className="w-full py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 hover:from-blue-800 hover:via-indigo-800 hover:to-sky-800 text-white flex items-center justify-center gap-2.5 font-semibold transition-all shadow-sm rounded-xl"
          aria-label="Pay with QR Ph (InstaPay / Any Banking App)"
        >
          <QrCode className="w-5 h-5" />
          Pay with QR Ph (InstaPay / Any App)
        </Button>
      )}

      {availableMethods.length === 0 && (
        <p className="text-center text-sm text-rose-500">No payment methods available for this session.</p>
      )}
    </div>
  );
};