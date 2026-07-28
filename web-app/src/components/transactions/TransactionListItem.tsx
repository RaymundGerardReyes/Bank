import React from "react";
import { Transaction } from "@/models/ApiResponse";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface TransactionListItemProps {
  transaction: Transaction;
}

export const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction }) => {
  const isPositive = transaction.type === "DEPOSIT";

  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-700 text-slate-300"}`}>
          {isPositive ? "↓" : "↑"}
        </div>
        <div>
          <h5 className="font-medium text-slate-200">{transaction.description || transaction.type}</h5>
          <span className="text-xs text-slate-400">{formatDate(transaction.createdAt)}</span>
        </div>
      </div>
      <div className="text-right">
        <span className={`font-semibold ${isPositive ? "text-emerald-400" : "text-slate-100"}`}>
          {isPositive ? "+" : "-"}{formatCurrency(transaction.amount, transaction.currency)}
        </span>
        <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">{transaction.status}</div>
      </div>
    </div>
  );
};
