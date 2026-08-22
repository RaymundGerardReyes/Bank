import React from "react";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onClose?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry, onClose }) => {
  return (
    <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between text-rose-400 text-sm">
      <span>{message}</span>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button onClick={onRetry} className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-xs font-semibold">
            Retry
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="px-2 py-1 hover:bg-rose-500/20 rounded-lg text-xs font-semibold">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
