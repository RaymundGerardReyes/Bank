"use client";

import { Transaction } from "@/models/ApiResponse";
import { formatCurrency, formatDate, maskAccountNumber } from "@/utils/formatters";
import { useRouter } from "next/navigation";
import React from "react";

interface TransactionListItemProps {
  transaction: Transaction;
  currentAccount: string;
}

export const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction, currentAccount }) => {
  const router = useRouter();

  // 1. TRUE Enterprise Directional Logic: Depends entirely on the account viewing the ledger
  const isCredit = transaction.destinationAccountNumber === currentAccount ||
    (transaction.sourceAccountNumber === "CASH" && transaction.destinationAccountNumber === currentAccount);

  const txRef = transaction.transactionReference || transaction.transactionRef || transaction.id;

  // 2. Format the opposing target account to display who the money went to / came from
  const targetAccount = isCredit ? transaction.sourceAccountNumber : transaction.destinationAccountNumber;
  let formattedTarget = "External Bank";

  if (targetAccount === "CASH") {
    formattedTarget = "Physical Cash / Branch";
  } else if (targetAccount?.startsWith("EXT:")) {
    formattedTarget = "External Wire Transfer";
  } else if (targetAccount) {
    formattedTarget = maskAccountNumber(targetAccount); // Masks to **** 6210
  }

  // 3. Dynamic Title Formatting
  let displayTitle = transaction.description;
  if (!displayTitle) {
    if (transaction.sourceAccountNumber === "CASH") displayTitle = "Cash Deposit";
    else if (transaction.destinationAccountNumber === "CASH") displayTitle = "Cash Withdrawal";
    else displayTitle = isCredit ? "Inbound Transfer" : "Outbound Transfer";
  }

  const safeDate = formatDate(transaction.createdAt || "").toUpperCase();

  return (
    <button
      onClick={() => router.push(`/transactions/receipt/${txRef}`)}
      className="w-full text-left flex items-center justify-between p-5 bg-dominant border border-secondary/30 rounded-xl hover:border-secondary/60 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 group"
      aria-label={`View receipt for transaction ${txRef}`}
    >
      <div className="flex items-center gap-4">
        {/* Aesthetic Visual Indicator Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isCredit
            ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
            : "bg-surface text-accent group-hover:bg-secondary/20"
          }`}>
          {isCredit ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          )}
        </div>

        {/* Transaction Meta */}
        <div className="flex flex-col gap-1">
          <h5 className="font-extrabold text-accent text-[16px] truncate max-w-[200px] sm:max-w-xs group-hover:text-sky-700 transition-colors">
            {displayTitle}
          </h5>
          <div className="flex items-center gap-2 text-[11px] font-bold text-accent/50 uppercase tracking-widest">
            <span>{isCredit ? 'From: ' : 'To: '} {formattedTarget}</span>
            <span className="w-1 h-1 rounded-full bg-secondary/40 hidden sm:block"></span>
            <span className="hidden sm:inline">{safeDate}</span>
          </div>
        </div>
      </div>

      {/* Financials & Status Badge */}
      <div className="flex flex-col items-end gap-1.5">
        <span className={`text-[17px] font-black tracking-tight ${isCredit ? "text-emerald-600" : "text-accent"}`}>
          {isCredit ? "+" : "-"}{formatCurrency(transaction.amount, transaction.currency || "USD")}
        </span>
        <span className={`px-2 py-0.5 text-[9px] rounded uppercase font-extrabold tracking-widest border ${transaction.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
            transaction.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-200" :
              "bg-rose-50 text-rose-600 border-rose-200"
          }`}>
          {transaction.status}
        </span>
      </div>
    </button>
  );
};