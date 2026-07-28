"use client";

import React, { useEffect, useState } from "react";
import { Account } from "@/models/ApiResponse";
import { AccountBalanceCard } from "@/components/accounts/AccountBalanceCard";
import { accountService } from "@/services/account/accountService";

const MOCK_ACCOUNTS: Account[] = [
  {
    id: "acc-101",
    accountNumber: "1001987654",
    accountType: "CHECKING",
    balance: 14850.75,
    currency: "USD",
    status: "ACTIVE",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "acc-102",
    accountNumber: "2001987655",
    accountType: "SAVINGS",
    balance: 52310.20,
    currency: "USD",
    status: "ACTIVE",
    createdAt: "2024-02-01T08:00:00Z",
  },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    accountService
      .getAccounts()
      .then((res) => setAccounts(res.data || MOCK_ACCOUNTS))
      .catch(() => setAccounts(MOCK_ACCOUNTS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Account Overview</h1>
        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          Environment: Production Hardened Edge
        </span>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm">Loading account balances...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <AccountBalanceCard key={account.id} account={account} />
          ))}
        </div>
      )}
    </div>
  );
}
