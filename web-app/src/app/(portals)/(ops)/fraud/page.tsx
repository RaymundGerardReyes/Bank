"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/features/gateway/DataTable";
import { fraudService } from "@/services/gateway/fraudService";
import { FraudCase } from "@/models/GatewayModels";
import { useRouter } from "next/navigation";

export default function FraudCasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<FraudCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fraudService.listCases()
      .then(res => setCases(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    {
      header: "Case Ref",
      accessorKey: "fraudReference" as keyof FraudCase,
      cell: (c: FraudCase) => <span className="font-mono font-bold text-accent">{c.fraudReference}</span>
    },
    {
      header: "Intent ID",
      accessorKey: "paymentIntentId" as keyof FraudCase,
    },
    {
      header: "Score",
      accessorKey: "fraudScore" as keyof FraudCase,
      cell: (c: FraudCase) => (
        <span className={`font-black ${c.fraudScore > 80 ? 'text-rose-500' : c.fraudScore > 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
          {c.fraudScore}
        </span>
      )
    },
    {
      header: "Decision",
      accessorKey: "decision" as keyof FraudCase,
      cell: (c: FraudCase) => {
        const bg = c.decision === "BLOCK" ? "bg-rose-100 text-rose-700" :
                   c.decision === "CHALLENGE" ? "bg-amber-100 text-amber-700" :
                   "bg-emerald-100 text-emerald-700";
        return (
          <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${bg}`}>
            {c.decision}
          </span>
        );
      }
    },
    {
      header: "Status",
      accessorKey: "status" as keyof FraudCase,
      cell: (c: FraudCase) => (
        <span className="text-xs font-bold text-accent/60 uppercase">{c.status.replace("_", " ")}</span>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-accent">Fraud Cases</h1>
          <p className="text-accent/60 font-medium">Investigate flagged AFASA payment transactions</p>
        </div>
      </div>

      <DataTable
        data={cases}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        searchKey="fraudReference"
        searchPlaceholder="Search cases..."
        onRowClick={(c) => router.push(`/fraud/${c.id}`)}
      />
    </div>
  );
}
