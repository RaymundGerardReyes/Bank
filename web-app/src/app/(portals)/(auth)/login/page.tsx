"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { authService } from "@/services/auth/authService";
import { useAuthStore } from "@/state/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response?.data) {
        useAuthStore.getState().setUser(response.data);
      }
      router.push("/accounts");
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full bg-dominant selection:bg-secondary selection:text-accent font-sans">

      {/* ========================================================= */}
      {/* LEFT PANEL: Form Container (Mobile First)                 */}
      {/* ========================================================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 md:px-16 lg:px-16 xl:px-24 py-10 sm:py-16 relative z-10">
        <div className="max-w-md w-full mx-auto">

          {/* Brand Header */}
          <div className="mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <Logo size="md" />
          </div>

          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-accent tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-sm font-medium text-accent/70 leading-relaxed">
              Enter your credentials to access your secure enterprise banking dashboard and liquidity tools.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-bold animate-in zoom-in-95 duration-300">
              {error}
            </div>
          )}

          <form suppressHydrationWarning onSubmit={handleSubmit} className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
            <Input
              suppressHydrationWarning
              label="Work Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="secure-password" className="text-sm font-bold text-accent">Secure Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-sky-600 hover:text-sky-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                id="secure-password"
                suppressHydrationWarning
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3.5 py-3 bg-surface border border-secondary/40 rounded-lg text-accent font-medium placeholder:text-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-base"
                placeholder="••••••••"
                required
              />
            </div>

            <Button suppressHydrationWarning type="submit" isLoading={loading} className="w-full mt-2 py-3.5 text-base sm:text-lg shadow-xl shadow-accent/10">
              Sign In to Dashboard
            </Button>
          </form>

          <p className="mt-8 text-sm font-bold text-accent/60 animate-in fade-in duration-500 delay-300 fill-mode-both">
            Don't have an enterprise account?{" "}
            <Link href="/register" className="text-sky-600 hover:text-sky-500 transition-colors">
              Request access
            </Link>
          </p>

          {/* Mobile Trust Badge */}
          <div className="mt-10 pt-6 border-t border-secondary/20 flex items-center justify-center gap-2 text-xs font-semibold text-accent/50 lg:hidden">
            <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>256-Bit SSL Encrypted &bull; Zero-Trust Banking</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT PANEL: Enterprise Security Animation (Desktop Only) */}
      {/* ========================================================= */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative items-center justify-center overflow-hidden border-l border-slate-800 min-h-screen">

        {/* Dynamic Background Glows */}
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-sky-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

        {/* Central Animated Gateway Visualization */}
        <div className="relative z-10 flex flex-col items-center px-8">

          <div className="relative flex items-center justify-center w-64 h-64 mb-8">
            {/* Outer Rotating Dashed Ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-sky-500/30 animate-[spin_20s_linear_infinite]"></div>

            {/* Middle Rotating Ring (Reverse) */}
            <div className="absolute inset-4 rounded-full border-2 border-slate-800 border-t-sky-400/50 animate-[spin_12s_linear_infinite_reverse]"></div>

            {/* Inner Pulsing Core */}
            <div className="absolute inset-10 rounded-full bg-slate-900 border border-slate-700 shadow-[0_0_40px_rgba(14,165,233,0.15)] flex items-center justify-center">
              <svg className="w-12 h-12 text-sky-400/80 drop-shadow-[0_0_15px_rgba(14,165,233,0.5)] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <div className="text-center max-w-sm">
            <span className="px-3 py-1 bg-sky-500/10 text-sky-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-sky-500/20 mb-4 inline-block">
              256-Bit SSL Secured
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight">Zero-Trust Architecture</h3>
            <p className="text-slate-400 font-medium text-sm mt-3 leading-relaxed">
              Your session is encrypted end-to-end. We employ continuous biometric and behavioral analysis to ensure your corporate treasury remains uncompromised.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}