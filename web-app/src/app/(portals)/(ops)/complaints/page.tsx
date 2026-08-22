"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/features/gateway/DataTable";
import { governanceService } from "@/services/gateway/governanceService";
import { CustomerComplaint } from "@/models/GatewayModels";

export default function OpsComplaintsPage() {
  const [complaints, setComplaints] = useState<CustomerComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    governanceService.listComplaints()
      .then(res => setComplaints(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    {
      header: "Ref",
      accessorKey: "complaintReference" as keyof CustomerComplaint,
      cell: (c: CustomerComplaint) => <span className="font-mono font-bold text-accent">{c.complaintReference}</span>
    },
    { header: "Category", accessorKey: "category" as keyof CustomerComplaint },
    {
      header: "Status",
      accessorKey: "status" as keyof CustomerComplaint,
      cell: (c: CustomerComplaint) => {
         const bg = c.status === "OPEN" ? "bg-sky-100 text-sky-700 border-sky-200" :
                    c.status === "ESCALATED" ? "bg-rose-100 text-rose-700 border-rose-200" :
                    "bg-emerald-100 text-emerald-700 border-emerald-200";
         return (
           <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${bg}`}>
             {c.status}
           </span>
         );
      }
    },
    {
      header: "SLA Deadline",
      accessorKey: "slaDeadline" as keyof CustomerComplaint,
      cell: (c: CustomerComplaint) => {
        const isPastDue = new Date(c.slaDeadline) < new Date() && c.status !== "RESOLVED";
        return (
          <span className={`font-medium ${isPastDue ? 'text-rose-600 font-bold' : 'text-accent/80'}`}>
            {new Date(c.slaDeadline).toLocaleDateString()}
          </span>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-accent">Customer Complaints</h1>
          <p className="text-accent/60 font-medium">Manage and resolve BSP-escalated issues</p>
        </div>
      </div>

      <DataTable
        data={complaints}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        searchKey="complaintReference"
      />
    </div>
  );
}
