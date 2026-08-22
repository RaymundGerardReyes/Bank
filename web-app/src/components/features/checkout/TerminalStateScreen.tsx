"use client";

import React from "react";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

interface Props {
  type: "SUCCESS" | "FAILED" | "EXPIRED" | "CANCELLED";
  message: string;
  reference?: string;
}

export const TerminalStateScreen: React.FC<Props> = ({ type, message, reference }) => {
  const config = {
    SUCCESS: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
    FAILED: { icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" },
    EXPIRED: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    CANCELLED: { icon: AlertCircle, color: "text-gray-500", bg: "bg-gray-100" },
  };

  const { icon: Icon, color, bg } = config[type];

  return (
    <div className="flex flex-col items-center text-center py-6 animate-in fade-in duration-500">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${bg}`}>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
      <h2 className="text-xl font-black text-gray-900 mb-2">
        {type === "SUCCESS" ? "Payment Successful" : "Payment Unsuccessful"}
      </h2>
      <p className="text-sm text-gray-600 mb-6">{message}</p>
      
      {reference && (
        <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg w-full">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Reference Number</p>
          <p className="text-xs font-mono text-gray-700">{reference}</p>
        </div>
      )}
    </div>
  );
};
