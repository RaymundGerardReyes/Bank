"use client";

import React from "react";
import { Transaction } from "@/models/ApiResponse";
import { TransactionListItem } from "@/components/transactions/TransactionListItem";

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-101",
    transactionRef: "TXN-987123",
    accountNumber: "1001987654",
    type: "DEPOSIT",
    amount: 2500.0,
    currency: "USD",
    status: "COMPLETED",
    description: "Direct Payroll Deposit",
    createdAt: "2026-07-28T10:30:00Z",
  },
  {
    id: "tx-102",
    transactionRef: "TXN-987124",
    accountNumber: "1001987654",
    type: "INTERNAL_TRANSFER",
    amount: 450.0,
    currency: "USD",
    status: "COMPLETED",
    description: "Transfer to Savings",
    createdAt: "2026-07-27T14:15:00Z",
  },
];

export default function TransactionHistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-100">Transaction History</h1>
      <div className="flex flex-col gap-3">
        {MOCK_TRANSACTIONS.map((tx) => (
          <TransactionListItem key={tx.id} transaction={tx} />
        ))}
      </div>
    </div>
  );
}
