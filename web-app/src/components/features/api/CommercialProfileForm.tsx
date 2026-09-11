"use client";

import React, { useState, useId } from "react";
import {
  Building2,
  FileText,
  Mail,
  Hash,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { merchantService } from "@/services/gateway/merchantService";
import { OnboardingSuccessData } from "./types";

export interface CommercialProfileFormProps {
  mode?: "LIVE" | "SANDBOX";
  initialType?: "DEVELOPER" | "MERCHANT";
  initialEnvironment?: "LIVE" | "SANDBOX";
  onSuccess?: (data: OnboardingSuccessData) => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

/**
 * CommercialProfileForm
 *
 * Captures commercial identity or developer workspace profile:
 *  - Legal Business Name
 *  - Business Registration Number (BRN / BIR TIN)
 *  - Contact Email Address
 *  - Preferred Routing Code (Optional)
 *
 * Replaces the redundant modal with an inline form that provisions the commercial
 * profile / settlement account without duplicating credential policies (scopes, CIDR).
 */
export const CommercialProfileForm: React.FC<CommercialProfileFormProps> = ({
  mode,
  initialType,
  initialEnvironment,
  onSuccess,
  onCancel,
  showCancelButton = false,
}) => {
  const isLive = (mode ?? initialEnvironment ?? (initialType === "MERCHANT" ? "LIVE" : "SANDBOX")) === "LIVE";
  const onboardingType = isLive ? "MERCHANT" : (initialType ?? "DEVELOPER");

  const legalNameId = useId();
  const legalNameHelpId = useId();
  const brnId = useId();
  const brnHelpId = useId();
  const emailId = useId();
  const emailHelpId = useId();
  const merchantCodeId = useId();
  const merchantCodeHelpId = useId();

  const [legalName, setLegalName] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [merchantCode, setMerchantCode] = useState("");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{ title: string; detail: string; action: string } | null>(null);
  const [successData, setSuccessData] = useState<OnboardingSuccessData | null>(null);

  const getLegalNameError = (): string | null => {
    if (!legalName.trim()) {
      return isLive
        ? "Legal Business Name is required for commercial registration."
        : "Legal Business Name / Workspace Name is required.";
    }
    if (legalName.trim().length < 2) return "Name must be at least 2 characters long.";
    return null;
  };

  const getBrnError = (): string | null => {
    if (!businessRegistrationNumber.trim()) {
      if (isLive) {
        return "Business Registration Number (BRN / BIR TIN) is required for commercial registration.";
      }
      return null;
    }
    if (businessRegistrationNumber.trim().length < 3) return "BRN must be at least 3 characters long.";
    return null;
  };

  const getEmailError = (): string | null => {
    if (!email.trim()) return "Contact Email Address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address (e.g. developer@company.com).";
    }
    return null;
  };

  const isLegalNameInvalid = touched.legalName && !!getLegalNameError();
  const isBrnInvalid = touched.brn && !!getBrnError();
  const isEmailInvalid = touched.email && !!getEmailError();

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ legalName: true, brn: true, email: true });

    if (getLegalNameError() || getBrnError() || getEmailError()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const generatedCode = merchantCode.trim() || `M-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const response = await merchantService.onboardDeveloper({
        legalName: legalName.trim(),
        businessRegistrationNumber: businessRegistrationNumber.trim() || undefined,
        merchantCode: generatedCode,
        email: email.trim(),
        environment: isLive ? "LIVE" : "SANDBOX",
        onboardingType,
      });

      const result: OnboardingSuccessData = {
        merchantId: response.merchantId,
        settlementAccountNumber: response.settlementAccountNumber,
        apiKey: response.apiKey,
        merchantCode: generatedCode,
        environment: isLive ? "LIVE" : "SANDBOX",
        cidrWhitelist: "0.0.0.0/0",
        scopes: ["payments:write", "payments:read", "accounts:read", "accounts:write", "treasury:read", "treasury:write"],
        onboardingType,
        legalName: legalName.trim(),
        businessRegistrationNumber: businessRegistrationNumber.trim() || undefined,
      };

      setSuccessData(result);
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err: any) {
      setError({
        title: "Onboarding Provisioning Error",
        detail: err?.message || "An unexpected error occurred during profile registration.",
        action: "Please verify your input details and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex flex-col gap-3 animate-in fade-in duration-200">
        <div className="flex items-center gap-2.5 text-emerald-900 font-extrabold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Profile Registered Successfully!</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-emerald-200 flex flex-col gap-1">
          <span className="text-xs font-bold text-accent/70 uppercase tracking-wider">
            System-Provisioned Settlement Account No.
          </span>
          <code className="text-lg font-black text-emerald-800 font-mono tracking-tight">
            {successData.settlementAccountNumber}
          </code>
          <span className="text-[11px] text-accent/60">
            Bound to entity <strong>{successData.legalName}</strong> for settlement and VAM scoping.
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 text-xs text-rose-900">
            <span className="font-extrabold">{error.title}</span>
            <p className="text-rose-800">{error.detail}</p>
          </div>
        </div>
      )}

      {/* Legal Business Name */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={legalNameId}
            className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            {isLive ? "Legal Business Name" : "Legal Business Name / Workspace Name"}
            <span className="text-rose-600 font-bold">*</span>
          </label>
          <span className="text-[10px] font-semibold text-accent/50">Required</span>
        </div>
        <input
          id={legalNameId}
          type="text"
          value={legalName}
          onChange={(e) => setLegalName(e.target.value)}
          onBlur={() => handleBlur("legalName")}
          placeholder="e.g. Acme Financial Technologies Inc."
          className={`px-3.5 py-2.5 bg-surface border rounded-xl text-accent font-medium text-sm transition-all outline-none ${
            isLegalNameInvalid
              ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
              : "border-secondary/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          }`}
          aria-describedby={legalNameHelpId}
          aria-invalid={isLegalNameInvalid}
        />
        <p id={legalNameHelpId} className="text-[10px] text-accent/60">
          Official entity name as recorded on government tax filings and incorporation certificates.
        </p>
        {isLegalNameInvalid && (
          <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getLegalNameError()}
          </p>
        )}
      </div>

      {/* Business Registration Number (BRN / BIR TIN) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={brnId}
            className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            Business Registration Number (BRN / BIR TIN)
            {isLive && <span className="text-rose-600 font-bold">*</span>}
          </label>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
            isLive ? "text-rose-700 bg-rose-50 font-bold" : "text-accent/50 bg-secondary/10"
          }`}>
            {isLive ? "Required for Merchants" : "Optional"}
          </span>
        </div>
        <input
          id={brnId}
          type="text"
          value={businessRegistrationNumber}
          onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
          onBlur={() => handleBlur("brn")}
          placeholder="e.g. 000-123-456-000 or BRN-2026-987654"
          className={`px-3.5 py-2.5 bg-surface border rounded-xl text-accent font-medium text-sm transition-all outline-none ${
            isBrnInvalid
              ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
              : "border-secondary/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          }`}
          aria-describedby={brnHelpId}
          aria-invalid={isBrnInvalid}
        />
        <p id={brnHelpId} className="text-[10px] text-accent/60">
          Government-issued BIR TIN, SEC registration, or DTI business certificate number.
        </p>
        {isBrnInvalid && (
          <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getBrnError()}
          </p>
        )}
      </div>

      {/* Contact Email Address */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={emailId}
            className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-sky-600" />
            Contact Email Address
            <span className="text-rose-600 font-bold">*</span>
          </label>
          <span className="text-[10px] font-semibold text-accent/50">Required</span>
        </div>
        <input
          id={emailId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur("email")}
          placeholder="e.g. developer@company.com"
          className={`px-3.5 py-2.5 bg-surface border rounded-xl text-accent font-medium text-sm transition-all outline-none ${
            isEmailInvalid
              ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
              : "border-secondary/40 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          }`}
          aria-describedby={emailHelpId}
          aria-invalid={isEmailInvalid}
        />
        <p id={emailHelpId} className="text-[10px] text-accent/60">
          Primary point of contact for API notifications, webhooks, and gateway audit logs.
        </p>
        {isEmailInvalid && (
          <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getEmailError()}
          </p>
        )}
      </div>

      {/* Preferred Routing Code (Optional) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={merchantCodeId}
            className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5"
          >
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
          className="px-3.5 py-2.5 bg-surface border border-secondary/40 rounded-xl text-accent font-mono text-sm uppercase focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
          aria-describedby={merchantCodeHelpId}
        />
        <p id={merchantCodeHelpId} className="text-[10px] text-accent/60">
          Routing prefix for internal transactions. Auto-generated if left empty.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-2">
        {showCancelButton && onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} className="text-xs">
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isSubmitting}
          className={`text-xs font-extrabold min-h-[40px] ${
            isLive ? "bg-amber-600 hover:bg-amber-700 text-white" : ""
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Initializing...
            </>
          ) : (
            "Initialize Merchant Workspace"
          )}
        </Button>
      </div>
    </form>
  );
};

// Aliases for backward-compatibility with tests and page imports
export { CommercialProfileForm as MerchantOnboardingForm, CommercialProfileForm as DeveloperOnboardPage, CommercialProfileForm as OnboardingPage };
export default CommercialProfileForm;

