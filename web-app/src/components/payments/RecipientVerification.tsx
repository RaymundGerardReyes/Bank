import React from "react";
import { CheckCircle2Icon } from "lucide-react";

interface RecipientVerificationProps {
  name: string;
  bankName: string;
  maskedAccount: string;
  isVerified?: boolean;
}

export const RecipientVerification: React.FC<RecipientVerificationProps> = ({
  name,
  bankName,
  maskedAccount,
  isVerified = false,
}) => {
  return (
    <div className="flex flex-col p-4 bg-surface/50 border border-secondary/20 rounded-xl mb-4">
      <span className="text-xs font-bold text-accent/50 uppercase tracking-wider mb-2">Recipient</span>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-accent">{name}</span>
            {isVerified && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                <CheckCircle2Icon className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-accent/70">{bankName}</span>
          <span className="text-xs font-mono font-medium text-accent/50">{maskedAccount}</span>
        </div>
      </div>
    </div>
  );
};
