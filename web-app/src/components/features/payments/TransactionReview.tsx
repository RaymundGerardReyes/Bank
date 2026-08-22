import React from "react";
import { Button } from "@/components/ui/Button";

interface ReviewField {
  label: string;
  value: string;
}

interface TransactionReviewProps {
  from: string;
  to: string;
  amount: number;
  fee?: number;
  rail?: string;
  reference?: string;
  date?: string;
  details?: ReviewField[];
  onConfirm: () => void;
  onEdit: () => void;
  isLoading?: boolean;
}

export const TransactionReview: React.FC<TransactionReviewProps> = ({
  from,
  to,
  amount,
  fee = 0,
  rail,
  reference,
  date,
  details = [],
  onConfirm,
  onEdit,
  isLoading = false,
}) => {
  const total = amount + fee;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
      
      <div className="text-center">
        <h2 className="text-xl font-black text-accent">Review Details</h2>
        <p className="text-sm text-accent/60 font-medium">Please confirm your transaction.</p>
      </div>

      <div className="flex flex-col gap-4 bg-surface border border-secondary/20 p-5 rounded-xl">
        
        {/* From & To */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-accent/50 uppercase tracking-wider">From</span>
            <span className="text-sm font-semibold text-accent">{from}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-accent/50 uppercase tracking-wider">To</span>
            <span className="text-sm font-semibold text-accent text-right">{to}</span>
          </div>
        </div>

        <div className="w-full h-px bg-secondary/20"></div>

        {/* Custom Details */}
        {details.length > 0 && (
          <>
            <div className="flex flex-col gap-3">
              {details.map((detail, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-xs font-bold text-accent/50 uppercase tracking-wider">{detail.label}</span>
                  <span className="text-sm font-semibold text-accent">{detail.value}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-px bg-secondary/20"></div>
          </>
        )}

        {/* Meta Details */}
        {(rail || reference || date) && (
          <>
            <div className="flex flex-col gap-3">
              {rail && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-accent/50 uppercase tracking-wider">Payment Rail</span>
                  <span className="text-sm font-semibold text-accent">{rail}</span>
                </div>
              )}
              {reference && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-accent/50 uppercase tracking-wider">Reference</span>
                  <span className="text-sm font-mono font-semibold text-accent">{reference}</span>
                </div>
              )}
              {date && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-accent/50 uppercase tracking-wider">Date</span>
                  <span className="text-sm font-semibold text-accent">{date}</span>
                </div>
              )}
            </div>
            <div className="w-full h-px bg-secondary/20"></div>
          </>
        )}

        {/* Breakdown */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-accent/70">Transfer Amount</span>
            <span className="text-sm font-semibold text-accent">₱{amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-accent/70">Network Fee</span>
            <span className="text-sm font-semibold text-accent">{fee === 0 ? "Free" : `₱${fee.toFixed(2)}`}</span>
          </div>
        </div>

        <div className="w-full h-px bg-secondary/40 border-dashed"></div>

        {/* Total */}
        <div className="flex justify-between items-center pt-1">
          <span className="text-base font-black text-accent uppercase">Total</span>
          <span className="text-2xl font-black text-primary">₱{total.toFixed(2)}</span>
        </div>

      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onEdit} className="w-1/3" disabled={isLoading}>
          Edit
        </Button>
        <Button onClick={onConfirm} className="w-2/3 shadow-lg shadow-primary/20" disabled={isLoading}>
          {isLoading ? "Preparing..." : "Confirm & Authorize"}
        </Button>
      </div>

    </div>
  );
};
