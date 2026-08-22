import React from "react";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TransactionErrorProps {
  error: string;
  onRetry: () => void;
  onCancel: () => void;
}

export const TransactionError: React.FC<TransactionErrorProps> = ({
  error,
  onRetry,
  onCancel,
}) => {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center">
        <AlertCircleIcon className="w-8 h-8 text-rose-500" />
      </div>
      <div>
        <h2 className="text-xl font-black text-accent mb-2">Transaction Failed</h2>
        <p className="text-sm text-accent/70 font-medium max-w-sm mx-auto bg-surface/50 p-3 rounded-lg border border-rose-500/20 text-rose-500">
          {error}
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full mt-2">
        <Button onClick={onRetry} className="w-full">
          Try Again
        </Button>
        <Button variant="secondary" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      </div>
    </div>
  );
};
