"use client";

import { authService } from "@/services/auth/authService";
import { useAuthStore } from "@/state/authStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    clearAuth();
    router.push("/login");
  };

  const navGroups = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/ops-dashboard" },
        { label: "All Payments", href: "/ops-payments" },
      ],
    },
    {
      title: "Platform",
      items: [
        { label: "Merchants", href: "/merchants" },
        { label: "Settlements", href: "/ops-settlements" },
        { label: "Exceptions", href: "/ops-settlements/exceptions" },
      ],
    },
    {
      title: "Risk & Governance",
      items: [
        { label: "Fraud Cases", href: "/fraud" },
        { label: "Complaints", href: "/complaints" },
        { label: "Compliance Matrix", href: "/compliance" },
        { label: "Evidence Records", href: "/compliance/evidence" },
      ],
    },
  ];

  return (

      <div className="flex h-screen bg-surface text-accent overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-dominant border-r border-secondary/20 shadow-sm z-20">
          <div className="p-6 border-b border-secondary/20 bg-accent text-dominant">
            <Link href="/ops-dashboard" className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-dominant rounded text-accent flex items-center justify-center text-sm font-black">N</div>
              NovaBank
            </Link>
            <div className="mt-2 text-[10px] font-bold text-dominant/70 uppercase tracking-widest">
              Operations Console
            </div>
          </div>

          <nav className="flex-1 py-4 flex flex-col gap-4 overflow-y-auto">
            {navGroups.map((group, i) => (
              <div key={i} className="px-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent/40 mb-2 block px-2">
                  {group.title}
                </span>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/") && item.href !== "/ops-dashboard";
                    const actualPath = item.href;
                    const isActuallyActive = pathname === actualPath || (actualPath !== "/" && pathname.startsWith(actualPath));
                    
                    return (
                      <Link
                        key={item.href}
                        href={actualPath} // Normalize for actual routing
                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                          isActuallyActive
                            ? "bg-secondary/15 text-accent"
                            : "text-accent/60 hover:bg-secondary/5 hover:text-accent"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-secondary/20 bg-secondary/5">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-accent text-dominant flex items-center justify-center font-bold">
                {user?.fullName?.charAt(0) || "O"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate">{user?.fullName || "Ops Officer"}</span>
                <span className="text-[10px] opacity-60 truncate">{user?.email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 text-xs font-bold text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="md:hidden flex items-center justify-between p-4 bg-accent text-dominant z-20">
            <Link href="/ops-dashboard" className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              <div className="w-6 h-6 bg-dominant rounded text-accent flex items-center justify-center text-xs">N</div>
              NovaBank Ops
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-surface relative">
            <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
  );
}
