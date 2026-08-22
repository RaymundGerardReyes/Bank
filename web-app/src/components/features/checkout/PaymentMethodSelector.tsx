"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { checkoutService } from "@/services/checkout/checkoutService";
import { WalletCards } from "lucide-react";

interface Props {
  sessionId?: string;
  availableMethods?: string[];
  onMethodSelected?: () => void;
  onSelect?: (method: any) => void;
  isProcessing?: boolean;
}

export const PaymentMethodSelector: React.FC<Props> = ({ 
  sessionId, 
  availableMethods = ["INTERNAL_ACCOUNT"], 
  onMethodSelected,
  onSelect,
  isProcessing = false
}) => {
  const [loading, setLoading] = useState(false);

  const handleSelect = async (method: string) => {
    if (onSelect) {
      onSelect(method);
      return;
    }
    setLoading(true);
    try {
      if (sessionId) {
        await checkoutService.selectPaymentMethod(sessionId, { paymentMethod: method });
      }
      if (onMethodSelected) {
        onMethodSelected(); // Triggers React Query to fetch the new PAYMENT_PENDING state
      }
    } catch (error) {
      console.error("Failed to select method:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <h3 className="text-sm font-bold text-gray-700 text-center mb-2">Select a Payment Method</h3>
      
      {availableMethods.includes("INTERNAL_ACCOUNT") && (
        <Button 
          onClick={() => handleSelect("INTERNAL_ACCOUNT")} 
          isLoading={loading}
          className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center gap-2"
        >
          <WalletCards className="w-5 h-5" />
          Pay with Nova Bank Account
        </Button>
      )}

      {availableMethods.length === 0 && (
        <p className="text-center text-sm text-rose-500">No payment methods available for this session.</p>
      )}
    </div>
  );
};