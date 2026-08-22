"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { formatCurrency } from "@/utils/formatters";
import { checkoutService } from "@/services/checkout/checkoutService";

// Sub-components (We will create these next)
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { InternalAccountAuthorization } from "./InternalAccountAuthorization";
import { CheckoutConfirmation } from "./CheckoutConfirmation";
import { TerminalStateScreen } from "./TerminalStateScreen";

export const CheckoutOrchestrator = ({ sessionId }: { sessionId: string }) => {
  // Fetch authoritative state from the secure read model
  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ["checkoutSession", sessionId],
    queryFn: () => checkoutService.getSessionDetails(sessionId),
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      // Poll backend strictly while transitioning states asynchronously
      if (status === "PAYMENT_PENDING" || status === "AUTHORIZING") return 3000;
      return false; // Stop polling on terminal or user-input states
    }
  });

  if (isLoading) return <LoadingOverlay />;
  
  if (error || !response?.success) {
    return <ErrorBanner message={response?.message || "Failed to load secure checkout session."} />;
  }

  const session = response.data;

  // The Header remains static and read-only, displaying server-derived totals
  const CheckoutHeader = () => (
    <div className="text-center mb-6 border-b pb-6">
      <h2 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">
        {session.merchantName || "Merchant"}
      </h2>
      <div className="bg-gray-100 p-4 rounded-xl inline-block w-full border border-gray-200">
        <p className="text-sm font-medium text-gray-600 mb-1 truncate">{session.description || "Order Payment"}</p>
        <p className="text-3xl font-black text-gray-900">
          {formatCurrency(session.amount, session.currency)}
        </p>
      </div>
    </div>
  );

  // STATE MACHINE ROUTER: The UI strictly obeys the backend status
  const renderState = () => {
    switch (session.status) {
      case "ACTIVE":
        return <PaymentMethodSelector sessionId={sessionId} onMethodSelected={refetch} availableMethods={session.paymentMethods || []} />;
      case "PAYMENT_PENDING":
        return <InternalAccountAuthorization sessionId={sessionId} onAuthorized={refetch} />;
      case "AUTHORIZED":
        return <CheckoutConfirmation sessionId={sessionId} onConfirmed={refetch} />;
      case "PAID":
        return <TerminalStateScreen type="SUCCESS" message="Payment successful" reference={session.id} />;
      case "PAYMENT_FAILED":
        return <TerminalStateScreen type="FAILED" message="Payment could not be completed. Please contact support." />;
      case "EXPIRED":
        return <TerminalStateScreen type="EXPIRED" message="This checkout session has expired." />;
      case "CANCELLED":
        return <TerminalStateScreen type="CANCELLED" message="This checkout session was cancelled by the merchant." />;
      default:
        return <ErrorBanner message={`Unknown session state encountered: ${session.status}`} />;
    }
  };

  return (
    <Card className="p-8 shadow-2xl border-0 ring-1 ring-gray-900/5 rounded-2xl bg-white">
      <CheckoutHeader />
      {renderState()}
    </Card>
  );
};
