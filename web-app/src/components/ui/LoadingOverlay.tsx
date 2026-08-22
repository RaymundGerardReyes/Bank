import React from "react";

export const LoadingOverlay: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-2xl flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-200">{message}</span>
      </div>
    </div>
  );
};
