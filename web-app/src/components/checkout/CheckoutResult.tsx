import React from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface CheckoutResultProps {
  status: string;
}

export const CheckoutResult: React.FC<CheckoutResultProps> = ({ status }) => {
  if (status === "SUCCESS" || status === "COMPLETED") {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful</h2>
        <p className="text-gray-500">Your transaction has been securely processed and the institution has been notified.</p>
      </div>
    );
  }

  if (status === "EXPIRED") {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
        <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Expired</h2>
        <p className="text-gray-500">This payment session has timed out. Please return to the institution to generate a new payment request.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
      <p className="text-gray-500">The session was terminated or cancelled. Please initiate a new transaction.</p>
    </div>
  );
};