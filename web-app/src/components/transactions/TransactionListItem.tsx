import React from "react";
import { Transaction } from "@/models/ApiResponse";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface TransactionListItemProps {
  transaction: Transaction;
}

export const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction }) => {
  const isPositive = transaction.type === "DEPOSIT";

  return (
    <div className="flex items-center justify-between p-4 bg-dominant hover:bg-surface border border-secondary/30 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${isPositive ? "bg-emerald-50 text-emerald-600" : "bg-surface text-accent"}`}>
          {isPositive ? "↓" : "↑"}
        </div>
        <div>
          <h5 className="font-bold text-accent">{transaction.description || transaction.type}</h5>
          <span className="text-xs font-bold text-accent/50">{formatDate(transaction.createdAt)}</span>
        </div>
      </div>
      <div className="text-right">
        <span className={`font-extrabold ${isPositive ? "text-emerald-600" : "text-accent"}`}>
          {isPositive ? "+" : "-"}{formatCurrency(transaction.amount, transaction.currency)}
        </span>
        <div className="text-xs font-bold text-accent/50 uppercase tracking-wider mt-0.5">{transaction.status}</div>
      </div>
    </div>
  );
};
