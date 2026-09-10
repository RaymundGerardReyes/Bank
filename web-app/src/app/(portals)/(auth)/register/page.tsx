"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 1: Credentials
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Step 2: KYC
    const [employmentStatus, setEmploymentStatus] = useState("Employed");
    const [jobTitle, setJobTitle] = useState("");
    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [sourceOfFunds, setSourceOfFunds] = useState("Salary");

    // 3D Card Animation State
    const [isFlipped, setIsFlipped] = useState(false);

    // Real-time Cardholder Name preview
    const liveFullName = `${firstName} ${lastName}`.trim() || "YOUR NAME";

    const handleStepOneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!firstName || !lastName || !email || password.length < 8) {
            setError("Please fill all fields and ensure your password is at least 8 characters.");
            return;
        }
        setStep(2);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!jobTitle || !monthlyIncome) {
            setError("Please complete all financial profile fields.");
            return;
        }
        setLoading(true);
        try {
            if (typeof window !== "undefined") {
                sessionStorage.setItem("registration_email", email);
            }
            const res = await fetch("/api/proxy/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName, lastName, email, password,
                    employmentStatus, jobTitle, monthlyIncome, sourceOfFunds
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create customer account.");
            router.push("/otp");
        } catch (err: any) {
            setError(err.message || "Failed to create account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row w-full bg-dominant selection:bg-secondary selection:text-accent font-sans">

            {/* ========================================================= */}
            {/* LEFT PANEL: Interactive Form                              */}
            {/* ========================================================= */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 md:px-16 lg:px-16 xl:px-24 py-10 sm:py-16 overflow-y-auto">
                <div className="max-w-md w-full mx-auto">

                    {/* Brand Header */}
                    <div className="mb-8 sm:mb-10">
                        <Logo size="md" />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-accent tracking-tight">
                            {step === 1 ? "Start your journey" : "Financial Profile"}
                        </h2>
                        <p className="text-sm font-medium text-accent/70 mt-2">
                            {step === 1
                                ? "Experience enterprise-grade security and instant global settlements."
                                : "To comply with AML/KYC regulations, please detail your primary source of funds."}
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-accent' : 'bg-secondary/20'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-accent' : 'bg-secondary/20'}`}></div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-bold animate-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    {/* STEP 1 FORM */}
                    {step === 1 && (
                        <form onSubmit={handleStepOneSubmit} className="flex flex-col gap-5 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Legal first name" required />
                                <Input label="Last Name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Legal last name" required />
                            </div>
                            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required />
                            <Input label="Secure Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" required />
                            <Button type="submit" className="w-full mt-4 py-3.5 text-base sm:text-lg shadow-xl shadow-accent/10">
                                Continue to Verification
                            </Button>
                        </form>
                    )}

                    {/* STEP 2 FORM */}
                    {step === 2 && (
                        <form onSubmit={handleFinalSubmit} className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex flex-col gap-1.5 w-full">
                                <label htmlFor="employment-status" className="text-sm font-bold text-accent">Employment Status</label>
                                <select id="employment-status" value={employmentStatus} onChange={(e) => setEmploymentStatus(e.target.value)} className="px-3.5 py-3 bg-surface border border-secondary/40 rounded-lg text-accent font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer appearance-none text-base">
                                    <option value="Employed">Employed Full-Time</option>
                                    <option value="Self-Employed">Self-Employed / Business Owner</option>
                                    <option value="Student">Student</option>
                                    <option value="Retired">Retired</option>
                                </select>
                            </div>
                            <Input label="Current Job Title" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g., Software Engineer" required />
                            <div className="flex flex-col gap-1.5 w-full">
                                <label htmlFor="monthly-income" className="text-sm font-bold text-accent">Estimated Monthly Income (USD)</label>
                                <select id="monthly-income" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} className="px-3.5 py-3 bg-surface border border-secondary/40 rounded-lg text-accent font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer appearance-none text-base" required>
                                    <option value="" disabled>Select income bracket...</option>
                                    <option value="0-2500">$0 - $2,500</option>
                                    <option value="2501-5000">$2,501 - $5,000</option>
                                    <option value="5001-10000">$5,001 - $10,000</option>
                                    <option value="10000+">$10,000+</option>
                                </select>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1 py-3.5">Back</Button>
                                <Button type="submit" isLoading={loading} className="flex-[2] py-3.5 text-base sm:text-lg shadow-xl shadow-accent/10">Complete Account</Button>
                            </div>
                        </form>
                    )}

                    <p className="mt-8 text-sm font-bold text-accent/60">
                        Already have an account? <Link href="/login" className="text-sky-600 hover:text-sky-500 transition-colors">Sign in</Link>
                    </p>

                    {/* Mobile Trust Badge */}
                    <div className="mt-10 pt-6 border-t border-secondary/20 flex items-center justify-center gap-2 text-xs font-semibold text-accent/50 lg:hidden">
                        <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>256-Bit SSL Encrypted &bull; FDIC Insured Partner Banking</span>
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/* RIGHT PANEL: 3D Digital Card Showcase (Desktop Only)      */}
            {/* ========================================================= */}
            <div className="hidden lg:flex w-1/2 bg-slate-950 relative items-center justify-center overflow-hidden border-l border-slate-800 min-h-screen">

                {/* Dynamic Background Glow */}
                <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-sky-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

                <div className="flex flex-col items-center gap-12 z-10 w-full max-w-md px-6">

                    <div className="text-center">
                        <span className="px-3 py-1 bg-sky-500/20 text-sky-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-sky-500/30">
                            Enterprise Ready
                        </span>
                        <h3 className="text-3xl font-black text-white mt-4 tracking-tight">Your Digital Premium Card</h3>
                        <p className="text-slate-400 font-medium text-sm mt-2">Interact with the card to view physical routing details.</p>
                    </div>

                    {/* 3D Interactive Card (Tied to state) */}
                    <div
                        className="relative w-full aspect-[1.586/1] rounded-2xl cursor-pointer group [perspective:1000px]"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] shadow-2xl rounded-2xl ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>

                            {/* FRONT OF CARD */}
                            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 border border-slate-600 rounded-2xl p-6 overflow-hidden flex flex-col shadow-2xl">
                                <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/30 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>

                                <div className="flex justify-between items-start relative z-10">
                                    <span className="text-white font-black text-lg tracking-tighter">MunBank</span>
                                    <svg className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.906 14.142 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                                    </svg>
                                </div>

                                <div className="mt-6 mb-3 relative z-10">
                                    <div className="w-11 h-8 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 rounded-md opacity-90 relative overflow-hidden shadow-sm">
                                        <div className="absolute top-1/2 left-0 w-full h-px bg-amber-700/30"></div>
                                        <div className="absolute left-1/3 top-0 w-px h-full bg-amber-700/30"></div>
                                        <div className="absolute right-1/3 top-0 w-px h-full bg-amber-700/30"></div>
                                    </div>
                                </div>

                                <div className="font-mono text-[1.4rem] text-white tracking-widest relative z-10 drop-shadow-md">
                                    4859  2200  ••••  ••••
                                </div>

                                <div className="flex justify-between items-end mt-auto relative z-10 pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-white/50 uppercase tracking-widest font-bold mb-0.5">Cardholder</span>
                                        <span className="text-white text-sm font-bold tracking-widest uppercase truncate max-w-[180px]">
                                            {liveFullName}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] text-white/50 uppercase tracking-widest font-bold mb-0.5">Valid Thru</span>
                                        <span className="text-white text-sm font-mono font-bold tracking-widest">
                                            12/29
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* BACK OF CARD */}
                            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-bl from-slate-800 to-slate-900 border border-slate-600 rounded-2xl overflow-hidden flex flex-col shadow-inner">
                                <div className="w-full h-12 bg-black/90 mt-6 shadow-md"></div>
                                <div className="px-5 mt-4 flex flex-col gap-4">
                                    <div className="w-full flex items-center justify-end h-10 bg-slate-200 rounded-sm px-3 relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cGF0aCBkPSJNMCAwTDggOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')]"></div>
                                        <span className="text-slate-900 font-mono text-sm font-black italic relative z-10 tracking-widest">
                                            ***
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start text-white/60">
                                        <div className="flex flex-col gap-1 text-[9px] uppercase tracking-wider">
                                            <span>Routing: 021000021</span>
                                            <span>Account: *********</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">SWIFT / BIC</span>
                                            <span className="text-xs font-mono font-bold text-white">MUNBUS33XXX</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}