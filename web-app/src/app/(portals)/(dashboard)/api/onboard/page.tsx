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
  Info,
  FileText,
  Lock,
  Server,
  Eye,
  EyeOff,
  ChevronRight,
  Zap,
  Mail,
} from "lucide-react";
import { merchantService } from "@/services/gateway/merchantService";

export default function DeveloperOnboardPage() {
  const router = useRouter();

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

  // Form State
  const [legalName, setLegalName] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
  const [merchantCode, setMerchantCode] = useState("");
  const [email, setEmail] = useState("");

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
  } | null>(null);

  // Copy Key state
  const [copiedKey, setCopiedKey] = useState(false);
  const [showRawKey, setShowRawKey] = useState(true);

  // Validation Logic
  const getLegalNameError = (): string | null => {
    if (!legalName.trim()) return "Legal Business Name is required.";
    if (legalName.trim().length < 2) return "Legal Business Name must be at least 2 characters long.";
    if (legalName.length > 100) return "Legal Business Name must not exceed 100 characters.";
    return null;
  };

  const getBrnError = (): string | null => {
    if (!businessRegistrationNumber.trim()) return "Business Registration Number is required.";
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
      return "Merchant Code must be 2 to 15 uppercase letters, numbers, hyphens, or underscores.";
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

  const isLegalNameInvalid = touched.legalName && !!getLegalNameError();
  const isBrnInvalid = touched.brn && !!getBrnError();
  const isMerchantCodeInvalid = touched.merchantCode && !!getMerchantCodeError();
  const isEmailInvalid = touched.email && !!getEmailError();

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Intelligent Error Classification (NN/G Heuristic #9: Helpful Errors)
  const parseOnboardingError = (err: any): { title: string; detail: string; action: string; isAuthError: boolean } => {
    const rawMessage = err?.message || err?.detail || "An unexpected error occurred during onboarding.";
    const lower = rawMessage.toLowerCase();

    if (lower.includes("unauthorized") || lower.includes("session token") || lower.includes("401") || lower.includes("jwt")) {
      return {
        title: "Authentication Required (401 Unauthorized)",
        detail: "Your user session is missing, expired, or unauthenticated. You must be logged in to provision a merchant workspace.",
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
        action: "Please review the form fields above and ensure all required fields are correctly formatted.",
        isAuthError: false,
      };
    }

    if (lower.includes("unavailable") || lower.includes("502") || lower.includes("503") || lower.includes("failed to fetch")) {
      return {
        title: "Gateway Connection Error",
        detail: "Unable to establish connection with internal core banking servers.",
        action: "Please check your network connection or verify backend service health, then try again.",
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

    // Touch all fields to trigger visual errors if invalid
    setTouched({ legalName: true, brn: true, merchantCode: true, email: true });

    const legalNameErr = getLegalNameError();
    const brnErr = getBrnError();
    const codeErr = getMerchantCodeError();
    const emailErr = getEmailError();

    if (legalNameErr || brnErr || codeErr || emailErr) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSubmittingStep(1);

    const generatedCode = merchantCode.trim() || `M-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Step 1: Validating details
      await new Promise((res) => setTimeout(res, 400));
      setSubmittingStep(2);

      // Step 2: Provisioning ledger
      await new Promise((res) => setTimeout(res, 500));
      setSubmittingStep(3);

      // Step 3: API Request
      const response = await merchantService.onboardDeveloper({
        legalName: legalName.trim(),
        businessRegistrationNumber: businessRegistrationNumber.trim(),
        merchantCode: generatedCode,
        email: email.trim(),
      });

      setSuccessData({
        merchantId: response.merchantId,
        settlementAccountNumber: response.settlementAccountNumber,
        apiKey: response.apiKey,
        merchantCode: generatedCode,
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
        {/* Navigation back link */}
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
                Production Workspace Ready
              </span>
              <span className="text-xs font-semibold text-accent/60 font-mono">
                Merchant #{successData.merchantId}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-accent tracking-tight">
              Merchant Provisioned Successfully!
            </h1>
            <p className="text-accent/80 font-medium text-base sm:text-lg">
              Your settlement ledger, multi-rail payment router, and HMAC API credentials have been activated.
            </p>
          </div>
        </div>

        {/* Provisioned Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface rounded-2xl p-6 border border-secondary/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-accent/70 font-bold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-sky-600" />
              Registered Merchant Details
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-accent">{legalName}</span>
              <span className="text-sm font-medium text-accent/70 mt-1">
                BRN: <code className="font-mono font-bold text-accent">{businessRegistrationNumber}</code>
              </span>
              <span className="text-xs font-bold text-sky-700 mt-2 bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-md w-fit font-mono">
                Code: {successData.merchantCode}
              </span>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-secondary/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-accent/70 font-bold text-xs uppercase tracking-wider">
              <Server className="w-4 h-4 text-emerald-600" />
              Core Settlement Ledger
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-accent/60 uppercase">System-Provisioned Settlement Account No.</span>
              <code className="text-2xl font-black text-emerald-800 font-mono tracking-tight mt-1">
                {successData.settlementAccountNumber}
              </code>
              <span className="text-xs font-medium text-accent/60 mt-2">
                Created and linked automatically during merchant onboarding.
              </span>
            </div>
          </div>
        </div>

        {/* API Key Box with Warning */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Your Production Secret API Key</h2>
                <p className="text-slate-400 text-xs font-medium">
                  Use this key to authenticate HMAC request headers for core banking endpoints.
                </p>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="p-4 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-200 text-xs font-medium flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Crucial Security Notice:</strong> Store this key securely now. For security purposes, full raw API keys are never stored in plain text and <strong>cannot be retrieved after leaving this page</strong>.
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

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">
              Default granted scopes: <code className="text-slate-300 font-mono">accounts:read, treasury:read, treasury:write</code>
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
                Developer Portal
              </span>
              <span className="text-xs font-semibold text-accent/60">Fast-Track Setup</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-accent tracking-tight">
              Developer & Merchant Onboarding
            </h1>
            <p className="text-accent/80 font-medium max-w-2xl text-base sm:text-lg leading-relaxed">
              Provision your merchant identity, generate your isolated settlement account, and activate live API access.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Form (2 Cols) & Guidance Sidebar (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Form Container */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-secondary/40 shadow-sm flex flex-col gap-6">
          {/* Error Alert Container (WCAG 2.2 Accessible Alert) */}
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
            {/* Legal Business Name */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={legalNameId}
                  className="text-xs font-extrabold text-accent uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-sky-600" />
                  Legal Business Name
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
                placeholder="e.g. Acme Financial Technologies Inc."
                className={`px-4 py-3.5 bg-surface border-2 rounded-xl text-accent font-medium transition-all text-sm min-h-[44px] ${
                  isLegalNameInvalid
                    ? "border-rose-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-200"
                    : "border-secondary/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                } outline-none placeholder:text-accent/40`}
              />

              <p id={legalNameHelpId} className="text-xs text-accent/60 font-medium">
                Official entity name as recorded on government incorporation tax filings.
              </p>

              {isLegalNameInvalid && (
                <p id={legalNameErrorId} className="text-xs font-bold text-rose-600 flex items-center gap-1.5 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {getLegalNameError()}
                </p>
              )}
            </div>

            {/* Business Registration Number (BRN) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={brnId}
                  className="text-xs font-extrabold text-accent uppercase tracking-wider flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  Business Registration Number (BRN)
                  <span className="text-rose-600 font-bold" title="Required">*</span>
                </label>
                <span className="text-[11px] font-semibold text-accent/60">Required</span>
              </div>

              <input
                id={brnId}
                type="text"
                required
                aria-required="true"
                aria-describedby={`${brnHelpId} ${isBrnInvalid ? brnErrorId : ""}`}
                aria-invalid={isBrnInvalid}
                value={businessRegistrationNumber}
                onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                onBlur={() => handleBlur("brn")}
                placeholder="e.g. BRN-2026-987654"
                className={`px-4 py-3.5 bg-surface border-2 rounded-xl text-accent font-medium transition-all text-sm min-h-[44px] ${
                  isBrnInvalid
                    ? "border-rose-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-200"
                    : "border-secondary/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                } outline-none placeholder:text-accent/40`}
              />

              <p id={brnHelpId} className="text-xs text-accent/60 font-medium">
                Unique regulatory identification code, tax EIN, or commercial registration number.
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
                  Preferred Merchant Code
                </label>
                <span className="text-[11px] font-semibold text-accent/50 bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                  Optional
                </span>
              </div>

              <div className="relative flex items-center">
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
              </div>

              <div id={merchantCodeHelpId} className="flex items-center justify-between text-xs text-accent/60 font-medium">
                <span>Custom short code used in routing prefixes. Uppercase letters & numbers only.</span>
                {!merchantCode.trim() && (
                  <span className="text-[10px] font-mono text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded font-bold shrink-0">
                    Auto-generated if empty
                  </span>
                )}
              </div>

              {isMerchantCodeInvalid && (
                <p id={merchantCodeErrorId} className="text-xs font-bold text-rose-600 flex items-center gap-1.5 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {getMerchantCodeError()}
                </p>
              )}
            </div>

            {/* Action Buttons & System Status */}
            <div className="pt-4 flex flex-col gap-4 border-t border-secondary/30">
              {/* Submission Step Indicator */}
              {isSubmitting && (
                <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sky-900 font-bold text-sm">
                    <Loader2 className="w-5 h-5 text-sky-600 animate-spin shrink-0" aria-hidden="true" />
                    <span>Provisioning Merchant Infrastructure...</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-slate-600">
                    <div className={`p-2 rounded flex items-center gap-1.5 ${submittingStep >= 1 ? "bg-sky-200/60 text-sky-900" : "bg-slate-100"}`}>
                      <Check className="w-3.5 h-3.5 text-sky-700" />
                      1. Verify BRN
                    </div>
                    <div className={`p-2 rounded flex items-center gap-1.5 ${submittingStep >= 2 ? "bg-sky-200/60 text-sky-900" : "bg-slate-100"}`}>
                      <Check className="w-3.5 h-3.5 text-sky-700" />
                      2. Create Ledger
                    </div>
                    <div className={`p-2 rounded flex items-center gap-1.5 ${submittingStep >= 3 ? "bg-sky-200/60 text-sky-900" : "bg-slate-100"}`}>
                      <Check className="w-3.5 h-3.5 text-sky-700" />
                      3. Issue Keys
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
                      Initializing Merchant Workspace...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-sky-400" />
                      Initialize Merchant Workspace
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

        {/* Guidance & Value Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface rounded-3xl p-6 border border-secondary/30 flex flex-col gap-5">
            <h2 className="text-base font-extrabold text-accent flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              What Happens Next?
            </h2>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-extrabold flex items-center justify-center shrink-0 border border-sky-200">
                  1
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-accent">System-Provisioned Settlement Account</span>
                  <span className="text-accent/70 leading-relaxed font-medium">
                    A dedicated settlement account is dynamically created and bound in the core ledger automatically.
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
                    Your initial API key is derived and assigned default scopes for sandbox & live routing.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-extrabold flex items-center justify-center shrink-0 border border-sky-200">
                  3
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-accent">Multi-Rail Activation</span>
                  <span className="text-accent/70 leading-relaxed font-medium">
                    Unlock immediate access to VAM sub-accounts, payroll dispatch, and payment intents.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Help Box */}
          <div className="bg-sky-50/70 rounded-2xl p-5 border border-sky-200 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 text-xs text-sky-900">
              <span className="font-bold">Need assistance with onboarding?</span>
              <span className="text-sky-800/80 font-medium leading-relaxed">
                Contact your enterprise integration manager or check the live API reference after provisioning.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

