"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/features/gateway/DataTable";

export default function RefundsPage() {
  // In a real app, we would fetch refunds via paymentService/refunds endpoint
  const [refunds, setRefunds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { header: "Refund ID", accessorKey: "refundId" },
    { header: "Intent ID", accessorKey: "paymentIntentId" },
    { header: "Amount", accessorKey: "amount" },
    { header: "Status", accessorKey: "status" },
    { header: "Created", accessorKey: "createdAt" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-accent">Refunds</h1>
          <p className="text-accent/60 font-medium">Manage your processed refunds</p>
        </div>
      </div>

      <DataTable
        data={refunds}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No refunds found."
      />
    </div>
  );
}
