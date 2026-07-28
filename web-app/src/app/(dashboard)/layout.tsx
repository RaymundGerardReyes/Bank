"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUIStore } from "@/state/uiStore";
import { authService } from "@/services/auth/authService";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { maskSensitiveData, toggleMaskSensitiveData } = useUIStore();

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  const navItems = [
    { label: "Accounts", href: "/accounts" },
    { label: "Transfers", href: "/transfers" },
    { label: "Transactions", href: "/transactions/history" },
    { label: "Statements", href: "/statements" },
    { label: "Products", href: "/products" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
      {/* Top Bar Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/accounts" className="text-xl font-bold text-sky-400">
              Enterprise Bank
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname.startsWith(item.href)
                      ? "text-sky-400 border-b-2 border-sky-400 py-5"
                      : "text-slate-300 hover:text-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleMaskSensitiveData}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors"
            >
              {maskSensitiveData ? "👁 Reveal Balances" : "🔒 Mask Balances"}
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        © 2026 Enterprise Banking Portal. Next.js App Router Hardened Architecture.
      </footer>
    </div>
  );
}
