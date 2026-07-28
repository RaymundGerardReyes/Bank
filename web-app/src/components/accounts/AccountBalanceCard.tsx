"use client";

import React from "react";
import { Account } from "@/models/ApiResponse";
import { formatCurrency, maskAccountNumber } from "@/utils/formatters";
import { MaskedValue } from "@/components/security/MaskedValue";
import { Card } from "@/components/common/Card";

interface AccountBalanceCardProps {
  account: Account;
}

export const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({ account }) => {
  const formattedBalance = formatCurrency(account.balance, account.currency);

  return (
    <Card className="hover:border-sky-500/50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
            {account.accountType}
          </span>
          <h4 className="text-lg font-medium text-slate-200 mt-1">
            {maskAccountNumber(account.accountNumber)}
          </h4>
        </div>
        <span
          className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
            account.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
          }`}
        >
          {account.status}
        </span>
      </div>
      <div className="mt-4">
        <span className="text-xs text-slate-400">Available Balance</span>
        <div className="text-3xl font-bold text-slate-100 mt-0.5">
          <MaskedValue value={formattedBalance} />
        </div>
      </div>
    </Card>
  );
};
