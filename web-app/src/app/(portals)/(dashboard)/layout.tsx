"use client";

import { PageTransition } from "@/components/ui/PageTransition";
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
            <Link href="/accounts" className="text-xl font-extrabold text-accent tracking-tight flex items-center gap-2 group">
              <div className="w-7 h-7 bg-accent rounded-lg text-dominant flex items-center justify-center text-xs font-black shadow-sm transition-transform duration-200 group-hover:scale-105">
                N
              </div>
              NovaBank
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 h-16">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative text-sm font-bold h-full flex items-center transition-all duration-200 ${
                      isActive ? "text-accent font-extrabold" : "text-accent/60 hover:text-accent"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full animate-scale-up" />
                    )}
                  </Link>
                );
              })}
              <div className="w-px h-6 bg-secondary/30 mx-1"></div>
              <Link
                href="/api"
                className={`relative text-sm font-extrabold h-full flex items-center transition-all ${
                  pathname.startsWith("/api")
                    ? "text-sky-600"
                    : "text-sky-600/70 hover:text-sky-600"
                }`}
              >
                Developer API
                {pathname.startsWith("/api") && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full animate-scale-up" />
                )}
              </Link>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleMaskSensitiveData}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-dominant hover:bg-secondary/15 border border-secondary/40 rounded-xl text-accent active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              {maskSensitiveData ? "👁️ Reveal" : "🔒 Mask"}
            </button>
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl active:scale-95 transition-all shadow-sm cursor-pointer"
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
          <nav className="md:hidden bg-dominant/95 backdrop-blur-md border-b border-secondary/30 px-4 py-4 flex flex-col gap-4 animate-scale-up shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-bold transition-colors ${
                  pathname.startsWith(item.href) ? "text-accent font-extrabold" : "text-accent/60"
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

            <div className="w-full h-px bg-secondary/30 my-1"></div>

            <button
              onClick={() => {
                toggleMaskSensitiveData();
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-sm font-bold text-accent"
            >
              {maskSensitiveData ? "👁️ Reveal Balances" : "🔒 Mask Balances"}
            </button>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-sm font-bold text-rose-600"
            >
              Sign Out
            </button>
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Footer */}
      <footer className="border-t border-secondary/20 py-6 text-center text-xs font-bold text-accent/50 bg-dominant px-4">
        © 2026 NovaBank Enterprise. Next.js App Router Hardened Architecture.
      </footer>
    </div>
  );
}