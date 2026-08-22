"use client";

import React, { useState } from "react";
import { MoneyDisplay } from "@/components/features/gateway/MoneyDisplay";

export default function BalancesPage() {
  // Mocked balance state
  const [balance] = useState({
    pending: 125000.50,
    settled: 4580000.00,
    currency: "PHP"
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-accent">Balances</h1>
          <p className="text-accent/60 font-medium">Your current merchant ledger balances</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
         <div className="bg-surface border border-secondary/20 p-8 rounded-2xl shadow-sm flex flex-col gap-4">
           <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-accent/50 uppercase tracking-widest">Available to Settle</span>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold uppercase rounded">Cleared</span>
           </div>
           <h2 className="text-4xl font-black text-accent">
             <MoneyDisplay amount={balance.settled} currency={balance.currency} />
           </h2>
         </div>
         
         <div className="bg-surface border border-secondary/20 p-8 rounded-2xl shadow-sm flex flex-col gap-4">
           <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-accent/50 uppercase tracking-widest">Pending Clearing</span>
              <span className="px-2 py-1 bg-sky-50 text-sky-600 text-[10px] font-extrabold uppercase rounded">Processing</span>
           </div>
           <h2 className="text-4xl font-black text-accent/70">
             <MoneyDisplay amount={balance.pending} currency={balance.currency} />
           </h2>
         </div>
      </div>
    </div>
  );
}
