"use client";

import React, { useEffect, useState } from "react";
import { MoneyDisplay } from "@/components/features/gateway/MoneyDisplay";
import { PaymentStatusBadge } from "@/components/features/gateway/PaymentStatusBadge";
import { paymentService } from "@/services/gateway/paymentService";
import { PaymentIntent } from "@/models/GatewayModels";
import { useRouter } from "next/navigation";

export default function MerchantDashboard() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentIntent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    paymentService.listPayments()
      .then(res => setPayments(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const totalCaptured = payments
    .filter(p => p.status === "CAPTURED" || p.status === "SETTLED")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = payments.filter(p => p.status === "PENDING" || p.status === "AUTHORIZED").length;
  const qrActiveCount = payments.filter(p => p.status === "QR_GENERATED").length;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-accent tracking-tight">Dashboard</h1>
          <p className="text-accent/60 font-medium mt-1">Overview of your payment operations</p>
        </div>
        <button 
          onClick={() => router.push("/qr-payments/create")}
          className="px-6 py-3 bg-accent text-dominant font-bold rounded-xl shadow-lg hover:bg-accent/90 transition-all hover:-translate-y-0.5"
        >
          + Create QR Payment
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-secondary/20 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <span className="text-xs font-bold text-accent/50 uppercase tracking-widest">Total Captured (All Time)</span>
          <h2 className="text-3xl font-black text-accent">
            <MoneyDisplay amount={totalCaptured} />
          </h2>
        </div>
        
        <div className="bg-surface border border-secondary/20 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <span className="text-xs font-bold text-accent/50 uppercase tracking-widest">Pending / Auth</span>
          <h2 className="text-3xl font-black text-sky-600">{pendingCount}</h2>
        </div>

        <div className="bg-surface border border-secondary/20 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <span className="text-xs font-bold text-accent/50 uppercase tracking-widest">Active QRs</span>
          <h2 className="text-3xl font-black text-violet-600">{qrActiveCount}</h2>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-dominant border border-secondary/20 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-secondary/20 flex items-center justify-between">
          <h3 className="text-lg font-bold text-accent">Recent Payments</h3>
          <button onClick={() => router.push("/payments")} className="text-sm font-bold text-sky-600 hover:underline">View All</button>
        </div>
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-accent/50 font-bold animate-pulse">Loading recent activity...</div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center text-accent/50 font-bold">No payments found.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/5 border-b border-secondary/10 text-[10px] uppercase font-extrabold text-accent/50">
                <tr>
                  <th className="px-6 py-4">Ref ID</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {payments.slice(0, 5).map(p => (
                  <tr key={p.intentId} className="hover:bg-surface cursor-pointer transition-colors" onClick={() => router.push(`/payments/${p.intentId}`)}>
                    <td className="px-6 py-4 font-mono font-bold text-accent">{p.intentId.substring(0,8)}...</td>
                    <td className="px-6 py-4 font-bold text-accent"><MoneyDisplay amount={p.amount} currency={p.currency} /></td>
                    <td className="px-6 py-4"><PaymentStatusBadge status={p.status} /></td>
                    <td className="px-6 py-4 text-right text-accent/60">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
