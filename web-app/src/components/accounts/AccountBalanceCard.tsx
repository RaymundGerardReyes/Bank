"use client";

import { MaskedValue } from "@/components/security/MaskedValue";
import { Account } from "@/models/ApiResponse";
import { useAuthStore } from "@/state/authStore";
import { useUIStore } from "@/state/uiStore";
import { formatCurrency } from "@/utils/formatters";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface AccountBalanceCardProps {
  account: Account;
}

export const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({ account }) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { maskSensitiveData } = useUIStore();

  // 3D Flip State
  const [isFlipped, setIsFlipped] = useState(false);

  const formattedBalance = formatCurrency(account.balance, account.currency);
  const isActionable = account.status === "ACTIVE";

  // --- Dynamic ISO/IEC 7812 Formatting & Legacy Fallback ---
  const rawPan = account.accountNumber.replace(/\D/g, "");
  const isLegacy = rawPan.length < 16;

  const formattedPan = isLegacy
    ? account.accountNumber // Leave ACC-100200300 alone
    : rawPan.match(/.{1,4}/g)?.join("  ") || rawPan; // Format 4859 2200 1337 1001

  const maskedPan = isLegacy
    ? `**** **** ${rawPan.slice(-4) || '****'}`
    : `••••  ••••  ••••  ${rawPan.slice(-4).padStart(4, "0")}`;

  const displayPan = maskSensitiveData ? maskedPan : formattedPan;

  // --- Map Backend Properties Safely (Handle DB Nulls from old accounts) ---
  const swiftCode = account.swiftCode || "NOVBUS33XXX";
  const cardExpiry = account.cardExpiry || "12/29";
  const cardCvv = account.cardCvv || "000";

  // Toggle Visibility based on Global Privacy State
  const displayExpiry = maskSensitiveData ? "**/**" : cardExpiry;
  const displayCvv = maskSensitiveData ? "***" : cardCvv;

  const cardholderName = user?.fullName || "Valued Member";

  return (
    <div className="flex flex-col gap-4">
      {/* 1. The 3D Interactive Physical Card */}
      <div
        className="relative w-full aspect-[1.586/1] rounded-2xl cursor-pointer group [perspective:1000px]"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Flip Container */}
        <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] shadow-2xl rounded-2xl ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>

          {/* ========================================== */}
          {/* FRONT OF CARD                              */}
          {/* ========================================== */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 border border-slate-700 rounded-2xl p-6 overflow-hidden flex flex-col">

            {/* Decorative Glassmorphic Orbs */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>

            {/* Header: Bank Logo & Contactless */}
            <div className="flex justify-between items-start relative z-10">
              <span className="text-white/90 font-black text-lg tracking-tighter flex items-center gap-2">
                <div className="w-5 h-5 bg-white text-slate-900 rounded flex items-center justify-center text-[10px]">N</div>
                NovaBank
              </span>
              <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.906 14.142 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>

            {/* EMV Chip */}
            <div className="mt-6 mb-3 relative z-10">
              <div className="w-11 h-8 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 rounded-md opacity-90 relative overflow-hidden shadow-sm">
                <div className="absolute top-1/2 left-0 w-full h-px bg-amber-700/30"></div>
                <div className="absolute left-1/3 top-0 w-px h-full bg-amber-700/30"></div>
                <div className="absolute right-1/3 top-0 w-px h-full bg-amber-700/30"></div>
              </div>
            </div>

            {/* ISO Standard PAN */}
            <div className={`font-mono ${isLegacy ? 'text-lg tracking-wider' : 'text-[1.3rem] tracking-widest'} text-white relative z-10 drop-shadow-md transition-all`}>
              {displayPan}
            </div>

            {/* Footer: Cardholder & Expiry */}
            <div className="flex justify-between items-end mt-auto relative z-10 pt-4">
              <div className="flex flex-col">
                <span className="text-[8px] text-white/50 uppercase tracking-widest font-bold mb-0.5">Cardholder</span>
                <span className="text-white text-sm font-bold tracking-widest uppercase truncate max-w-[150px]">
                  {cardholderName}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] text-white/50 uppercase tracking-widest font-bold mb-0.5">Valid Thru</span>
                <span className="text-white text-sm font-mono font-bold tracking-widest">
                  {displayExpiry}
                </span>
              </div>
            </div>

            {/* "Click to flip" indicator (visible on hover) */}
            <div className="absolute bottom-4 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white/40 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none">
              Click to flip
            </div>
          </div>

          {/* ========================================== */}
          {/* BACK OF CARD                               */}
          {/* ========================================== */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-bl from-slate-800 to-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col shadow-inner">

            {/* ISO Standard Magnetic Stripe */}
            <div className="w-full h-12 bg-black/80 mt-6 shadow-sm"></div>

            <div className="px-5 mt-4 flex flex-col gap-4">
              {/* Signature Panel & CVV */}
              <div className="w-full flex items-center justify-end h-10 bg-slate-200 rounded-sm px-3 relative overflow-hidden">
                {/* Tamper-evident pattern simulation */}
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cGF0aCBkPSJNMCAwTDggOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')]"></div>
                <span className="text-slate-900 font-mono text-sm font-black italic relative z-10 tracking-widest">
                  {displayCvv}
                </span>
              </div>

              {/* Back Card Meta & SWIFT Code */}
              <div className="flex justify-between items-start text-white/60">
                <div className="flex flex-col gap-1 text-[9px] uppercase tracking-wider">
                  <span>Routing: 021000021</span>
                  <span>Account: {maskSensitiveData ? `****${rawPan.slice(-4) || '****'}` : rawPan}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">SWIFT / BIC</span>
                  <span className="text-xs font-mono font-bold text-white">{swiftCode}</span>
                </div>
              </div>

              <p className="text-[7px] text-white/40 leading-tight text-center mt-2 px-4">
                This card is issued by NovaBank pursuant to a license. Use of this card is subject to the cardholder agreement. Found cards should be returned to NovaBank HQ.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. The Financial Data & Contextual Actions */}
      <div className="bg-dominant border border-secondary/30 rounded-xl p-5 shadow-sm mt-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary block mb-1">
              Available Balance
            </span>
            <div className="text-2xl font-black text-accent">
              <MaskedValue value={formattedBalance} />
            </div>
          </div>
          <span className={`px-2 py-0.5 text-[10px] rounded border font-extrabold tracking-wider ${isActionable ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"
            }`}>
            {account.status}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-secondary/20">
          <button
            onClick={() => router.push("/transactions/history")}
            className="flex-1 text-xs font-bold text-accent bg-surface hover:bg-secondary/20 py-2 rounded-lg transition-colors"
          >
            History
          </button>
          <button
            disabled={!isActionable}
            onClick={() => router.push("/transfers")}
            className="flex-1 text-xs font-bold text-dominant bg-accent hover:bg-accent/90 disabled:bg-secondary disabled:cursor-not-allowed py-2 rounded-lg transition-colors shadow-md"
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
};