"use client";

import { authService } from "@/services/auth/authService";
import { useUIStore } from "@/state/uiStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { maskSensitiveData, toggleMaskSensitiveData } = useUIStore();

  // Mobile-First Workflow: Manage mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="flex flex-col min-h-screen bg-surface text-accent">
      {/* Top Bar Navigation */}
      <header className="border-b border-secondary/30 bg-dominant/90 backdrop-blur-md sticky top-0 z-50 shadow-sm shadow-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link href="/accounts" className="text-xl font-extrabold text-accent tracking-tight flex items-center gap-2">
              <div className="w-6 h-6 bg-accent rounded text-dominant flex items-center justify-center text-xs">N</div>
              NovaBank
            </Link>

            {/* Desktop Navigation (Hidden on Mobile) */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-bold transition-colors ${pathname.startsWith(item.href)
                    ? "text-accent border-b-2 border-accent py-5"
                    : "text-accent/60 hover:text-accent"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="w-px h-6 bg-secondary/30 mx-2"></div>
              <Link
                href="/api"
                className={`text-sm font-extrabold transition-all flex items-center gap-2 ${pathname.startsWith("/api")
                  ? "text-sky-600 border-b-2 border-sky-600 py-5"
                  : "text-sky-600/70 hover:text-sky-600"
                  }`}
              >
                Developer API
              </Link>
            </nav>
          </div>

          {/* Right Side Actions (Desktop & Mobile) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleMaskSensitiveData}
              className="hidden sm:block px-3 py-1.5 text-xs font-bold bg-dominant hover:bg-secondary/10 border border-secondary/40 rounded-lg text-accent transition-colors shadow-sm"
            >
              {maskSensitiveData ? "👁️ Reveal" : "🔒 Mask"}
            </button>
            <button
              onClick={handleLogout}
              className="hidden sm:block px-3.5 py-1.5 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition-colors shadow-sm"
            >
              Sign Out
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden p-2 text-accent focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-dominant border-b border-secondary/30 px-4 py-4 flex flex-col gap-4 animate-in slide-in-from-top-4 shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-bold transition-colors ${pathname.startsWith(item.href)
                  ? "text-accent"
                  : "text-accent/60"
                  }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/api"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-extrabold text-sky-600"
            >
              Developer API
            </Link>

            <div className="w-full h-px bg-secondary/30 my-2"></div>

            <button
              onClick={() => { toggleMaskSensitiveData(); setIsMobileMenuOpen(false); }}
              className="text-left text-sm font-bold text-accent"
            >
              {maskSensitiveData ? "👁️ Reveal Balances" : "🔒 Mask Balances"}
            </button>
            <button
              onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
              className="text-left text-sm font-bold text-rose-600"
            >
              Sign Out
            </button>
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-secondary/20 py-6 text-center text-xs font-bold text-accent/50 bg-dominant px-4">
        © 2026 NovaBank Enterprise. Next.js App Router Hardened Architecture.
      </footer>
    </div>
  );
}