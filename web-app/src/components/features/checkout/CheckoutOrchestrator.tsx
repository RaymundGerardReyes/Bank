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
import { QrPhCheckoutView } from "./QrPhCheckoutView";
import { CheckoutConfirmation } from "./CheckoutConfirmation";
import { TerminalStateScreen } from "./TerminalStateScreen";

export const CheckoutOrchestrator = ({ 
  sessionId,
  clientReturnUrl,
  clientCancelUrl,
}: { 
  sessionId: string;
  clientReturnUrl?: string;
  clientCancelUrl?: string;
}) => {
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
  const effectiveReturnUrl = session.returnUrl || clientReturnUrl;
  const effectiveCancelUrl = session.cancelUrl || clientCancelUrl;

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
    // If the backend has locked the session (or it's terminal), lock the UI immediately
    if (session.locked && session.status !== "PAID" && session.status !== "PAYMENT_FAILED" && session.status !== "CANCELLED") {
      return (
        <TerminalStateScreen
          type="EXPIRED"
          message="This checkout session has expired and is locked."
          reference={session.id}
          returnUrl={effectiveReturnUrl}
          cancelUrl={effectiveCancelUrl}
          merchantName={session.merchantName}
          locked={true}
        />
      );
    }

    switch (session.status) {
      case "ACTIVE":
        return <PaymentMethodSelector sessionId={sessionId} onMethodSelected={refetch} availableMethods={session.paymentMethods || []} />;
      case "PAYMENT_PENDING":
        if (session.selectedPaymentMethod === "QR_PH") {
          return (
            <QrPhCheckoutView
              sessionId={sessionId}
              session={session}
              onPaid={refetch}
              onChangeMethod={() => {
                // Allows user to revert and re-select payment method
                checkoutService.selectPaymentMethod(sessionId, { paymentMethod: "INTERNAL_ACCOUNT" })
                  .then(() => refetch())
                  .catch(() => refetch());
              }}
            />
          );
        }
        return <InternalAccountAuthorization sessionId={sessionId} onAuthorized={refetch} />;
      case "AUTHORIZED":
        return <CheckoutConfirmation sessionId={sessionId} onConfirmed={refetch} />;
      case "PAID":
        return (
          <TerminalStateScreen
            type="SUCCESS"
            message="Payment completed successfully."
            reference={session.id}
            returnUrl={effectiveReturnUrl}
            cancelUrl={effectiveCancelUrl}
            merchantName={session.merchantName}
            locked={session.locked ?? true}
          />
        );
      case "PAYMENT_FAILED":
        return (
          <TerminalStateScreen
            type="FAILED"
            message="Payment could not be completed. Please contact support."
            reference={session.id}
            returnUrl={effectiveReturnUrl}
            cancelUrl={effectiveCancelUrl}
            merchantName={session.merchantName}
            locked={session.locked ?? true}
          />
        );
      case "EXPIRED":
        return (
          <TerminalStateScreen
            type="EXPIRED"
            message="This checkout session has expired."
            reference={session.id}
            returnUrl={effectiveReturnUrl}
            cancelUrl={effectiveCancelUrl}
            merchantName={session.merchantName}
            locked={session.locked ?? true}
          />
        );
      case "CANCELLED":
        return (
          <TerminalStateScreen
            type="CANCELLED"
            message="This checkout session was cancelled by the merchant."
            reference={session.id}
            returnUrl={effectiveReturnUrl}
            cancelUrl={effectiveCancelUrl}
            merchantName={session.merchantName}
            locked={session.locked ?? true}
          />
        );
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
