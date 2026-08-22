import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-rose-400">Admin Operations Portal</h2>
        <span className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full border border-rose-500/30">
          ROLE_ADMIN Required
        </span>
      </div>
      {children}
    </div>
  );
}
