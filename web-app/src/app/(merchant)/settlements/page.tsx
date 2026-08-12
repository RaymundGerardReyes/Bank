"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/gateway/DataTable";

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { header: "Batch ID", accessorKey: "batchId" },
    { header: "Amount", accessorKey: "amount" },
    { header: "Destination", accessorKey: "destinationAccount" },
    { header: "Status", accessorKey: "status" },
    { header: "Date", accessorKey: "createdAt" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-accent">Settlements</h1>
          <p className="text-accent/60 font-medium">History of funds settled to your bank account</p>
        </div>
      </div>

      <DataTable
        data={settlements}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No settlement history found."
      />
    </div>
  );
}
