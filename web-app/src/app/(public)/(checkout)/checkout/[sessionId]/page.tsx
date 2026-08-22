import React from "react";
import { CheckoutOrchestrator } from "@/components/features/checkout/CheckoutOrchestrator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout | Nova Bank",
  description: "Complete your secure payment via Nova Bank.",
};

export default function CheckoutPage({ params }: { params: { sessionId: string } }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        {/* Render the client-side state machine orchestrator */}
        <CheckoutOrchestrator sessionId={params.sessionId} />
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-400 font-medium tracking-wide flex items-center justify-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        SECURED BY NOVA BANK
      </div>
    </div>
  );
}
