"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { paymentService } from "@/services/gateway/paymentService";
import { PaymentIntent } from "@/models/GatewayModels";
import { PaymentStatusBadge } from "@/components/gateway/PaymentStatusBadge";
import { MoneyDisplay } from "@/components/gateway/MoneyDisplay";
import { Button } from "@/components/common/Button";

export default function PaymentIntentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const intentId = params.intentId as string;

  const [payment, setPayment] = useState<PaymentIntent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "TIMELINE" | "REFUNDS">("OVERVIEW");

  useEffect(() => {
    paymentService.getPayment(intentId)
      .then(res => setPayment(res.data || null))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [intentId]);

  if (isLoading) {
    return <div className="p-12 text-center text-accent/50 font-bold animate-pulse">Loading payment details...</div>;
  }

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-accent/50 gap-4">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="font-bold">Payment Intent Not Found</span>
        <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in">
      {/* Header */}
      <div className="flex items-start justify-between bg-surface border border-secondary/20 p-6 rounded-2xl shadow-sm">
         <div>
            <div className="flex items-center gap-4 mb-2">
               <h1 className="text-2xl font-black text-accent font-mono">{payment.intentId}</h1>
               <PaymentStatusBadge status={payment.status} />
            </div>
            <p className="text-accent/60 font-medium">Created {new Date(payment.createdAt).toLocaleString()}</p>
         </div>
         <div className="text-right">
            <span className="block text-xs font-bold text-accent/50 uppercase tracking-widest mb-1">Amount</span>
            <h2 className="text-3xl font-black text-accent">
              <MoneyDisplay amount={payment.amount} currency={payment.currency} />
            </h2>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-secondary/20">
         {["OVERVIEW", "TIMELINE", "REFUNDS"].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab as any)}
             className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
               activeTab === tab 
                 ? "border-accent text-accent" 
                 : "border-transparent text-accent/50 hover:text-accent hover:bg-secondary/5"
             }`}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* Tab Content */}
      <div className="bg-surface border border-secondary/20 p-6 rounded-2xl shadow-sm min-h-[300px]">
         {activeTab === "OVERVIEW" && (
           <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                 <span className="text-xs font-bold text-accent/50 uppercase">Merchant ID</span>
                 <span className="font-medium text-accent">{payment.merchantId}</span>
              </div>
              <div className="flex flex-col gap-2">
                 <span className="text-xs font-bold text-accent/50 uppercase">Currency</span>
                 <span className="font-medium text-accent">{payment.currency}</span>
              </div>
              <div className="flex flex-col gap-2">
                 <span className="text-xs font-bold text-accent/50 uppercase">Last Updated</span>
                 <span className="font-medium text-accent">{payment.updatedAt ? new Date(payment.updatedAt).toLocaleString() : 'N/A'}</span>
              </div>
           </div>
         )}
         
         {activeTab === "TIMELINE" && (
           <div className="flex flex-col items-center justify-center h-full text-accent/40 font-medium italic">
              Timeline events would be populated from audit logs here.
           </div>
         )}
         
         {activeTab === "REFUNDS" && (
           <div className="flex flex-col items-center justify-center h-full gap-4">
              {payment.status === "CAPTURED" || payment.status === "SETTLED" ? (
                <>
                  <p className="text-accent/60 font-medium">Eligible for refund.</p>
                  <Button variant="danger">Initiate Refund</Button>
                </>
              ) : (
                <p className="text-accent/40 font-medium italic">Payment status must be CAPTURED or SETTLED to initiate a refund.</p>
              )}
           </div>
         )}
      </div>
    </div>
  );
}
