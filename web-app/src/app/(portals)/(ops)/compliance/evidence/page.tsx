"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/features/gateway/DataTable";
import { governanceService } from "@/services/gateway/governanceService";
import { ComplianceEvidenceRecord } from "@/models/GatewayModels";

export default function OpsEvidencePage() {
  const [evidence, setEvidence] = useState<ComplianceEvidenceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    governanceService.listEvidence()
      .then(res => setEvidence(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    {
      header: "Ref",
      accessorKey: "evidenceReference" as keyof ComplianceEvidenceRecord,
      cell: (e: ComplianceEvidenceRecord) => <span className="font-mono font-bold text-accent">{e.evidenceReference}</span>
    },
    {
      header: "Requirement ID",
      accessorKey: "regulatoryRequirementId" as keyof ComplianceEvidenceRecord,
    },
    {
      header: "Type",
      accessorKey: "evidenceType" as keyof ComplianceEvidenceRecord,
      cell: (e: ComplianceEvidenceRecord) => (
         <span className="px-2 py-1 bg-secondary/10 text-[10px] font-bold text-accent uppercase rounded border border-secondary/20">
           {e.evidenceType.replace("_", " ")}
         </span>
      )
    },
    { header: "Description", accessorKey: "description" as keyof ComplianceEvidenceRecord },
    {
      header: "Verified By",
      accessorKey: "verifiedBy" as keyof ComplianceEvidenceRecord,
      cell: (e: ComplianceEvidenceRecord) => (
        <span className="text-xs font-medium text-emerald-600">
          {e.verifiedBy ? `${e.verifiedBy} at ${new Date(e.verifiedAt!).toLocaleDateString()}` : 'Pending Verification'}
        </span>
      )
    },
    {
      header: "Date Generated",
      accessorKey: "createdAt" as keyof ComplianceEvidenceRecord,
      cell: (e: ComplianceEvidenceRecord) => <span className="text-xs">{new Date(e.createdAt).toLocaleDateString()}</span>
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-accent">Evidence Records</h1>
          <p className="text-accent/60 font-medium">Auto-generated proof for BSP auditors</p>
        </div>
      </div>

      <DataTable
        data={evidence}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        searchKey="evidenceReference"
      />
    </div>
  );
}
