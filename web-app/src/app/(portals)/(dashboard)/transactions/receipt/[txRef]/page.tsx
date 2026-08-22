"use client";

import { Card } from "@/components/ui/Card";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { Transaction } from "@/models/ApiResponse";
import { accountService } from "@/services/account/accountService";
import { transactionService } from "@/services/transaction/transactionService";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function TransactionReceiptPage({ params }: { params: Promise<{ txRef: string }> }) {
  const router = useRouter();
  const { txRef } = use(params);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAccount, setActiveAccount] = useState<string>("");

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const accRes = await accountService.getAccounts();
        if (accRes.data && accRes.data.length > 0) {
          const primaryAcc = accRes.data[0].accountNumber;
          setActiveAccount(primaryAcc); // <-- Save Active Account Context

          const histRes = await transactionService.getHistory(primaryAcc);
          if (histRes.data && histRes.data.content) {
            const found = histRes.data.content.find((t: Transaction) => t.transactionReference === txRef);
            setTransaction(found || null);
          }
        }
      } catch (e) {
        console.error("Failed to load receipt", e);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchTransaction();
  }, [txRef]);

  if (loading) return <LoadingOverlay message="Retrieving secure digital receipt..." />;

  if (!transaction) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <Card className="text-center p-12 border-rose-500/30 bg-rose-500/5">
          <div className="text-rose-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-rose-600 mb-2">Receipt Not Found</h2>
          <p className="text-rose-400 mb-6">The requested transaction reference ({txRef}) could not be located on the ledger.</p>
          <button onClick={() => router.back()} className="px-6 py-2 bg-surface border border-secondary/40 text-accent font-bold rounded-lg hover:bg-secondary/10 transition-colors shadow-sm">
            Return to Ledger
          </button>
        </Card>
      </div>
    );
  }

  // TRUE Directional Logic applied to the Receipt
  const isCredit = transaction.destinationAccountNumber === activeAccount || (!transaction.destinationAccountNumber && transaction.type === "DEPOSIT");

  const formatAccountString = (acc?: string) => {
    if (!acc) return "N/A";
    if (acc === "CASH") return "Physical Cash / Branch";
    if (acc.startsWith("EXT:")) return acc.replace("EXT:", "External Routing: ");

    const digitsOnly = acc.replace(/\D/g, "");
    if (digitsOnly.length === 16) {
      return digitsOnly.match(/.{1,4}/g)?.join(" ") || acc;
    }
    return acc;
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500 print:max-w-full print:m-0 print:gap-0">
      <div className="flex items-center justify-between mb-2 print:hidden">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-accent/60 hover:text-accent transition-colors font-bold text-sm bg-surface px-4 py-2 rounded-lg border border-secondary/30">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ledger History
        </button>
        <button onClick={() => window.print()} className="px-4 py-2 bg-accent text-dominant font-bold text-sm rounded-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center gap-2 active:scale-95">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Official Receipt
        </button>
      </div>

      <div className="bg-dominant rounded-2xl overflow-hidden border border-secondary/30 shadow-xl shadow-secondary/10 print:shadow-none print:border-none print:rounded-none">
        <div className="p-8 md:p-10 border-b border-secondary/20 bg-surface print:bg-transparent">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shadow-md">
                <span className="text-dominant font-bold text-2xl leading-none">N</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-accent tracking-tight">NovaBank</h1>
                <p className="text-xs font-bold text-accent/50 tracking-widest uppercase">Enterprise Settlement</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest border ${transaction.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                  transaction.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-200" :
                    "bg-rose-50 text-rose-600 border-rose-200"
                }`}>
                {transaction.status}
              </span>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-accent/50 uppercase tracking-wider mb-2">Total {isCredit ? 'Received' : 'Transferred'}</span>
            <div className={`text-5xl font-black tracking-tight ${isCredit ? 'text-emerald-600' : 'text-accent'}`}>
              {isCredit ? "+" : ""}{formatCurrency(transaction.amount, transaction.currency || "USD")}
            </div>
            <p className="text-sm font-medium text-accent mt-4">
              {transaction.description || "Digital transaction"}
            </p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-secondary/20 pb-4 border-dashed">
              <span className="text-xs font-bold text-accent/50 uppercase tracking-wider mb-1 sm:mb-0">Date & Time</span>
              <span className="text-sm font-bold text-accent">{formatDate(transaction.createdAt)}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-secondary/20 pb-4 border-dashed">
              <span className="text-xs font-bold text-accent/50 uppercase tracking-wider mb-1 sm:mb-0">Reference Trace</span>
              <span className="text-sm font-mono font-bold text-accent bg-surface px-2 py-0.5 rounded border border-secondary/20">
                {transaction.transactionReference}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-secondary/20 pb-4 border-dashed">
              <span className="text-xs font-bold text-accent/50 uppercase tracking-wider mb-1 sm:mb-0">Source Account</span>
              <span className="text-sm font-mono font-bold text-accent tracking-widest">
                {formatAccountString(transaction.sourceAccountNumber)}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-secondary/20 pb-4 border-dashed">
              <span className="text-xs font-bold text-accent/50 uppercase tracking-wider mb-1 sm:mb-0">Destination Account</span>
              <span className="text-sm font-mono font-bold text-accent tracking-widest">
                {formatAccountString(transaction.destinationAccountNumber)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 flex flex-col items-center justify-center text-center border-t border-secondary/20 print:bg-transparent print:border-t-2 print:border-accent">
          <div className="flex items-center justify-center gap-1 opacity-20 mb-4 h-8 print:opacity-40">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="bg-accent" style={{ width: Math.random() > 0.5 ? 2 : 4, height: '100%' }}></div>
            ))}
          </div>
          <p className="text-[10px] text-accent/50 font-medium max-w-md leading-relaxed uppercase tracking-wider">
            NovaBank Enterprise • 100 Financial District, NY 10005<br />
            This digital receipt is cryptographically secured on the immutable ledger.
          </p>
        </div>
      </div>
    </div>
  );
}