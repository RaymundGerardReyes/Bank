"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/gateway/DataTable";
import { merchantService } from "@/services/gateway/merchantService";
import { Merchant } from "@/models/GatewayModels";
import { useRouter } from "next/navigation";

export default function OpsDashboard() {
  const router = useRouter();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    merchantService.listMerchants()
      .then(res => setMerchants(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const pendingMerchants = merchants.filter(
    m => m.status === "APPLICATION" || m.status === "KYB" || m.status === "SCREENING"
  );

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-accent tracking-tight">Platform Operations</h1>
        <p className="text-accent/60 font-medium mt-1">High-level platform health and queues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dominant border-t-4 border-t-sky-500 border border-secondary/20 p-6 rounded-xl shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-accent/50 uppercase">Merchants Onboarding</span>
          <h2 className="text-3xl font-black text-accent">{pendingMerchants.length}</h2>
        </div>
        <div className="bg-dominant border-t-4 border-t-emerald-500 border border-secondary/20 p-6 rounded-xl shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-accent/50 uppercase">Active Merchants</span>
          <h2 className="text-3xl font-black text-accent">{merchants.filter(m => m.status === "ACTIVE").length}</h2>
        </div>
        <div className="bg-dominant border-t-4 border-t-amber-500 border border-secondary/20 p-6 rounded-xl shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-accent/50 uppercase">Settlement Exceptions</span>
          <h2 className="text-3xl font-black text-accent">3</h2>
        </div>
        <div className="bg-dominant border-t-4 border-t-rose-500 border border-secondary/20 p-6 rounded-xl shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-accent/50 uppercase">Open Fraud Cases</span>
          <h2 className="text-3xl font-black text-accent">12</h2>
        </div>
      </div>

      {/* Action Queue */}
      <div className="bg-surface border border-secondary/20 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-secondary/20 bg-dominant/50">
           <h3 className="text-lg font-bold text-accent">KYB Review Queue</h3>
        </div>
        <div className="p-0">
          <DataTable
             data={pendingMerchants}
             columns={[
               { header: "Merchant Code", accessorKey: "merchantCode" },
               { header: "Legal Name", accessorKey: "legalName" },
               { header: "Current Stage", accessorKey: "status", cell: (m: Merchant) => (
                 <span className="px-2 py-1 bg-sky-100 text-sky-700 text-[10px] font-bold uppercase rounded border border-sky-200">
                   {m.status.replace("_", " ")}
                 </span>
               )},
               { header: "Date Applied", accessorKey: "createdAt", cell: (m: Merchant) => (
                 <span className="text-xs font-medium text-accent/70">{new Date(m.createdAt).toLocaleDateString()}</span>
               )},
             ]}
             isLoading={isLoading}
             emptyMessage="No merchants pending review."
             onRowClick={(m) => router.push(`/merchants/${m.id}`)}
          />
        </div>
      </div>
    </div>
  );
}
