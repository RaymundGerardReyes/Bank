"use client";

import { Card } from "@/components/common/Card";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { TransactionListItem } from "@/components/transactions/TransactionListItem";
import { Transaction } from "@/models/ApiResponse";
import { accountService } from "@/services/account/accountService";
import { transactionService } from "@/services/transaction/transactionService";
import { useEffect, useState } from "react";

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Fetch user's primary account
        const accRes = await accountService.getAccounts();
        if (accRes.data && accRes.data.length > 0) {
          const primaryAcc = accRes.data[0].accountNumber;

          // 2. Fetch live ledger history for that account
          const histRes = await transactionService.getHistory(primaryAcc);

          // The backend returns a PagedResponse structure
          if (histRes.data && histRes.data.content) {
            setTransactions(histRes.data.content);
          }
        } else {
          setError("No active accounts found to fetch history.");
        }
      } catch (e) {
        console.error("Failed to load history", e);
        setError("Unable to sync secure ledger data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-accent">Transaction History</h1>

      {loading && <LoadingOverlay message="Syncing secure ledger data..." />}

      {!loading && error && (
        <Card className="text-center p-8 border-rose-500/30 bg-rose-500/5">
          <p className="text-rose-400 font-bold">{error}</p>
        </Card>
      )}

      {!loading && !error && transactions.length === 0 && (
        <Card className="text-center p-8">
          <p className="text-accent/60 font-medium">No transactions found for this account.</p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {transactions.map((tx) => (
          <TransactionListItem key={tx.id || tx.transactionReference} transaction={tx} />
        ))}
      </div>
    </div>
  );
}