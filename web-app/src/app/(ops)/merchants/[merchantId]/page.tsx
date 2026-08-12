"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { merchantService } from "@/services/gateway/merchantService";
import { Merchant, MerchantLifecycleStage } from "@/models/GatewayModels";
import { MerchantLifecycleStepper } from "@/components/gateway/MerchantLifecycleStepper";
import { Button } from "@/components/common/Button";
import { useAuthStore } from "@/state/authStore";

export default function OpsMerchantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params.merchantId as string;
  const { user } = useAuthStore();

  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"INFO" | "RISK" | "KEYS" | "PAYMENTS" | "AUDIT">("INFO");
  const [isAdvancing, setIsAdvancing] = useState(false);

  const fetchMerchant = async () => {
    setIsLoading(true);
    try {
      const res = await merchantService.getMerchant(merchantId);
      setMerchant(res.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchant();
  }, [merchantId]);

  const handleAdvance = async (nextStatus: MerchantLifecycleStage) => {
    if (!merchant || !user) return;
    setIsAdvancing(true);
    try {
      await merchantService.advanceLifecycle(
        merchantId, 
        merchant.status, 
        nextStatus, 
        user.username || "ops_system",
        nextStatus === "RISK_ASSESSMENT" ? "LOW" : undefined // Mock setting a risk profile during advance
      );
      await fetchMerchant();
    } catch (err) {
      console.error(err);
      alert("Failed to advance lifecycle");
    } finally {
      setIsAdvancing(false);
    }
  };

  const getNextStageAction = (status: MerchantLifecycleStage) => {
    switch (status) {
      case "APPLICATION": return { label: "Advance to KYB", next: "KYB" as MerchantLifecycleStage };
      case "KYB": return { label: "Pass Screening", next: "SCREENING" as MerchantLifecycleStage };
      case "SCREENING": return { label: "Request Risk Assessment", next: "RISK_ASSESSMENT" as MerchantLifecycleStage };
      case "RISK_ASSESSMENT": return { label: "Submit for Compliance Review", next: "COMPLIANCE_REVIEW" as MerchantLifecycleStage };
      case "COMPLIANCE_REVIEW": return { label: "Approve Merchant", next: "APPROVED" as MerchantLifecycleStage };
      case "APPROVED": return { label: "Activate Merchant", next: "ACTIVE" as MerchantLifecycleStage };
      default: return null;
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-accent/50 font-bold animate-pulse">Loading merchant details...</div>;
  }

  if (!merchant) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-accent/50 gap-4">
        <span className="font-bold">Merchant Not Found</span>
        <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const nextAction = getNextStageAction(merchant.status);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-black text-accent">{merchant.legalName}</h1>
            <p className="text-accent/60 font-medium font-mono mt-1">Code: {merchant.merchantCode}</p>
         </div>
         {nextAction && (
           <div className="flex gap-2">
              <Button variant="danger" disabled={isAdvancing}>Reject</Button>
              <Button onClick={() => handleAdvance(nextAction.next)} isLoading={isAdvancing}>
                {nextAction.label}
              </Button>
           </div>
         )}
      </div>

      {/* Stepper */}
      <div className="bg-surface border border-secondary/20 p-8 rounded-2xl shadow-sm overflow-hidden">
        <h3 className="text-xs font-bold text-accent/50 uppercase tracking-widest mb-4">Onboarding Lifecycle</h3>
        <div className="overflow-x-auto pb-4">
           <div className="min-w-[600px]">
             <MerchantLifecycleStepper currentStage={merchant.status} />
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-secondary/20">
         {["INFO", "RISK", "KEYS", "PAYMENTS", "AUDIT"].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab as any)}
             className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
               activeTab === tab 
                 ? "border-accent text-accent" 
                 : "border-transparent text-accent/50 hover:text-accent hover:bg-secondary/5"
             }`}
           >
             {tab === "INFO" ? "Business Info" : tab.charAt(0) + tab.slice(1).toLowerCase()}
           </button>
         ))}
      </div>

      {/* Tab Content */}
      <div className="bg-surface border border-secondary/20 p-6 rounded-2xl shadow-sm min-h-[300px]">
         {activeTab === "INFO" && (
           <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                 <span className="text-xs font-bold text-accent/50 uppercase">Legal Name</span>
                 <span className="font-medium text-accent">{merchant.legalName}</span>
              </div>
              <div className="flex flex-col gap-2">
                 <span className="text-xs font-bold text-accent/50 uppercase">Settlement Account</span>
                 <span className="font-medium text-accent">{merchant.settlementAccount || 'Pending Configuration'}</span>
              </div>
           </div>
         )}
         {activeTab === "RISK" && (
           <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                 <span className="text-sm font-bold text-accent/60">Calculated Risk Profile:</span>
                 <span className={`px-3 py-1 font-black text-sm uppercase rounded ${
                   merchant.riskProfile === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                   merchant.riskProfile === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                   merchant.riskProfile === 'LOW' ? 'bg-emerald-100 text-emerald-700' :
                   'bg-secondary/20 text-accent'
                 }`}>
                   {merchant.riskProfile || 'UNASSESSED'}
                 </span>
              </div>
           </div>
         )}
         {activeTab !== "INFO" && activeTab !== "RISK" && (
           <div className="flex h-full items-center justify-center text-accent/40 font-medium italic p-12">
             Module data for {activeTab} will be populated here.
           </div>
         )}
      </div>
    </div>
  );
}
