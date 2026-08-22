"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/features/gateway/DataTable";
import { settlementService } from "@/services/gateway/settlementService";
import { SettlementWindow } from "@/models/GatewayModels";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function OpsSettlementsPage() {
  const router = useRouter();
  const [windows, setWindows] = useState<SettlementWindow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    settlementService.listWindows()
      .then(res => setWindows(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    {
      header: "Window Ref",
      accessorKey: "windowReference" as keyof SettlementWindow,
      cell: (w: SettlementWindow) => <span className="font-mono font-bold text-accent">{w.windowReference}</span>
    },
    { header: "Cycle Type", accessorKey: "cycleType" as keyof SettlementWindow },
    { header: "Rail", accessorKey: "rail" as keyof SettlementWindow },
    {
      header: "Cut Off Time",
      accessorKey: "cutOffTime" as keyof SettlementWindow,
      cell: (w: SettlementWindow) => <span className="text-accent/80 font-medium">{new Date(w.cutOffTime).toLocaleString()}</span>
    },
    {
      header: "Status",
      accessorKey: "status" as keyof SettlementWindow,
      cell: (w: SettlementWindow) => {
         const bg = w.status === "OPEN" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                    w.status === "RECONCILED" ? "bg-sky-100 text-sky-700 border-sky-200" :
                    "bg-secondary/20 text-accent/60 border-secondary/30";
         return (
           <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${bg}`}>
             {w.status}
           </span>
         );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-accent">Settlement Windows</h1>
          <p className="text-accent/60 font-medium">Manage daily and intraday clearing cycles</p>
        </div>
        <Button onClick={() => router.push("/ops-settlements/exceptions")} variant="secondary">
          View Exceptions
        </Button>
      </div>

      <DataTable
        data={windows}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        searchKey="windowReference"
      />
    </div>
  );
}
