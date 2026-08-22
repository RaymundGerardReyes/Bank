"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { checkoutService } from "@/services/checkout/checkoutService";
import { ShieldCheck } from "lucide-react";

interface Props {
  sessionId: string;
  onAuthorized: () => void;
}

export const InternalAccountAuthorization: React.FC<Props> = ({ sessionId, onAuthorized }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuthorize = async () => {
    if (!accountNumber) {
      setError("Please enter your account number.");
      return;
    }
    setLoading(true);
    setError("");
    
    try {
      await checkoutService.authorizeAccount(sessionId, { customerAccountNumber: accountNumber });
      onAuthorized(); // Triggers React Query to fetch the new AUTHORIZED state
    } catch (e: any) {
      setError(e.message || "Authorization failed. Please check your account balance.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="text-center">
        <ShieldCheck className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
        <h3 className="text-md font-bold text-gray-800">Authenticate Account</h3>
        <p className="text-xs text-gray-500 mt-1">Enter your Nova Bank account number to authorize this transaction.</p>
      </div>

      <div className="mt-2">
        <Input
          label="Account Number"
          placeholder="e.g. CUST-1001"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          disabled={loading}
        />
        {error && <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>}
      </div>

      <Button onClick={handleAuthorize} isLoading={loading} className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
        Verify & Authorize
      </Button>
    </div>
  );
};
