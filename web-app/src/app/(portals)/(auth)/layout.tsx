"use client";

import { PageTransition } from "@/components/ui/PageTransition";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dominant text-accent font-sans flex flex-col relative overflow-x-hidden selection:bg-secondary/30 selection:text-accent">
      {/* Dynamic Background Motion Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none"
        style={{ animationDelay: "1s" }}
      />

      <PageTransition className="flex-1 flex flex-col w-full min-h-screen">
        {children}
      </PageTransition>
    </div>
  );
}
