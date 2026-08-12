"use client";

import { authService } from "@/services/auth/authService";
import { useAuthStore } from "@/state/authStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
// Using RoleGuard once we implement Phase E, for now we will assume it exists or use standard layout pattern
import { RoleGuard } from "@/security/RoleGuard";

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    clearAuth();
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/merchant-dashboard" },
    { label: "Payments", href: "/payments" },
    { label: "QR Payments", href: "/qr-payments" },
    { label: "Refunds", href: "/refunds" },
    { label: "Balances", href: "/balances" },
    { label: "Settlements", href: "/settlements" },
  ];

  return (
    <RoleGuard allowedRoles={["MERCHANT"]}>
      <div className="flex h-screen bg-surface text-accent overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-dominant border-r border-secondary/20 shadow-sm z-20">
          <div className="p-6 border-b border-secondary/20">
            <Link href="/merchant-dashboard" className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded text-dominant flex items-center justify-center text-sm">N</div>
              NovaBank
            </Link>
            <div className="mt-2 text-xs font-bold text-accent/50 uppercase tracking-widest">
              Merchant Portal
            </div>
          </div>

          <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-secondary/10 text-accent"
                      : "text-accent/60 hover:bg-secondary/5 hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-secondary/20">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-accent font-bold">
                {user?.fullName?.charAt(0) || "M"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate">{user?.fullName || "Merchant"}</span>
                <span className="text-[10px] opacity-60 truncate">{user?.email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 text-sm font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="md:hidden flex items-center justify-between p-4 bg-dominant border-b border-secondary/20 shadow-sm z-20">
            <Link href="/merchant-dashboard" className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              <div className="w-6 h-6 bg-accent rounded text-dominant flex items-center justify-center text-xs">N</div>
              NovaBank
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-accent"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </header>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute inset-0 top-16 bg-dominant z-30 flex flex-col">
              <nav className="p-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-4 rounded-xl font-bold bg-secondary/5 text-accent"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto p-4 border-t border-secondary/20">
                <button
                  onClick={handleLogout}
                  className="w-full p-4 rounded-xl font-bold bg-rose-50 text-rose-600"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-surface relative">
            <div className="max-w-6xl mx-auto p-6 md:p-10 min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
