"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fraudService } from "@/services/gateway/fraudService";
import { FraudCase } from "@/models/GatewayModels";
import { Button } from "@/components/common/Button";

export default function FraudCaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;

  const [fraudCase, setFraudCase] = useState<FraudCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fraudService.getCase(caseId)
      .then(res => setFraudCase(res.data || null))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [caseId]);

  if (isLoading) {
    return <div className="p-12 text-center text-accent/50 font-bold animate-pulse">Loading case details...</div>;
  }

  if (!fraudCase) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-accent/50 gap-4">
        <span className="font-bold">Fraud Case Not Found</span>
        <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const bgScore = fraudCase.fraudScore > 80 ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                  fraudCase.fraudScore > 50 ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                  'bg-emerald-50 text-emerald-600 border-emerald-200';

  return (
    <div className="flex flex-col gap-8 animate-in fade-in">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-black text-accent font-mono">{fraudCase.fraudReference}</h1>
            <p className="text-accent/60 font-medium mt-1">Status: {fraudCase.status.replace("_", " ")}</p>
         </div>
         <Button variant="secondary" onClick={() => router.back()}>Back to Cases</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-2 ${bgScore}`}>
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">AFASA Score</span>
            <span className="text-6xl font-black">{fraudCase.fraudScore}</span>
         </div>
         
         <div className="p-6 rounded-2xl border border-secondary/20 bg-surface flex flex-col gap-4 col-span-2 shadow-sm">
            <h3 className="text-lg font-bold text-accent">Decision Engine Result</h3>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <span className="block text-xs font-bold text-accent/50 uppercase">Decision</span>
                  <span className="font-black text-lg text-accent">{fraudCase.decision}</span>
               </div>
               <div>
                  <span className="block text-xs font-bold text-accent/50 uppercase">Reason Code</span>
                  <span className="font-medium text-accent">{fraudCase.reasonCode}</span>
               </div>
               <div>
                  <span className="block text-xs font-bold text-accent/50 uppercase">Payment Intent</span>
                  <span className="font-mono text-sky-600 font-bold hover:underline cursor-pointer" onClick={() => router.push(`/ops-payments/${fraudCase.paymentIntentId}`)}>
                     {fraudCase.paymentIntentId}
                  </span>
               </div>
               <div>
                  <span className="block text-xs font-bold text-accent/50 uppercase">Date Logged</span>
                  <span className="font-medium text-accent">{new Date(fraudCase.createdAt).toLocaleString()}</span>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-surface border border-secondary/20 p-6 rounded-2xl shadow-sm min-h-[200px]">
         <h3 className="text-lg font-bold text-accent mb-4">Investigation Notes</h3>
         <div className="flex h-32 items-center justify-center text-accent/40 font-medium italic border-2 border-dashed border-secondary/20 rounded-xl bg-dominant">
            Investigator notes implementation placeholder.
         </div>
      </div>
    </div>
  );
}
