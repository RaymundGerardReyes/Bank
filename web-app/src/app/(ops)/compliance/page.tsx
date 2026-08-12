"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/gateway/DataTable";
import { governanceService } from "@/services/gateway/governanceService";
import { RegulatoryRequirement } from "@/models/GatewayModels";
import { Button } from "@/components/common/Button";

export default function OpsCompliancePage() {
  const [requirements, setRequirements] = useState<RegulatoryRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    governanceService.listRequirements()
      .then(res => setRequirements(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    {
      header: "Regulation",
      accessorKey: "regulation" as keyof RegulatoryRequirement,
      cell: (r: RegulatoryRequirement) => (
        <div>
           <span className="block font-bold text-accent">{r.regulation}</span>
           <span className="text-xs text-accent/60">{r.section}</span>
        </div>
      )
    },
    { header: "Control", accessorKey: "controlDescription" as keyof RegulatoryRequirement },
    { header: "Owner", accessorKey: "owner" as keyof RegulatoryRequirement },
    {
      header: "Status",
      accessorKey: "implementationStatus" as keyof RegulatoryRequirement,
      cell: (r: RegulatoryRequirement) => {
         const bg = r.implementationStatus === "TESTED" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                    r.implementationStatus === "IMPLEMENTED" ? "bg-sky-100 text-sky-700 border-sky-200" :
                    r.implementationStatus === "PLANNED" ? "bg-amber-100 text-amber-700 border-amber-200" :
                    "bg-secondary/20 text-accent/60 border-secondary/30";
         return (
           <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${bg}`}>
             {r.implementationStatus}
           </span>
         );
      }
    },
    {
      header: "Action",
      accessorKey: "id" as keyof RegulatoryRequirement,
      cell: (r: RegulatoryRequirement) => (
        <Button 
          variant="secondary" 
          className="text-xs py-1"
          onClick={(ev) => {
            ev.stopPropagation();
            alert(`Generate Evidence for ${r.regulation} ${r.section}`);
          }}
        >
          Generate Evidence
        </Button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-accent">Compliance Matrix</h1>
          <p className="text-accent/60 font-medium">MORPS & M-2022-016 Regulatory Requirements</p>
        </div>
      </div>

      <DataTable
        data={requirements}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        searchKey="regulation"
        searchPlaceholder="Search regulations..."
      />
    </div>
  );
}
