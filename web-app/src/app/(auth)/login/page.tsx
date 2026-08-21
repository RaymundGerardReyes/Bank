"use client";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { authService } from "@/services/auth/authService";
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
      await authService.login(email, password);
      router.push("/accounts");
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-dominant selection:bg-secondary selection:text-accent font-sans">

      {/* ========================================================= */}
      {/* LEFT PANEL: Ultra-Minimalist Form                         */}
      {/* ========================================================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 lg:px-24 py-12 relative z-10">
        <div className="max-w-md w-full mx-auto">

          {/* Brand Header */}
          <div className="flex items-center gap-2 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-md shadow-accent/20">
              <span className="text-dominant font-bold text-xl leading-none">N</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-accent">NovaBank</span>
          </div>

          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <h1 className="text-3xl sm:text-4xl font-black text-accent tracking-tight mb-2">
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
                <label className="text-sm font-bold text-accent">Secure Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-sky-600 hover:text-sky-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                suppressHydrationWarning
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3.5 py-3 bg-surface border border-secondary/40 rounded-lg text-accent font-medium placeholder:text-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <Button suppressHydrationWarning type="submit" isLoading={loading} className="w-full mt-2 py-3.5 text-lg shadow-xl shadow-accent/10">
              Sign In to Dashboard
            </Button>
          </form>

          <p className="mt-8 text-sm font-bold text-accent/60 animate-in fade-in duration-500 delay-300 fill-mode-both">
            Don't have an enterprise account?{" "}
            <Link href="/register" className="text-sky-600 hover:text-sky-500 transition-colors">
              Request access
            </Link>
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT PANEL: Enterprise Security Animation                */}
      {/* ========================================================= */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative items-center justify-center overflow-hidden border-l border-slate-800">

        {/* Dynamic Background Glows */}
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-sky-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen"></div>

        {/* Central Animated Gateway Visualization */}
        <div className="relative z-10 flex flex-col items-center">

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