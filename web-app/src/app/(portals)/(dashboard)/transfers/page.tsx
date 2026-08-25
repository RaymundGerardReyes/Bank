"use client";

export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { ArrowRightIcon, Building2Icon, QrCodeIcon, ArrowLeftRightIcon } from "lucide-react";

export default function MoveMoneyHub() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-accent tracking-tight">Move Money</h1>
        <p className="text-lg text-accent/70 font-medium mt-2">
          How would you like to move money today?
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Option 1: Internal */}
        <Link href="/transfers/internal" className="group">
          <div className="flex flex-col h-full bg-surface border border-secondary/20 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 rounded-2xl p-6 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ArrowLeftRightIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-black text-accent mb-2">Between My Accounts</h3>
            <p className="text-sm text-accent/70 font-medium mb-6 flex-grow">
              Transfer funds instantly between your own NovaBank checking and savings accounts.
            </p>
            <div className="flex items-center text-primary font-bold text-sm">
              Start Transfer <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Option 2: Bank Transfer */}
        <Link href="/transfers/bank" className="group">
          <div className="flex flex-col h-full bg-surface border border-secondary/20 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 rounded-2xl p-6 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2Icon className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-black text-accent mb-2">Bank Transfer</h3>
            <p className="text-sm text-accent/70 font-medium mb-6 flex-grow">
              Send money to any participating bank or e-wallet via InstaPay or PESONet.
            </p>
            <div className="flex items-center text-emerald-600 font-bold text-sm">
              Send Funds <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Option 3: QR Ph */}
        <Link href="/transfers/qr" className="group">
          <div className="flex flex-col h-full bg-surface border border-secondary/20 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 rounded-2xl p-6 transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <QrCodeIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-black text-accent mb-2">QR Ph</h3>
            <p className="text-sm text-accent/70 font-medium mb-6 flex-grow">
              Scan or upload a national QR Ph code for fast, interoperable retail payments.
            </p>
            <div className="flex items-center text-indigo-600 font-bold text-sm">
              Scan to Pay <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

      </div>

    </div>
  );
}