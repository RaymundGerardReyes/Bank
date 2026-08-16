import React from "react";
import { Button } from "../common/Button";
import { CheckCircle2Icon, ClockIcon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { TransactionState } from "@/models/TransactionTypes";

interface TransactionReceiptProps {
  status: "SUCCESS" | "PENDING" | "FAILED";
  reference?: string;
  amount: number;
  recipient: string;
  type?: string;
  errorMessage?: string;
}

export const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
  status,
  reference,
  amount,
  recipient,
  type,
  errorMessage,
}) => {
  const currentDate = new Date().toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStatusConfig = () => {
    switch (status) {
      case "SUCCESS":
        return {
          icon: <CheckCircle2Icon className="w-16 h-16 text-emerald-500" />,
          title: "Transfer Successful",
          subtitle: "Your funds have been securely transferred.",
          badge: <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">Completed</span>,
        };
      case "PENDING":
        return {
          icon: <ClockIcon className="w-16 h-16 text-amber-500" />,
          title: "Transfer Processing",
          subtitle: "Your transfer has been submitted and is processing.",
          badge: <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md">Pending</span>,
        };
      case "FAILED":
      default:
        return {
          icon: <XCircleIcon className="w-16 h-16 text-rose-500" />,
          title: "Transfer Unsuccessful",
          subtitle: errorMessage || "We couldn't complete this transfer.",
          badge: <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded-md">Failed</span>,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-700">
      
      <div className="flex flex-col items-center text-center gap-3 py-4">
        {config.icon}
        <div>
          <h2 className="text-2xl font-black text-accent">{config.title}</h2>
          <p className="text-sm text-accent/60 font-medium">{config.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col bg-surface border border-secondary/20 rounded-xl overflow-hidden">
        
        <div className="flex flex-col items-center justify-center p-6 bg-accent/5">
          <span className="text-4xl font-black text-accent">₱{amount.toFixed(2)}</span>
          <span className="text-sm font-medium text-accent/60 mt-1">
            {status === "FAILED" ? "Intended for " : "Sent to "}{recipient}
          </span>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {reference && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-accent/50 uppercase tracking-wider">Reference</span>
              <span className="text-sm font-mono font-bold text-accent">{reference}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-accent/50 uppercase tracking-wider">Date</span>
            <span className="text-sm font-semibold text-accent">{currentDate}</span>
          </div>
          {type && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-accent/50 uppercase tracking-wider">Transfer Type</span>
              <span className="text-sm font-semibold text-accent">{type}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-accent/50 uppercase tracking-wider">Status</span>
            {config.badge}
          </div>
        </div>

      </div>

      <div className="flex flex-col gap-3 mt-2">
        {status === "FAILED" ? (
          <>
            <Link href="/transfers" className="w-full">
              <Button className="w-full shadow-xl shadow-primary/20">Try Again</Button>
            </Link>
            <Link href="/transactions" className="w-full">
              <Button variant="secondary" className="w-full">Done</Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/transactions" className="w-full">
              <Button variant="secondary" className="w-full">View Transactions</Button>
            </Link>
            <Link href="/transfers" className="w-full">
              <Button className="w-full shadow-xl shadow-primary/20">Done</Button>
            </Link>
          </>
        )}
      </div>

    </div>
  );
};

