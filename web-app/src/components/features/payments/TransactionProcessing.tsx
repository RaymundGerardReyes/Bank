import React from "react";
import { Loader2Icon } from "lucide-react";

interface TransactionProcessingProps {
  message?: string;
}

export const TransactionProcessing: React.FC<TransactionProcessingProps> = ({ 
  message = "Processing your transaction..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6 animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full animate-ping"></div>
        <Loader2Icon className="w-12 h-12 text-primary animate-spin relative z-10" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-accent">{message}</h3>
        <p className="text-sm text-accent/60 font-medium mt-1">Please do not close this window.</p>
      </div>
    </div>
  );
};
