"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Code2, Terminal, ShieldCheck } from "lucide-react";

export const DeveloperNavTabs: React.FC = () => {
  let pathname = "";
  try {
    pathname = (typeof usePathname === "function" ? usePathname() : "") || "";
  } catch {
    pathname = "";
  }

  const tabs = [
    {
      name: "API Reference & Limits",
      href: "/developers",
      active: pathname === "/developers" || pathname === "/developers/",
      icon: BookOpen,
      badge: "REST v1.0",
    },
    {
      name: "Codebase Snippets & Workflows",
      href: "/developers/snippets",
      active: pathname === "/developers/snippets" || pathname.startsWith("/developers/snippets/"),
      icon: Code2,
      badge: "5 Stacks",
    },
    {
      name: "Interactive Scalar Explorer",
      href: "/api",
      active: pathname === "/api" || pathname.startsWith("/api/"),
      icon: Terminal,
      badge: "Live Sandbox",
    },
  ];

  return (
    <div className="w-full bg-surface border-b border-secondary/20 sticky top-0 z-30 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  tab.active
                    ? "bg-accent text-dominant border-accent shadow-md shadow-accent/20"
                    : "bg-dominant text-accent/70 border-secondary/20 hover:text-accent hover:border-secondary/50 hover:bg-surface"
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.active ? "text-secondary" : "text-accent/50"}`} />
                <span>{tab.name}</span>
                {tab.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider ${
                      tab.active
                        ? "bg-secondary/30 text-white"
                        : "bg-surface text-accent/60 border border-secondary/30"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Security Invariant Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-accent/60 bg-dominant px-3 py-1.5 rounded-lg border border-secondary/20 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Deterministic Pessimistic Locking & Idempotent Ledger Parity Enforced</span>
        </div>
      </div>
    </div>
  );
};

export default DeveloperNavTabs;

