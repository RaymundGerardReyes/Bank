"use client";

import { Card } from "@/components/common/Card";
import { TransactionListItem } from "@/components/transactions/TransactionListItem";
import { Transaction } from "@/models/ApiResponse";
import { accountService } from "@/services/account/accountService";
import { transactionService } from "@/services/transaction/transactionService";
import { useEffect, useState } from "react";

const SkeletonRow = () => (
  <div className="w-full flex items-center justify-between p-5 bg-dominant border border-secondary/20 rounded-xl animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-secondary/10 rounded-xl"></div>
      <div className="flex flex-col gap-2">
        <div className="w-40 h-4 bg-secondary/20 rounded-md"></div>
        <div className="w-24 h-3 bg-secondary/10 rounded-md"></div>
      </div>
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="w-24 h-5 bg-secondary/20 rounded-md"></div>
      <div className="w-16 h-3 bg-secondary/10 rounded-md"></div>
    </div>
  </div>
);

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // <-- NEW: Track the currently active account to determine Credit/Debit Direction -->
  const [activeAccount, setActiveAccount] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const accRes = await accountService.getAccounts();
        if (accRes.data && accRes.data.length > 0) {
          const primaryAcc = accRes.data[0].accountNumber;
          setActiveAccount(primaryAcc); // Save state

          const histRes = await transactionService.getHistory(primaryAcc);
          if (histRes.data && histRes.data.content) {
            setTransactions(histRes.data.content);
          }
        } else {
          setError("No active accounts found to fetch history.");
        }
      } catch (e) {
        console.error("Failed to load history", e);
        setError("Unable to sync secure ledger data at this time.");
      } finally {
        setTimeout(() => setLoading(false), 400);
      }
    };
    loadData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-accent tracking-tight">Ledger History</h1>
          <p className="text-sm text-accent/60 font-medium mt-1">
            Immutable, double-entry records of your account activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-surface border border-secondary/40 text-accent font-bold text-xs rounded-lg hover:bg-secondary/10 transition-colors shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          <button className="px-4 py-2 bg-accent text-dominant font-bold text-xs rounded-lg hover:bg-accent/90 transition-colors shadow-md flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {!loading && error && (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col items-center justify-center text-center animate-in zoom-in-95">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-rose-600 font-bold">{error}</p>
        </div>
      )}

      {!loading && !error && transactions.length === 0 && (
        <Card className="flex flex-col items-center justify-center text-center py-16 border-dashed border-secondary/40 shadow-none">
          <div className="w-16 h-16 bg-surface border border-secondary/30 text-secondary rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-accent mb-1">No Transactions Yet</h3>
          <p className="text-accent/60 font-medium max-w-sm">
            Once you make a deposit, withdrawal, or transfer, your immutable ledger history will appear here.
          </p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => <SkeletonRow key={idx} />)
        ) : (
          transactions.map((tx) => (
            <TransactionListItem
              key={tx.id || tx.transactionReference}
              transaction={tx}
              currentAccount={activeAccount} // <-- INJECTED 
            />
          ))
        )}
      </div>
    </div>
  );
}