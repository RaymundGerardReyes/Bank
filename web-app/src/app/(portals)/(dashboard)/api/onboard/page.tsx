"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Hash,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Copy,
  Check,
  Loader2,
  Sparkles,
  HelpCircle,
  FileText,
  Lock,
  Server,
  Eye,
  EyeOff,
  ChevronRight,
  Zap,
  Mail,
  Network,
  KeyRound,
} from "lucide-react";
import { merchantService } from "@/services/gateway/merchantService";

// Grouped scopes matching backend ApiKeyAuthenticationFilter
const SCOPE_GROUPS = [
  {
    domain: "Virtual Accounts (VAM)",
    scopes: [
      { id: "accounts:read", label: "Read Accounts" },
      { id: "accounts:write", label: "Create / Manage Accounts" },
    ],
  },
  {
    domain: "Treasury & Transfers",
    scopes: [
      { id: "treasury:read", label: "Read Transfers" },
      { id: "treasury:write", label: "Execute Transfers" },
    ],
  },
  {
    domain: "Payment Gateway",
    scopes: [
      { id: "payments:write", label: "Process Checkout Payments" },
    ],
  },
  {
    domain: "Payroll Batch",
    scopes: [
      { id: "payroll:read", label: "Read Payroll" },
      { id: "payroll:write", label: "Dispatch Batch Payroll" },
    ],
  },
];

export default function DeveloperOnboardPage() {
  const router = useRouter();

  // Tier Selection: Developer Quickstart vs Commercial Merchant
  const [onboardingType, setOnboardingType] = useState<"DEVELOPER" | "MERCHANT">("DEVELOPER");

  // Form IDs for WCAG 2.2 Accessibility
  const legalNameId = useId();
  const legalNameHelpId = useId();
  const legalNameErrorId = useId();

  const brnId = useId();
  const brnHelpId = useId();
  const brnErrorId = useId();

  const merchantCodeId = useId();
  const merchantCodeHelpId = useId();
  const merchantCodeErrorId = useId();

  const emailId = useId();
  const emailHelpId = useId();
  const emailErrorId = useId();

  const cidrId = useId();
  const cidrHelpId = useId();
  const cidrErrorId = useId();

  // Core Identity Form State
  const [legalName, setLegalName] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
  const [merchantCode, setMerchantCode] = useState("");
  const [email, setEmail] = useState("");

  // Security Credentials Form State
  const [environment, setEnvironment] = useState<"LIVE" | "SANDBOX">("SANDBOX");
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    "accounts:read",
    "accounts:write",
    "treasury:read",
    "treasury:write",
  ]);

  // Touch/Blur state for inline validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // System Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingStep, setSubmittingStep] = useState(0);
  const [error, setError] = useState<{ title: string; detail: string; action: string; isAuthError?: boolean } | null>(null);
  const [successData, setSuccessData] = useState<{
    merchantId: number;
    settlementAccountNumber: string;
    apiKey: string;
    merchantCode: string;
    environment: "LIVE" | "SANDBOX";
    cidrWhitelist: string;
    scopes: string[];
    onboardingType: "DEVELOPER" | "MERCHANT";
  } | null>(null);

  // Copy Key state
  const [copiedKey, setCopiedKey] = useState(false);
  const [showRawKey, setShowRawKey] = useState(true);

  // Validation Logic
  const getLegalNameError = (): string | null => {
    if (!legalName.trim()) {
      return onboardingType === "MERCHANT"
        ? "Legal Business Name is required for commercial registration."
        : "Developer / Workspace Name is required.";
    }
    if (legalName.trim().length < 2) return "Name must be at least 2 characters long.";
    if (legalName.length > 100) return "Name must not exceed 100 characters.";
    return null;
  };

  const getBrnError = (): string | null => {
    if (!businessRegistrationNumber.trim()) {
      if (onboardingType === "MERCHANT") {
        return "Business Registration Number (BRN / BIR TIN) is required for commercial merchant checkout.";
      }
      return null; // Optional for Developer Quickstart
    }
    if (businessRegistrationNumber.trim().length < 3) return "BRN must be at least 3 characters long.";
    const brnRegex = /^[a-zA-Z0-9\-\s\/]+$/;
    if (!brnRegex.test(businessRegistrationNumber.trim())) {
      return "BRN contains invalid characters. Use letters, numbers, hyphens, or slashes.";
    }
    return null;
  };

  const getMerchantCodeError = (): string | null => {
    if (!merchantCode.trim()) return null; // Optional
    const codeRegex = /^[A-Z0-9_-]{2,15}$/;
    if (!codeRegex.test(merchantCode.trim())) {
      return "Code must be 2 to 15 uppercase letters, numbers, hyphens, or underscores.";
    }
    return null;
  };

  const getEmailError = (): string | null => {
    if (!email.trim()) return "Contact Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address (e.g. dev@company.com).";
    }
    return null;
  };

  const getCidrError = (): string | null => {
    if (!ipWhitelist.trim() || ipWhitelist.trim() === "0.0.0.0/0") return null;
    const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    const valid = ipWhitelist.split(",").every((p) => cidrRegex.test(p.trim()));
    if (!valid) return "Invalid CIDR notation. Use format like 192.168.1.0/24 or comma-separated IPs.";
    return null;
  };

  const isLegalNameInvalid = touched.legalName && !!getLegalNameError();
  const isBrnInvalid = touched.brn && !!getBrnError();
  const isMerchantCodeInvalid = touched.merchantCode && !!getMerchantCodeError();
  const isEmailInvalid = touched.email && !!getEmailError();
  const isCidrInvalid = touched.cidr && !!getCidrError();

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Intelligent Error Classification
  const parseOnboardingError = (err: any): { title: string; detail: string; action: string; isAuthError: boolean } => {
    const rawMessage = err?.message || err?.detail || "An unexpected error occurred during onboarding.";
    const lower = rawMessage.toLowerCase();

    if (lower.includes("unauthorized") || lower.includes("session token") || lower.includes("401") || lower.includes("jwt")) {
      return {
        title: "Authentication Required (401 Unauthorized)",
        detail: "Your user session is missing, expired, or unauthenticated. You must be logged in to provision a workspace.",
        action: "Please log in to your developer dashboard account to continue onboarding.",
        isAuthError: true,
      };
    }

    if (lower.includes("duplicate") || lower.includes("already exists") || lower.includes("409") || lower.includes("conflict")) {
      return {
        title: "Registration Conflict (409 Conflict)",
        detail: rawMessage,
        action: "Please verify that your Business Registration Number or Merchant Code is unique.",
        isAuthError: false,
      };
    }

    if (lower.includes("invalid") || lower.includes("400") || lower.includes("bad request") || lower.includes("email")) {
      return {
        title: "Invalid Onboarding Payload (400 Bad Request)",
        detail: rawMessage,
        action: "Please review the form fields and ensure all required values are correctly formatted.",
        isAuthError: false,
      };
    }

    return {
      title: "Onboarding Provisioning Error",
      detail: rawMessage,
      action: "Please verify your input details and try again, or contact developer support.",
      isAuthError: false,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ legalName: true, brn: true, merchantCode: true, email: true, cidr: true });

    const legalNameErr = getLegalNameError();
    const brnErr = getBrnError();
    const codeErr = getMerchantCodeError();
    const emailErr = getEmailError();
    const cidrErr = getCidrError();

    if (legalNameErr || brnErr || codeErr || emailErr || cidrErr) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSubmittingStep(1);

    const generatedCode = merchantCode.trim() || `M-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Step 1: Validating details
      await new Promise((res) => setTimeout(res, 300));
      setSubmittingStep(2);

      // Step 2: Provisioning ledger
      await new Promise((res) => setTimeout(res, 400));
      setSubmittingStep(3);

      // Step 3: API Request
      const response = await merchantService.onboardDeveloper({
        legalName: legalName.trim(),
        businessRegistrationNumber: businessRegistrationNumber.trim() || undefined,
        merchantCode: generatedCode,
        email: email.trim(),
        environment,
        cidrWhitelist: ipWhitelist.trim() || "0.0.0.0/0",
        scopes: selectedScopes,
        onboardingType,
      });

      setSuccessData({
        merchantId: response.merchantId,
        settlementAccountNumber: response.settlementAccountNumber,
        apiKey: response.apiKey,
        merchantCode: generatedCode,
        environment,
        cidrWhitelist: ipWhitelist.trim() || "0.0.0.0/0",
        scopes: selectedScopes,
        onboardingType,
      });
    } catch (err: any) {
      setError(parseOnboardingError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyKey = () => {
    if (!successData?.apiKey) return;
    navigator.clipboard.writeText(successData.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  // SUCCESS STAGE UI
  if (successData) {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full py-8 px-4 animate-in fade-in zoom-in-95 duration-300">
        <div>
          <Link
            href="/api"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent/70 hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-md px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to API Gateway Overview
          </Link>
        </div>

        {/* Success Header */}
        <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300 uppercase tracking-wider">
                {successData.onboardingType === "MERCHANT" ? "Commercial Merchant Active" : "Developer Workspace Ready"}
              </span>
              <span className="text-xs font-semibold text-accent/60 font-mono">
                Workspace #{successData.merchantId}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${successData.environment === "LIVE" ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-700"}`}>
                {successData.environment}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-accent tracking-tight">
              {successData.onboardingType === "MERCHANT" ? "Commercial Merchant Provisioned!" : "Developer Credentials Activated!"}
            </h1>
            <p className="text-accent/80 font-medium text-base sm:text-lg">
              Your settlement account has been provisioned, bound to your customer profile, and authenticated for API routing.
            </p>
          </div>
        </div>

        {/* Provisioned Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface rounded-2xl p-6 border border-secondary/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-accent/70 font-bold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-sky-600" />
              Workspace & Identity
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-accent">{legalName}</span>
              <span className="text-sm font-medium text-accent/70 mt-1">
                BRN / TIN: <code className="font-mono font-bold text-accent">{businessRegistrationNumber || "Auto-assigned (Dev)"}</code>
              </span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold text-sky-700 bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-md font-mono">
                  Code: {successData.merchantCode}
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md font-mono">
                  IP: {successData.cidrWhitelist}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-secondary/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-accent/70 font-bold text-xs uppercase tracking-wider">
              <Server className="w-4 h-4 text-emerald-600" />
              Linked Settlement Ledger
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-accent/60 uppercase">Settlement Account Number</span>
              <span className="text-xs font-bold text-accent/60 uppercase">System-Provisioned Settlement Account No.</span>
              <code className="text-xl sm:text-2xl font-black text-emerald-800 font-mono tracking-tight mt-1">
                {successData.settlementAccountNumber}
              </code>
              <span className="text-xs font-medium text-accent/60 mt-2">
                Visible in your accounts list for direct transfer and VAM sub-account scoping.
              </span>
            </div>
          </div>
        </div>

        {/* API Key Box with Security Details */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Your Secret API Key</h2>
                <p className="text-slate-400 text-xs font-medium">
                  Use this HMAC key in header <code className="text-sky-300 font-mono">X-API-Key</code> for authenticated core banking calls.
                </p>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="p-4 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-200 text-xs font-medium flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Crucial Security Notice:</strong> Store this key now. Raw API keys are never stored in plain text and <strong>cannot be retrieved after leaving this page</strong>.
            </span>
          </div>

          {/* Key Display & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <code className="font-mono text-sm sm:text-base font-bold text-emerald-400 flex-1 break-all select-all">
              {showRawKey ? successData.apiKey : "••••••••••••••••••••••••••••••••••••••••••••••••"}
            </code>

            <div className="flex items-center gap-2 shrink-0 justify-end">
              <button
                type="button"
                onClick={() => setShowRawKey(!showRawKey)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors focus:ring-2 focus:ring-sky-500 focus:outline-none flex items-center gap-1.5 min-h-[44px]"
                aria-label={showRawKey ? "Hide API key" : "Show API key"}
              >
                {showRawKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showRawKey ? "Hide" : "Show"}
              </button>

              <button
                type="button"
                onClick={handleCopyKey}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all focus:ring-2 focus:ring-sky-500 focus:outline-none flex items-center gap-1.5 min-h-[44px] shadow-sm ${
                  copiedKey
                    ? "bg-emerald-600 text-white"
                    : "bg-sky-600 hover:bg-sky-500 text-white"
                }`}
              >
                {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedKey ? "Copied to Clipboard!" : "Copy API Key"}
              </button>
            </div>
          </div>

          {/* Granted Scopes Chips */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Granted Action Limits / Scopes</span>
            <div className="flex flex-wrap gap-2">
              {successData.scopes.map((scope) => (
                <span key={scope} className="px-2.5 py-1 bg-slate-800 text-sky-300 rounded-md text-xs font-mono font-bold border border-slate-700">
                  {scope}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">
              Environment: <strong className="text-white">{successData.environment}</strong> (TTL: {successData.environment === "LIVE" ? "90 days" : "365 days"})
            </span>
            <Link
              href="/api"
              className="w-full sm:w-auto px-6 py-3 bg-white text-accent hover:bg-slate-100 font-bold rounded-xl text-sm transition-all text-center focus:ring-2 focus:ring-sky-500 focus:outline-none flex items-center justify-center gap-2 min-h-[44px]"
            >
              Go to API Gateway Dashboard
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // MAIN ONBOARDING FORM UI
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full py-8 px-4">
      {/* Header & Navigation */}
      <div className="flex flex-col gap-4">
        <div>
          <Link
            href="/api"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent/70 hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-md px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to API Gateway Overview
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-full border border-sky-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Developer Gateway
              </span>
              <span className="text-xs font-semibold text-accent/60">Unified Credential Setup</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-accent tracking-tight">
              Developer & Merchant Setup
            </h1>
            <p className="text-accent/80 font-medium max-w-2xl text-base sm:text-lg leading-relaxed">
              Configure your API access credentials, choose your environment and permission scopes, and optionally register commercial merchant checkout.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Form (2 Cols) & Guidance Sidebar (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Form Container */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-secondary/40 shadow-sm flex flex-col gap-6">
          {/* Tier Switcher Tabs */}
          <div className="flex flex-col gap-2 bg-surface p-1.5 rounded-2xl border border-secondary/30">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setOnboardingType("DEVELOPER")}
                className={`py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  onboardingType === "DEVELOPER"
                    ? "bg-white text-accent shadow-sm border border-secondary/30"
                    : "text-accent/60 hover:text-accent"
                }`}
              >
                <Sparkles className="w-4 h-4 text-sky-600" />
                Developer Quickstart
              </button>
              <button
                type="button"
                onClick={() => setOnboardingType("MERCHANT")}
                className={`py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  onboardingType === "MERCHANT"
                    ? "bg-white text-accent shadow-sm border border-secondary/30"
                    : "text-accent/60 hover:text-accent"
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                Commercial Merchant
              </button>
            </div>
            <p className="text-[11px] text-accent/60 px-3 py-1 font-medium">
              {onboardingType === "DEVELOPER"
                ? "Fast-track API key creation for account automation & VAM sub-accounts. Business registration number (BIR/BRN) is optional."
                : "Full payment gateway setup with automated card processing & QR Ph settlement. Legal Entity Name and BIR/BRN tax ID are required."}
            </p>
          </div>

          {/* Error Alert Container */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-5 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-start gap-4 animate-in slide-in-from-top-2 duration-200"
            >
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-2 text-rose-900 w-full">
                <h3 className="font-bold text-sm">{error.title}</h3>
                <p className="text-xs text-rose-800/90 font-medium">{error.detail}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-700 font-semibold bg-rose-100/60 p-3 rounded-xl border border-rose-200">
                  <span>💡 Action item: {error.action}</span>
                  {error.isAuthError && (
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      Log In to Portal
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            {/* Workspace / Legal Business Name */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={legalNameId}
                  className="text-xs font-extrabold text-accent uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-sky-600" />
                  {onboardingType === "MERCHANT" ? "Legal Business Name" : "Workspace / Team Name"}
                  {onboardingType === "MERCHANT" ? "Legal Business Name" : "Legal Business Name / Workspace Name"}
                  <span className="text-rose-600 font-bold" title="Required">*</span>
                </label>
                <span className="text-[11px] font-semibold text-accent/60">Required</span>
              </div>

              <input
                id={legalNameId}
                type="text"
                required
                aria-required="true"
                aria-describedby={`${legalNameHelpId} ${isLegalNameInvalid ? legalNameErrorId : ""}`}
                aria-invalid={isLegalNameInvalid}
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                onBlur={() => handleBlur("legalName")}
                placeholder={onboardingType === "MERCHANT" ? "e.g. Acme Financial Technologies Inc." : "e.g. My App Dev Workspace"}
                className={`px-4 py-3.5 bg-surface border-2 rounded-xl text-accent font-medium transition-all text-sm min-h-[44px] ${
                  isLegalNameInvalid
                    ? "border-rose-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-200"
                    : "border-secondary/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                } outline-none placeholder:text-accent/40`}
              />

              <p id={legalNameHelpId} className="text-xs text-accent/60 font-medium">
                {onboardingType === "MERCHANT"
                  ? "Official entity name as recorded on government tax filings and incorporation certificates."
                  : "Friendly name identifying your application or development team workspace."}
              </p>

              {isLegalNameInvalid && (
                <p id={legalNameErrorId} className="text-xs font-bold text-rose-600 flex items-center gap-1.5 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {getLegalNameError()}
                </p>
              )}
            </div>

            {/* Business Registration Number (BRN / BIR) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={brnId}
                  className="text-xs font-extrabold text-accent uppercase tracking-wider flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  Business Registration Number (BRN / BIR TIN)
                  {onboardingType === "MERCHANT" && (
                    <span className="text-rose-600 font-bold" title="Required">*</span>
                  )}
                </label>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  onboardingType === "MERCHANT" ? "text-rose-700 bg-rose-50" : "text-accent/60 bg-secondary/10"
                }`}>
                  {onboardingType === "MERCHANT" ? "Required for Merchants" : "Optional"}
                </span>
              </div>

              <input
                id={brnId}
                type="text"
                aria-describedby={`${brnHelpId} ${isBrnInvalid ? brnErrorId : ""}`}
                aria-invalid={isBrnInvalid}
                value={businessRegistrationNumber}
                onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                onBlur={() => handleBlur("brn")}
                placeholder={onboardingType === "MERCHANT" ? "e.g. 000-123-456-000 or BRN-2026-987654" : "Optional for developer testing"}
                className={`px-4 py-3.5 bg-surface border-2 rounded-xl text-accent font-medium transition-all text-sm min-h-[44px] ${
                  isBrnInvalid
                    ? "border-rose-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-200"
                    : "border-secondary/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                } outline-none placeholder:text-accent/40`}
              />

              <p id={brnHelpId} className="text-xs text-accent/60 font-medium">
                {onboardingType === "MERCHANT"
                  ? "Government-issued BIR TIN, SEC registration, or DTI business certificate number."
                  : "Optional for internal testing. Leave blank to automatically assign a developer sandbox identifier."}
              </p>

              {isBrnInvalid && (
                <p id={brnErrorId} className="text-xs font-bold text-rose-600 flex items-center gap-1.5 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {getBrnError()}
                </p>
              )}
            </div>

            {/* Contact Email Address */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={emailId}
                  className="text-xs font-extrabold text-accent uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  Contact Email Address
                  <span className="text-rose-600 font-bold" title="Required">*</span>
                </label>
                <span className="text-[11px] font-semibold text-accent/60">Required</span>
              </div>

              <input
                id={emailId}
                type="email"
                required
                aria-required="true"
                aria-describedby={`${emailHelpId} ${isEmailInvalid ? emailErrorId : ""}`}
                aria-invalid={isEmailInvalid}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="e.g. developer@company.com"
                className={`px-4 py-3.5 bg-surface border-2 rounded-xl text-accent font-medium transition-all text-sm min-h-[44px] ${
                  isEmailInvalid
                    ? "border-rose-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-200"
                    : "border-secondary/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                } outline-none placeholder:text-accent/40`}
              />

              <p id={emailHelpId} className="text-xs text-accent/60 font-medium">
                Primary point of contact for API notifications, webhooks, and gateway audit logs.
              </p>

              {isEmailInvalid && (
                <p id={emailErrorId} className="text-xs font-bold text-rose-600 flex items-center gap-1.5 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {getEmailError()}
                </p>
              )}
            </div>

            {/* Preferred Merchant Code */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={merchantCodeId}
                  className="text-xs font-extrabold text-accent uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Hash className="w-3.5 h-3.5 text-sky-600" />
                  Preferred Routing Code
                </label>
                <span className="text-[11px] font-semibold text-accent/50 bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                  Optional
                </span>
              </div>

              <input
                id={merchantCodeId}
                type="text"
                aria-describedby={`${merchantCodeHelpId} ${isMerchantCodeInvalid ? merchantCodeErrorId : ""}`}
                aria-invalid={isMerchantCodeInvalid}
                value={merchantCode}
                onChange={(e) => setMerchantCode(e.target.value.toUpperCase())}
                onBlur={() => handleBlur("merchantCode")}
                placeholder="e.g. M-ACME"
                className={`w-full px-4 py-3.5 bg-surface border-2 rounded-xl text-accent font-mono font-bold transition-all text-sm min-h-[44px] ${
                  isMerchantCodeInvalid
                    ? "border-rose-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-200"
                    : "border-secondary/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                } outline-none placeholder:text-accent/30 placeholder:font-sans uppercase`}
              />

              <div id={merchantCodeHelpId} className="flex items-center justify-between text-xs text-accent/60 font-medium">
                <span>Routing prefix for internal transactions. Auto-generated if left empty.</span>
              </div>

              {isMerchantCodeInvalid && (
                <p id={merchantCodeErrorId} className="text-xs font-bold text-rose-600 flex items-center gap-1.5 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {getMerchantCodeError()}
                </p>
              )}
            </div>

            {/* Security Controls Divider */}
            <div className="border-t border-secondary/30 pt-4 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-extrabold text-accent uppercase tracking-wider">
                  Initial Credential Security Policies
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Environment */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-accent uppercase tracking-wider">Environment</label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value as "LIVE" | "SANDBOX")}
                    className="px-3.5 py-3 bg-surface border border-secondary/40 rounded-xl text-accent font-bold text-sm"
                  >
                    <option value="SANDBOX">Sandbox (365d)</option>
                    <option value="LIVE">Live Production (90d)</option>
                  </select>
                </div>

                {/* IP Whitelist (CIDR notation) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={cidrId} className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1">
                    <Network className="w-3 h-3 text-sky-600" />
                    IP Whitelist (CIDR)
                  </label>
                  <input
                    id={cidrId}
                    type="text"
                    placeholder="0.0.0.0/0 (Allow All)"
                    value={ipWhitelist}
                    onChange={(e) => setIpWhitelist(e.target.value)}
                    onBlur={() => handleBlur("cidr")}
                    className={`px-3.5 py-3 bg-surface border rounded-xl font-mono text-sm ${
                      isCidrInvalid ? "border-rose-400" : "border-secondary/40"
                    }`}
                  />
                  {isCidrInvalid && (
                    <p id={cidrErrorId} className="text-xs font-bold text-rose-600 mt-0.5">
                      {getCidrError()}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Limits / Scopes Grid */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-accent uppercase tracking-wider">Initial Granted Scopes</label>
                  <span className="text-[10px] text-accent/60 font-bold bg-secondary/10 px-2 py-0.5 rounded">Action Limits</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SCOPE_GROUPS.map((group) => (
                    <div key={group.domain} className="bg-surface p-3 rounded-xl border border-secondary/30 flex flex-col gap-2">
                      <span className="text-[11px] font-extrabold text-sky-700">{group.domain}</span>
                      <div className="flex flex-col gap-1.5">
                        {group.scopes.map((scope) => (
                          <label key={scope.id} className="flex items-center gap-2 text-xs font-bold text-accent cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedScopes.includes(scope.id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedScopes([...selectedScopes, scope.id]);
                                else setSelectedScopes(selectedScopes.filter((s) => s !== scope.id));
                              }}
                              className="rounded border-secondary w-4 h-4 text-sky-600 focus:ring-sky-500"
                            />
                            {scope.label} <span className="text-[9px] text-accent/40 font-mono">({scope.id})</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons & System Status */}
            <div className="pt-4 flex flex-col gap-4 border-t border-secondary/30">
              {/* Submission Step Indicator */}
              {isSubmitting && (
                <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sky-900 font-bold text-sm">
                    <Loader2 className="w-5 h-5 text-sky-600 animate-spin shrink-0" aria-hidden="true" />
                    <span>Provisioning Infrastructure & Ledger...</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-slate-600">
                    <div className={`p-2 rounded flex items-center gap-1.5 ${submittingStep >= 1 ? "bg-sky-200/60 text-sky-900" : "bg-slate-100"}`}>
                      <Check className="w-3.5 h-3.5 text-sky-700" />
                      1. Verify Profile
                    </div>
                    <div className={`p-2 rounded flex items-center gap-1.5 ${submittingStep >= 2 ? "bg-sky-200/60 text-sky-900" : "bg-slate-100"}`}>
                      <Check className="w-3.5 h-3.5 text-sky-700" />
                      2. Create Ledger
                    </div>
                    <div className={`p-2 rounded flex items-center gap-1.5 ${submittingStep >= 3 ? "bg-sky-200/60 text-sky-900" : "bg-slate-100"}`}>
                      <Check className="w-3.5 h-3.5 text-sky-700" />
                      3. Issue HMAC Key
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-4 px-8 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-accent/20 min-h-[48px] focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                      Initializing Workspace...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-sky-400" />
                      {onboardingType === "MERCHANT" ? "Initialize Merchant Workspace" : "Generate Developer Credentials"}
                    </>
                  )}
                </button>

                <Link
                  href="/api"
                  className="w-full sm:w-auto py-3.5 px-6 bg-surface hover:bg-secondary/20 text-accent font-bold rounded-xl transition-all text-center text-sm border border-secondary/40 min-h-[48px] flex items-center justify-center focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Guidance & Architecture Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface rounded-3xl p-6 border border-secondary/30 flex flex-col gap-5">
            <h2 className="text-base font-extrabold text-accent flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              How It Works
            </h2>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-extrabold flex items-center justify-center shrink-0 border border-sky-200">
                  1
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-accent">Auto-Provisioned Settlement Account</span>
                  <span className="text-accent/70 leading-relaxed font-medium">
                    A dedicated settlement ledger account is created and bound to both your customer profile and merchant identity.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-extrabold flex items-center justify-center shrink-0 border border-sky-200">
                  2
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-accent">HMAC Key Generation</span>
                  <span className="text-accent/70 leading-relaxed font-medium">
                    Your key is derived with SHA-256 hashing, scoped to the specified CIDR whitelist and selected permission scopes.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-extrabold flex items-center justify-center shrink-0 border border-sky-200">
                  3
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-accent">VAM & Multi-Rail Ready</span>
                  <span className="text-accent/70 leading-relaxed font-medium">
                    Use your keys immediately on core banking endpoints, VAM virtual accounts, and payment checkouts.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Help Box */}
          <div className="bg-sky-50/70 rounded-2xl p-5 border border-sky-200 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 text-xs text-sky-900">
              <span className="font-bold">Need assistance?</span>
              <span className="text-sky-800/80 font-medium leading-relaxed">
                Check our live API reference or contact developer support for custom high-volume CIDR whitelist configurations.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
