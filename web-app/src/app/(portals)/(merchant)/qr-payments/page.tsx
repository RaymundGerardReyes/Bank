"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/features/gateway/DataTable";
import { PaymentStatusBadge } from "@/components/features/gateway/PaymentStatusBadge";
import { MoneyDisplay } from "@/components/features/gateway/MoneyDisplay";
import { paymentService } from "@/services/gateway/paymentService";
import { PaymentIntent } from "@/models/GatewayModels";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function QrPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentIntent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    paymentService.listPayments()
      .then(res => {
        // Filter only QR related intents (e.g. status QR_GENERATED, or channel=QR_PH_P2M if we had it exposed, for now we filter by those that have QR status)
        // Since we don't have the channel explicitly in this mock without backend change, let's assume all intents for now or filter visually. 
        // A real app would filter by channel === 'QR_PH_P2M'
        setPayments(res.data || []);
      })
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
          <h1 className="text-2xl font-black text-accent">QR Payments</h1>
          <p className="text-accent/60 font-medium">Manage Dynamic QR Ph P2M payments</p>
        </div>
        <Button onClick={() => router.push("/qr-payments/create")}>
          + Create QR Payment
        </Button>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        searchKey="intentId"
        searchPlaceholder="Search QR Payments..."
        onRowClick={(p) => router.push(`/payments/${p.intentId}`)} // Can link to generic detail
      />
    </div>
  );
}
