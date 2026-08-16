import React from "react";
import { Button } from "../common/Button";
import { AlertCircleIcon, FileClockIcon } from "lucide-react";

interface TransactionUnknownProps {
  message?: string;
  onCheckHistory: () => void;
  onDismiss: () => void;
}

export const TransactionUnknown: React.FC<TransactionUnknownProps> = ({ 
  message = "Your connection was lost during processing.",
  onCheckHistory,
  onDismiss
}) => {
  return (
    <div className="flex flex-col items-center text-center py-10 gap-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Warning Icon Container */}
      <div className="w-20 h-20 bg-amber-50 border-4 border-amber-100 text-amber-500 rounded-full flex items-center justify-center shadow-inner relative">
        <AlertCircleIcon className="w-10 h-10 relative z-10" />
        <div className="absolute inset-0 rounded-full border border-amber-200 animate-ping opacity-20"></div>
      </div>

      <div className="max-w-xs space-y-3">
        <h2 className="text-2xl font-black text-slate-800">Status Unknown</h2>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          {message}
        </p>
        <div className="bg-amber-50 p-4 rounded-xl text-left border border-amber-100">
          <p className="text-xs text-amber-800 font-bold flex gap-2 items-start">
            <span className="text-amber-500">⚠</span>
            The transfer may have succeeded. Please check your transaction history before attempting to send again.
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full gap-3 mt-4">
        <Button onClick={onCheckHistory} className="w-full py-4 text-base flex justify-center items-center gap-2 shadow-xl shadow-slate-200">
          <FileClockIcon className="w-5 h-5" /> View Transaction History
        </Button>
        <Button variant="ghost" onClick={onDismiss} className="w-full py-3 text-slate-500 hover:text-slate-800">
          Return to Transfers
        </Button>
      </div>

    </div>
  );
};
