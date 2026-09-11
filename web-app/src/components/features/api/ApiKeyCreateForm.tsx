"use client";

import React, { useState, useEffect, useId } from "react";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  Sparkles,
  Server,
  ChevronDown,
  Sliders,
  ClipboardList,
  Building2,
  Mail,
  Hash,
  AlertCircle,
} from "lucide-react";
import { MerchantStatus, NewlyGeneratedKeyData, SCOPE_GROUPS } from "./types";
import { merchantService } from "@/services/gateway/merchantService";

export interface ApiKeyCreateFormProps {
  accounts: any[] | undefined;
  merchantStatus: MerchantStatus | null;
  isGenerating: boolean;
  onSuccessDirect?: (data: NewlyGeneratedKeyData) => void;
  onMerchantStatusUpdate?: (status: MerchantStatus) => void;
  onSubmit: (data: {
    name: string;
    applicationId?: string;
    environment: "LIVE" | "SANDBOX";
    linkedAccountId: string;
    ipWhitelist: string;
    selectedScopes: string[];
    perTxLimit?: string;
    dailyLimit?: string;
  }) => void;
  onCancel: () => void;
  onOpenOnboarding?: (type: "DEVELOPER" | "MERCHANT", env: "LIVE" | "SANDBOX") => void;
}

/**
 * ApiKeyCreateForm — Single Canonical Credential & Workspace Profile Form.
 *
 * One unified form with:
 *  1. Environment Selection (Sandbox vs Live)
 *  2. Workspace & Commercial Profile Specification (reusable & editable)
 *  3. Application Details (Key Name, Application ID)
 *  4. API Credential Account Scope (VAM Sub-account)
 *  5. Granted Action Limit Scopes
 *  6. Advanced Security Controls (CIDR IP Whitelist, Velocity Limits)
 *  7. Live Policy Summary
 *  8. Single "Generate" Action
 */
export const ApiKeyCreateForm: React.FC<ApiKeyCreateFormProps> = ({
  accounts,
  merchantStatus,
  isGenerating: isGeneratingProp,
  onSuccessDirect,
  onMerchantStatusUpdate,
  onSubmit,
  onCancel,
}) => {
  const legalNameId = useId();
  const legalNameHelpId = useId();
  const brnId = useId();
  const brnHelpId = useId();
  const emailId = useId();
  const emailHelpId = useId();
  const merchantCodeId = useId();
  const merchantCodeHelpId = useId();
  const keyNameId = useId();
  const appIdId = useId();
  const accountScopeId = useId();

  // ── 1. Environment ──────────────────────────────────────────────────────────
  const [environment, setEnvironment] = useState<"LIVE" | "SANDBOX">("SANDBOX");

  // ── 2. Profile Details (reusable, editable, pre-filled if existing) ───────────
  const [legalName, setLegalName] = useState(merchantStatus?.legalName || "");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState(
    merchantStatus?.businessRegistrationNumber || ""
  );
  const [email, setEmail] = useState("");
  const [merchantCode, setMerchantCode] = useState(merchantStatus?.merchantCode || "");

  // Update pre-filled profile if merchantStatus changes and inputs are untouched
  useEffect(() => {
    if (merchantStatus?.legalName && !legalName) {
      setLegalName(merchantStatus.legalName);
    }
    if (merchantStatus?.businessRegistrationNumber && !businessRegistrationNumber) {
      setBusinessRegistrationNumber(merchantStatus.businessRegistrationNumber);
    }
  }, [merchantStatus, legalName, businessRegistrationNumber]);

  // ── 3. Application Details ──────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [applicationId, setApplicationId] = useState("");

  // ── 4. Account Scope ────────────────────────────────────────────────────────
  const [linkedAccountId, setLinkedAccountId] = useState("");

  // ── 5. Granted Scopes ───────────────────────────────────────────────────────
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    "payments:write",
    "payments:read",
    "accounts:read",
    "accounts:write",
    "treasury:read",
    "treasury:write",
  ]);

  // ── 6. Advanced Controls ────────────────────────────────────────────────────
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [perTxLimit, setPerTxLimit] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");

  // ── UI States ───────────────────────────────────────────────────────────────
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-select first account or designated settlement account
  useEffect(() => {
    if (accounts && accounts.length > 0 && !linkedAccountId) {
      setLinkedAccountId(accounts[0].accountNumber);
    }
  }, [accounts, linkedAccountId]);

  // When switching to LIVE with an eligible merchant, bind their settlement account
  useEffect(() => {
    if (environment === "LIVE" && merchantStatus?.settlementAccountNumber) {
      setLinkedAccountId(merchantStatus.settlementAccountNumber);
    }
  }, [environment, merchantStatus]);

  const handleScopeToggle = (scopeId: string, checked: boolean) => {
    setSelectedScopes((prev) =>
      checked ? [...prev, scopeId] : prev.filter((s) => s !== scopeId)
    );
  };

  const isLive = environment === "LIVE";
  const isGenerating = isGeneratingProp || isSubmittingInternal;

  const targetAccountId =
    linkedAccountId ||
    merchantStatus?.settlementAccountNumber ||
    accounts?.[0]?.accountNumber ||
    "";

  // ── Unified Submit Handler ──────────────────────────────────────────────────
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    setFormError(null);

    // Validation: Key Name is required
    if (!name.trim()) {
      setFormError("Key Name is required.");
      return;
    }

    // Optional email validation if provided
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setFormError("Please enter a valid Contact Email Address.");
        return;
      }
    }

    // Optional CIDR validation
    const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    if (ipWhitelist.trim() && ipWhitelist.trim() !== "0.0.0.0/0") {
      const validCidr = ipWhitelist.split(",").every((p) => cidrRegex.test(p.trim()));
      if (!validCidr) {
        setFormError("Invalid CIDR format. Use notation like 192.168.1.0/24 or comma-separated IPs.");
        return;
      }
    }

    // If Live Production and user enters commercial profile data (legalName & BRN) while not yet eligible
    if (isLive && !merchantStatus?.eligibleForLive && legalName.trim() && businessRegistrationNumber.trim()) {
      setIsSubmittingInternal(true);
      try {
        const response = await merchantService.onboardDeveloper({
          legalName: legalName.trim(),
          businessRegistrationNumber: businessRegistrationNumber.trim(),
          merchantCode: merchantCode.trim() || undefined,
          email: email.trim() || "developer@company.com",
          environment: "LIVE",
          cidrWhitelist: ipWhitelist.trim() || "0.0.0.0/0",
          scopes: selectedScopes,
          onboardingType: "MERCHANT",
        });

        if (onMerchantStatusUpdate) {
          onMerchantStatusUpdate({
            hasMerchantProfile: true,
            verified: true,
            legalName: legalName.trim(),
            businessRegistrationNumber: businessRegistrationNumber.trim(),
            settlementAccountNumber: response.settlementAccountNumber,
            status: "ACTIVE",
            eligibleForLive: true,
          });
        }

        if (onSuccessDirect) {
          onSuccessDirect({
            name: name.trim(),
            rawKey: response.apiKey,
            environment: "LIVE",
            linkedAccountId: response.settlementAccountNumber,
            scopes: selectedScopes,
          });
          return;
        }
      } catch (err: any) {
        setFormError(err?.message || "Failed to register commercial profile and issue credential.");
        setIsSubmittingInternal(false);
        return;
      } finally {
        setIsSubmittingInternal(false);
      }
    }

    // Standard credential generation path via Inbound Port / handleCreateKey
    onSubmit({
      name: name.trim(),
      applicationId: applicationId.trim() || undefined,
      environment,
      linkedAccountId: targetAccountId,
      ipWhitelist: ipWhitelist.trim() || "0.0.0.0/0",
      selectedScopes,
      perTxLimit: perTxLimit.trim() || undefined,
      dailyLimit: dailyLimit.trim() || undefined,
    });
  };

  return (
    <div
      role="region"
      aria-label="API Credential Creation Form"
      className="p-5 sm:p-6 bg-dominant border border-secondary/40 rounded-2xl shadow-sm flex flex-col gap-6 animate-in fade-in duration-200"
    >
      {/* ── Form Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-secondary/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-accent">
              Issue New Credential Security Policy
            </h4>
            <p className="text-xs text-accent/60">
              Define access boundaries, action limits, and cryptographic parameters.
            </p>
          </div>
        </div>
      </div>

      {/* ── Error Banner ─────────────────────────────────────────────────────── */}
      {formError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* ── 1. Environment Selection ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-accent uppercase tracking-wider">
          Environment
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setEnvironment("SANDBOX")}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              environment === "SANDBOX"
                ? "border-sky-500 bg-sky-50/50 shadow-sm ring-1 ring-sky-500"
                : "border-secondary/30 bg-surface hover:bg-secondary/10"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                environment === "SANDBOX"
                  ? "border-sky-600 bg-sky-600"
                  : "border-secondary"
              }`}
            >
              {environment === "SANDBOX" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <div>
              <div className="text-xs font-extrabold text-accent">
                Sandbox Environment
              </div>
              <p className="text-[11px] text-accent/60 mt-0.5">
                For development and testing. 365-day rotation cycle.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setEnvironment("LIVE")}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              environment === "LIVE"
                ? "border-sky-500 bg-sky-50/50 shadow-sm ring-1 ring-sky-500"
                : "border-secondary/30 bg-surface hover:bg-secondary/10"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                environment === "LIVE"
                  ? "border-sky-600 bg-sky-600"
                  : "border-secondary"
              }`}
            >
              {environment === "LIVE" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-accent">
                  Live Production
                </span>
                <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-accent/60 mt-0.5">
                Production-ready API access with 90-day strict rotation.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ── 2. Commercial Profile & Workspace Specification ─────────────────── */}
      <div className="p-4 sm:p-5 bg-surface rounded-xl border border-secondary/30 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-secondary/20 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-600" />
            <h5 className="text-xs font-extrabold text-accent uppercase tracking-wider">
              {isLive ? "Commercial Profile (Required for Live)" : "Workspace & Profile Details"}
            </h5>
          </div>
          {merchantStatus?.eligibleForLive && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Merchant
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Legal Business Name */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor={legalNameId} className="text-xs font-bold text-accent uppercase tracking-wider">
                Legal Business Name
                {isLive && <span className="text-rose-600 font-bold ml-1">*</span>}
              </label>
              <span className="text-[10px] font-semibold text-accent/50">
                {isLive ? "Required" : "Optional"}
              </span>
            </div>
            <input
              id={legalNameId}
              type="text"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              placeholder="e.g. Acme Financial Technologies Inc."
              className="px-3.5 py-2.5 bg-dominant border border-secondary/40 rounded-xl text-accent font-medium text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <p id={legalNameHelpId} className="text-[10px] text-accent/60">
              Official entity name as recorded on government tax filings.
            </p>
          </div>

          {/* Business Registration Number */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor={brnId} className="text-xs font-bold text-accent uppercase tracking-wider">
                Business Registration Number (BRN / BIR TIN)
                {isLive && <span className="text-rose-600 font-bold ml-1">*</span>}
              </label>
              <span className="text-[10px] font-semibold text-accent/50">
                {isLive ? "Required for Merchants" : "Optional"}
              </span>
            </div>
            <input
              id={brnId}
              type="text"
              value={businessRegistrationNumber}
              onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
              placeholder="e.g. 000-123-456-000 or BRN-2026-987654"
              className="px-3.5 py-2.5 bg-dominant border border-secondary/40 rounded-xl text-accent font-medium text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <p id={brnHelpId} className="text-[10px] text-accent/60">
              Government-issued BIR TIN, SEC registration, or DTI certificate.
            </p>
          </div>

          {/* Contact Email Address */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor={emailId} className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                Contact Email Address
              </label>
              <span className="text-[10px] font-semibold text-accent/50">
                {isLive ? "Required" : "Optional"}
              </span>
            </div>
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. developer@company.com"
              className="px-3.5 py-2.5 bg-dominant border border-secondary/40 rounded-xl text-accent font-medium text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <p id={emailHelpId} className="text-[10px] text-accent/60">
              Primary contact for API notifications, webhooks, and audit logs.
            </p>
          </div>

          {/* Preferred Routing Code */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor={merchantCodeId} className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-sky-600" />
                Preferred Routing Code
              </label>
              <span className="text-[10px] font-semibold text-accent/50">Optional</span>
            </div>
            <input
              id={merchantCodeId}
              type="text"
              value={merchantCode}
              onChange={(e) => setMerchantCode(e.target.value.toUpperCase())}
              placeholder="e.g. M-ACME"
              className="px-3.5 py-2.5 bg-dominant border border-secondary/40 rounded-xl text-accent font-mono text-sm uppercase outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <p id={merchantCodeHelpId} className="text-[10px] text-accent/60">
              Routing prefix for internal transactions. Auto-generated if empty.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. Application Details ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-accent uppercase tracking-wider">
          Application Details
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={keyNameId} className="text-xs font-bold text-accent uppercase tracking-wider">
              Key Name <span className="text-rose-600 font-bold">*</span>
            </label>
            <input
              id={keyNameId}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ERP System Key or Mobile Checkout Client"
              className="px-3.5 py-2.5 bg-dominant border border-secondary/40 rounded-xl text-accent font-bold text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
            <span className="text-[10px] text-accent/60">
              Identifies which external service or application holds this key.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={appIdId} className="text-xs font-bold text-accent uppercase tracking-wider">
              Application ID <span className="text-accent/40 font-normal">(Optional)</span>
            </label>
            <input
              id={appIdId}
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="e.g. client-payment-svc-01"
              className="px-3.5 py-2.5 bg-dominant border border-secondary/40 rounded-xl text-accent font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none"
            />
            <span className="text-[10px] text-accent/60">
              Distributed tracing slug attached to Open Finance audit logs.
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. Account Scope ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={accountScopeId} className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5" />
          API Credential Account Scope (Required)
        </label>
        <p className="text-[10px] text-accent/60 mb-1 leading-tight">
          This API credential can access only the selected VAM sub-account, subject to your account permissions.
        </p>
        <select
          id={accountScopeId}
          value={linkedAccountId}
          onChange={(e) => setLinkedAccountId(e.target.value)}
          className="px-3.5 py-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-bold text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          {(!accounts || accounts.length === 0) && (
            <option value="">No Accounts Available (Will be auto-provisioned)</option>
          )}
          {accounts?.map((acc) => (
            <option key={acc.accountNumber} value={acc.accountNumber}>
              {acc.accountNumber} {acc.accountName ? `(${acc.accountName})` : ""} (**** {acc.accountNumber.slice(-4)}) — {acc.currency || "PHP"}
            </option>
          ))}
        </select>
      </div>

      {/* ── 5. Granted Scopes Grid ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-t border-secondary/20 pt-4">
        <div className="flex items-center justify-between border-b border-secondary/30 pb-2">
          <label className="text-xs font-bold text-accent uppercase tracking-wider">Granted Scopes</label>
          <span className="text-[10px] text-accent/60 font-bold bg-secondary/10 px-2 py-0.5 rounded">Action Limits</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SCOPE_GROUPS.map((group) => (
            <div key={group.domain} className="bg-dominant p-3 rounded-lg border border-secondary/30 flex flex-col gap-2">
              <span className="text-[11px] font-extrabold text-sky-700 tracking-wide">{group.domain}</span>
              <div className="flex flex-col gap-2">
                {group.scopes.map((scope) => (
                  <label key={scope.id} className="flex items-center gap-2 text-xs font-bold text-accent cursor-pointer ml-1">
                    <input
                      type="checkbox"
                      checked={selectedScopes.includes(scope.id)}
                      onChange={(e) => handleScopeToggle(scope.id, e.target.checked)}
                      className="rounded border-secondary w-4 h-4 text-sky-600 focus:ring-sky-500"
                    />
                    <span>{scope.label}</span>
                    <span className="text-[9px] text-accent/40 font-mono">({scope.id})</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. Advanced Security Controls (Optional Collapsible) ───────────── */}
      <div className="border border-secondary/30 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-4 py-3 bg-surface hover:bg-secondary/10 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-extrabold text-accent uppercase tracking-wider">
              Advanced Security Controls
            </span>
            <span className="text-[10px] font-bold text-accent/40 bg-secondary/10 px-2 py-0.5 rounded">
              Optional
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-accent/50 transition-transform duration-200 ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>

        {showAdvanced && (
          <div className="p-4 bg-dominant border-t border-secondary/20 flex flex-col gap-4 animate-in fade-in duration-150">
            {/* IP Whitelist */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-accent uppercase tracking-wider">
                IP Whitelist (CIDR notation)
              </label>
              <p className="text-[10px] text-accent/60 mb-1 leading-tight">
                Limit API calls to originating from these specific IPv4 addresses.
              </p>
              <input
                type="text"
                placeholder="0.0.0.0/0 (Default: Allow All)"
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                className="px-3.5 py-2.5 bg-surface border border-secondary/40 rounded-xl font-mono text-sm text-accent focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            {/* Transaction Velocity Limits */}
            <div className="flex flex-col gap-2 border-t border-secondary/20 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-sky-600" />
                  Transaction Velocity Limits (PHP)
                </label>
                <span className="text-[10px] font-bold text-accent/50 bg-secondary/10 px-2 py-0.5 rounded">
                  Defense in Depth
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-accent/70">Per-Transaction Maximum</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 50000.00 (Optional)"
                    value={perTxLimit}
                    onChange={(e) => setPerTxLimit(e.target.value)}
                    className="px-3 py-2 bg-surface border border-secondary/40 rounded-lg text-accent text-sm font-mono"
                  />
                  <span className="text-[10px] text-accent/50">Rejects any single request exceeding this value.</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-accent/70">Daily Aggregate Volume</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 500000.00 (Optional)"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="px-3 py-2 bg-surface border border-secondary/40 rounded-lg text-accent text-sm font-mono"
                  />
                  <span className="text-[10px] text-accent/50">Automated kill-switch triggers once 24h volume is hit.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 7. Policy Review Summary ───────────────────────────────────────── */}
      <div className="p-3.5 bg-dominant border border-secondary/30 rounded-xl flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <ClipboardList className="w-4 h-4 text-sky-600 shrink-0" />
          <span className="font-bold text-accent">Policy Summary:</span>
          <span className="font-mono text-accent/80">
            {environment} · {name ? `"${name}"` : "Untitled"} · {linkedAccountId ? `Scope: ****${linkedAccountId.slice(-4)}` : "Auto-scoping"} · {selectedScopes.length} scopes
          </span>
        </div>
      </div>

      {/* ── 8. Form Footer Action Buttons ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-secondary/20">
        <div className="text-xs text-accent/60 font-medium">
          TTL Policy: {environment === "LIVE" ? "90-day rotation required" : "365-day developer sandbox life"}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            isLoading={isGenerating}
            className="min-h-[42px]"
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyCreateForm;
