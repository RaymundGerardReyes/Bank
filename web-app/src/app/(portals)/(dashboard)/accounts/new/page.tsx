"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAccounts } from "@/hooks/useAccounts";
import { accountService } from "@/services/account/accountService";
import { useAuthStore } from "@/state/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// --- Enterprise VAM Templates & Defaults ---
const VAM_TEMPLATES = {
    BUSINESS: {
        id: "BUSINESS",
        label: "Business Ops",
        desc: "Daily operational expenses and vendor payouts.",
        bgFront: "from-blue-950 via-blue-900 to-slate-900",
        badgeBg: "bg-blue-800/60",
        border: "border-blue-500/50",
        defaults: { allowIncoming: true, allowOutgoing: true, dailyLimit: 100000 },
    },
    PAYROLL: {
        id: "PAYROLL",
        label: "Payroll",
        desc: "Strictly isolated funds for employee salaries.",
        bgFront: "from-emerald-950 via-emerald-900 to-slate-900",
        badgeBg: "bg-emerald-800/60",
        border: "border-emerald-500/50",
        defaults: { allowIncoming: false, allowOutgoing: true, dailyLimit: 500000 },
    },
    TREASURY: {
        id: "TREASURY",
        label: "Treasury",
        desc: "High-yield holding account for corporate reserves.",
        bgFront: "from-amber-900 via-amber-800 to-slate-900",
        badgeBg: "bg-amber-800/60",
        border: "border-amber-500/50",
        defaults: { allowIncoming: true, allowOutgoing: true, dailyLimit: 5000000 },
    },
    INVESTMENT: {
        id: "INVESTMENT",
        label: "Investment",
        desc: "Capital allocation for bonds and equities.",
        bgFront: "from-purple-950 via-purple-900 to-slate-900",
        badgeBg: "bg-purple-800/60",
        border: "border-purple-500/50",
        defaults: { allowIncoming: false, allowOutgoing: false, dailyLimit: 0 },
    },
};

type TemplateKey = keyof typeof VAM_TEMPLATES;

function OpenVamAccountContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultParentId = searchParams.get("parent") || "";
    
    const { user } = useAuthStore();
    const { data: accounts, isLoading: accountsLoading } = useAccounts();

    // Provisioning State
    const [step, setStep] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Payload State
    const [parentAccountId, setParentAccountId] = useState(defaultParentId);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("BUSINESS");
    const [accountName, setAccountName] = useState("");
    const [initialFunding, setInitialFunding] = useState("0.00");
    const [dailyLimit, setDailyLimit] = useState(100000);
    const [allowIncoming, setAllowIncoming] = useState(true);
    const [allowOutgoing, setAllowOutgoing] = useState(true);
    const [issueVirtualCard, setIssueVirtualCard] = useState(true);

    const theme = VAM_TEMPLATES[selectedTemplate];

    // Auto-select first account as parent
    useEffect(() => {
        if (accounts && accounts.length > 0 && !parentAccountId) {
            setParentAccountId(accounts[0].accountNumber);
        }
    }, [accounts, parentAccountId]);

    // Apply template defaults
    const handleTemplateSelect = (key: TemplateKey) => {
        setSelectedTemplate(key);
        setAccountName(`${VAM_TEMPLATES[key].label} 2026`);
        setDailyLimit(VAM_TEMPLATES[key].defaults.dailyLimit);
        setAllowIncoming(VAM_TEMPLATES[key].defaults.allowIncoming);
        setAllowOutgoing(VAM_TEMPLATES[key].defaults.allowOutgoing);
    };

    const handleProvision = async () => {
        setError("");
        setLoading(true);

        try {
            // 1. Simulate Auth/Passkey delay
            await new Promise(res => setTimeout(res, 1000));

            // 2. Dispatch the Rich Enterprise Payload
            await accountService.openAccount({
                customerId: parseInt(user?.id || "1"),
                parentAccountId, // <-- VAM Hierarchy Link
                accountType: selectedTemplate,
                accountName,
                currency: "USD",
                initialDeposit: parseFloat(initialFunding) || 0,
                dailyLimit,
                allowIncoming,
                allowOutgoing,
                issueVirtualCard
            } as any);

            router.push("/accounts");
        } catch (err: any) {
            setError(err.message || "Failed to provision virtual account.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-accent tracking-tight">Provision Virtual Account</h1>
                <p className="text-sm text-accent/60 font-medium mt-1">
                    Deploy an isolated sub-ledger tied to your master account.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* LEFT COLUMN: The Provisioning Wizard */}
                <div className="flex flex-col gap-4">
                    {/* Step Indicator */}
                    <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-accent' : 'bg-secondary/20'}`}></div>
                        ))}
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    {/* WIZARD STEP 1: Parent Account */}
                    {step === 1 && (
                        <Card title="1. Select Parent Account" className="animate-in slide-in-from-right-4">
                            <p className="text-xs text-accent/60 font-medium mb-4">The new virtual account will inherit the corporate entity, routing limits, and ownership permissions of this master ledger.</p>
                            {accountsLoading ? (
                                <div className="h-14 bg-surface animate-pulse rounded-lg border border-secondary/30"></div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {accounts?.map((acc) => (
                                        <div
                                            key={acc.accountNumber}
                                            onClick={() => setParentAccountId(acc.accountNumber)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${parentAccountId === acc.accountNumber ? 'border-accent bg-surface' : 'border-secondary/20 hover:border-secondary/50'}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-extrabold text-accent">{acc.accountType} MASTER</span>
                                                <span className="font-mono text-sm text-accent/60">**** {acc.accountNumber.slice(-4)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Button onClick={() => setStep(2)} className="w-full mt-6 py-3.5">Continue to Purpose</Button>
                        </Card>
                    )}

                    {/* WIZARD STEP 2: Template Selection */}
                    {step === 2 && (
                        <Card title="2. Account Purpose" className="animate-in slide-in-from-right-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(Object.keys(VAM_TEMPLATES) as TemplateKey[]).map((key) => {
                                    const tpl = VAM_TEMPLATES[key];
                                    const isActive = selectedTemplate === key;
                                    return (
                                        <div
                                            key={key}
                                            onClick={() => handleTemplateSelect(key)}
                                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${isActive ? `border-accent bg-surface shadow-md` : `border-secondary/30 bg-dominant hover:border-secondary/60`}`}
                                        >
                                            <span className={`font-extrabold text-sm block mb-1 ${isActive ? 'text-accent' : 'text-accent/70'}`}>
                                                {tpl.label}
                                            </span>
                                            <p className="text-xs text-accent/60 font-medium leading-relaxed">
                                                {tpl.desc}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-4 mt-6">
                                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1 py-3.5">Back</Button>
                                <Button onClick={() => setStep(3)} className="flex-[2] py-3.5">Continue to Details</Button>
                            </div>
                        </Card>
                    )}

                    {/* WIZARD STEP 3: Details & Limits */}
                    {step === 3 && (
                        <Card title="3. Configuration & Limits" className="animate-in slide-in-from-right-4">
                            <div className="flex flex-col gap-5">
                                <Input label="Sub-Account Name" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="e.g. Payroll 2026" />
                                <Input label="Daily Transfer Limit (USD)" type="number" value={dailyLimit} onChange={(e) => setDailyLimit(Number(e.target.value))} />

                                <div className="flex flex-col gap-3 p-4 bg-surface border border-secondary/30 rounded-xl mt-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={allowIncoming} onChange={(e) => setAllowIncoming(e.target.checked)} className="w-5 h-5 rounded border-secondary text-accent focus:ring-accent" />
                                        <span className="text-sm font-bold text-accent">Allow Incoming Transfers</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={allowOutgoing} onChange={(e) => setAllowOutgoing(e.target.checked)} className="w-5 h-5 rounded border-secondary text-accent focus:ring-accent" />
                                        <span className="text-sm font-bold text-accent">Allow Outgoing Transfers</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={issueVirtualCard} onChange={(e) => setIssueVirtualCard(e.target.checked)} className="w-5 h-5 rounded border-secondary text-accent focus:ring-accent" />
                                        <span className="text-sm font-bold text-accent">Issue Virtual Expense Card</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <Button variant="secondary" onClick={() => setStep(2)} className="flex-1 py-3.5">Back</Button>
                                <Button onClick={() => setStep(4)} className="flex-[2] py-3.5">Continue to Funding</Button>
                            </div>
                        </Card>
                    )}

                    {/* WIZARD STEP 4: Funding */}
                    {step === 4 && (
                        <Card title="4. Initial Liquidity (Optional)" className="animate-in slide-in-from-right-4">
                            <p className="text-xs font-medium text-accent/60 mb-4">You may fund this sub-account immediately from the Master ledger, or skip and fund it later.</p>
                            <Input
                                label="Transfer from Master Account (USD)"
                                type="number"
                                step="0.01"
                                value={initialFunding}
                                onChange={(e) => setInitialFunding(e.target.value)}
                                className="text-2xl font-black text-accent h-14"
                            />
                            <div className="flex gap-4 mt-6">
                                <Button variant="secondary" onClick={() => setStep(3)} className="flex-1 py-3.5">Back</Button>
                                <Button onClick={() => setStep(5)} className="flex-[2] py-3.5">Review Deployment</Button>
                            </div>
                        </Card>
                    )}

                    {/* WIZARD STEP 5: Review & Auth */}
                    {step === 5 && (
                        <Card title="5. Review & Authorize" className="animate-in slide-in-from-right-4">
                            <div className="p-5 bg-surface border border-secondary/30 rounded-xl flex flex-col gap-3 text-sm mb-6">
                                <div className="flex justify-between border-b border-dashed border-secondary/40 pb-2"><span className="font-bold text-accent/60">Parent Ledger:</span><span className="font-mono font-bold text-accent">**** {parentAccountId.slice(-4)}</span></div>
                                <div className="flex justify-between border-b border-dashed border-secondary/40 pb-2"><span className="font-bold text-accent/60">Account Type:</span><span className="font-bold text-accent">{selectedTemplate}</span></div>
                                <div className="flex justify-between border-b border-dashed border-secondary/40 pb-2"><span className="font-bold text-accent/60">Limits:</span><span className="font-bold text-rose-600">${dailyLimit} / Day</span></div>
                                <div className="flex justify-between border-b border-dashed border-secondary/40 pb-2"><span className="font-bold text-accent/60">Virtual Card:</span><span className="font-bold text-accent">{issueVirtualCard ? 'Yes' : 'No'}</span></div>
                                <div className="flex justify-between pt-1"><span className="font-bold text-accent/60">Initial Funding:</span><span className="font-black text-emerald-600">${parseFloat(initialFunding || "0").toFixed(2)}</span></div>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="secondary" onClick={() => setStep(4)} className="flex-1 py-3.5" disabled={loading}>Back</Button>
                                <Button onClick={handleProvision} isLoading={loading} className="flex-[2] py-3.5 bg-sky-600 hover:bg-sky-500 shadow-sky-600/20">Authorize & Deploy</Button>
                            </div>
                        </Card>
                    )}
                </div>

                {/* RIGHT COLUMN: Live Card Preview (Always Visible) */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-accent/50 uppercase tracking-widest px-2">Live VAM Preview</h3>
                    <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl group [perspective:1000px]">
                        <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] shadow-2xl rounded-2xl">
                            <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-tr ${theme.bgFront} border ${theme.border} rounded-2xl p-6 overflow-hidden flex flex-col transition-colors duration-500`}>
                                <div className="flex justify-between items-start relative z-10">
                                    <span className="text-white/90 font-black text-lg tracking-tighter flex items-center gap-2">
                                        <div className="w-5 h-5 bg-white text-slate-900 rounded flex items-center justify-center text-[10px]">N</div>
                                        NovaBank VAM
                                    </span>
                                    <div className={`px-2.5 py-1 ${theme.badgeBg} border ${theme.border} rounded text-[9px] font-extrabold text-white tracking-widest uppercase shadow-sm backdrop-blur-md`}>
                                        {theme.label}
                                    </div>
                                </div>
                                <div className="mt-6 mb-3 relative z-10 flex items-center justify-between">
                                    <div className="w-11 h-8 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 rounded-md opacity-90 shadow-sm"></div>
                                </div>
                                <div className="font-mono text-[1.3rem] tracking-widest text-white/80 relative z-10 drop-shadow-md">
                                    ••••  ••••  ••••  XXXX
                                </div>
                                <div className="flex justify-between items-end mt-auto relative z-10 pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-white/50 uppercase tracking-widest font-bold mb-0.5">Account Name</span>
                                        <span className="text-white text-sm font-bold tracking-widest uppercase truncate max-w-[150px]">
                                            {accountName || "SUB-ACCOUNT"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-xs text-accent/60 font-medium max-w-sm mx-auto leading-relaxed">
                            Upon deployment, the system will generate a strict ISO 7812 16-digit PAN. This ledger will be intrinsically linked to Master Account {parentAccountId ? `**** ${parentAccountId.slice(-4)}` : '[Select]'}.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function OpenVamAccountPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-accent/50 font-bold animate-pulse">Loading Provisioning Engine...</div>}>
            <OpenVamAccountContent />
        </Suspense>
    );
}