"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/gateway/DataTable";
import { PaymentStatusBadge } from "@/components/gateway/PaymentStatusBadge";
import { MoneyDisplay } from "@/components/gateway/MoneyDisplay";
import { paymentService } from "@/services/gateway/paymentService";
import { PaymentIntent } from "@/models/GatewayModels";

export default function OpsPaymentsPage() {
  const [payments, setPayments] = useState<PaymentIntent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    paymentService.listPayments()
      .then(res => setPayments(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    {
      header: "Intent ID",
      accessorKey: "intentId" as keyof PaymentIntent,
      cell: (p: PaymentIntent) => (
        <span className="font-mono font-bold text-accent">{p.intentId.substring(0, 12)}...</span>
      ),
    },
    {
      header: "Merchant ID",
      accessorKey: "merchantId" as keyof PaymentIntent,
    },
    {
      header: "Amount",
      accessorKey: "amount" as keyof PaymentIntent,
      cell: (p: PaymentIntent) => (
        <span className="font-bold text-accent"><MoneyDisplay amount={p.amount} currency={p.currency} /></span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status" as keyof PaymentIntent,
      cell: (p: PaymentIntent) => <PaymentStatusBadge status={p.status} />,
    },
    {
      header: "Created",
      accessorKey: "createdAt" as keyof PaymentIntent,
      cell: (p: PaymentIntent) => <span className="text-accent/70">{new Date(p.createdAt).toLocaleString()}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-accent">All Platform Payments</h1>
          <p className="text-accent/60 font-medium">Global read-only view of all payment intents</p>
        </div>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        searchKey="intentId"
        searchPlaceholder="Search by Intent ID..."
      />
    </div>
  );
}
