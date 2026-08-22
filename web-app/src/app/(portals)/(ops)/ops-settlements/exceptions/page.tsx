"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/features/gateway/DataTable";
import { settlementService } from "@/services/gateway/settlementService";
import { SettlementException } from "@/models/GatewayModels";
import { Button } from "@/components/ui/Button";

export default function OpsSettlementExceptionsPage() {
  const [exceptions, setExceptions] = useState<SettlementException[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    settlementService.listExceptions()
      .then(res => setExceptions(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    {
      header: "Exception Ref",
      accessorKey: "exceptionReference" as keyof SettlementException,
      cell: (e: SettlementException) => <span className="font-mono font-bold text-accent">{e.exceptionReference}</span>
    },
    { header: "Instruction ID", accessorKey: "settlementInstructionId" as keyof SettlementException },
    {
      header: "Error Code",
      accessorKey: "errorCode" as keyof SettlementException,
      cell: (e: SettlementException) => <span className="text-rose-600 font-bold">{e.errorCode}</span>
    },
    { header: "Description", accessorKey: "errorDescription" as keyof SettlementException },
    {
      header: "Status",
      accessorKey: "status" as keyof SettlementException,
      cell: (e: SettlementException) => {
         const bg = e.status === "UNRESOLVED" ? "bg-rose-100 text-rose-700 border-rose-200" :
                    e.status === "MANUAL_INTERVENTION" ? "bg-amber-100 text-amber-700 border-amber-200" :
                    "bg-emerald-100 text-emerald-700 border-emerald-200";
         return (
           <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${bg}`}>
             {e.status.replace("_", " ")}
           </span>
         );
      }
    },
    {
      header: "Action",
      accessorKey: "id" as keyof SettlementException,
      cell: (e: SettlementException) => (
        <Button 
          variant="secondary" 
          disabled={e.status === "RESOLVED"}
          className="text-xs py-1"
          onClick={(ev) => {
            ev.stopPropagation();
            alert(`Resolve dialog for ${e.exceptionReference}`);
          }}
        >
          {e.status === "RESOLVED" ? "Resolved" : "Resolve"}
        </Button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-accent">Settlement Exceptions</h1>
          <p className="text-accent/60 font-medium">Resolve failed settlement instructions</p>
        </div>
      </div>

      <DataTable
        data={exceptions}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        searchKey="exceptionReference"
      />
    </div>
  );
}
