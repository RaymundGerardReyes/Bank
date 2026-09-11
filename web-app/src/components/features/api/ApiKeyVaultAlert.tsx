"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  Server,
} from "lucide-react";
import { NewlyGeneratedKeyData } from "./types";

export interface ApiKeyVaultAlertProps {
  newlyGeneratedKey: NewlyGeneratedKeyData;
  onDismiss: () => void;
}

/**
 * ApiKeyVaultAlert — One-time cryptographic secret display modal/alert.
 *
 * Styled consistently with the application's clean enterprise light design system
 * using semantic tokens (dominant, surface, secondary, accent, emerald).
 */
export const ApiKeyVaultAlert: React.FC<ApiKeyVaultAlertProps> = ({
  newlyGeneratedKey,
  onDismiss,
}) => {
  const [copiedState, setCopiedState] = useState(false);
  const [showRawSecret, setShowRawSecret] = useState(true);

  const handleCopyNewKey = (rawKey: string) => {
    navigator.clipboard.writeText(rawKey);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2500);
  };

  return (
    <div className="mb-8 p-6 sm:p-7 bg-dominant border-2 border-emerald-500/40 rounded-2xl shadow-md animate-in zoom-in-95 duration-300 flex flex-col gap-5">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center shrink-0 shadow-sm">
            <KeyRound className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h4 className="text-accent font-black text-xl tracking-tight">
                Key Generated Successfully
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  newlyGeneratedKey.environment === "LIVE"
                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                    : "bg-sky-100 text-sky-800 border border-sky-300"
                }`}
              >
                {newlyGeneratedKey.environment}
              </span>
            </div>
            <p className="text-xs text-accent/70 font-medium mt-0.5">
              Identity Policy:{" "}
              <strong className="text-accent font-bold">{newlyGeneratedKey.name}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ── Crucial Security Notice ─────────────────────────────────────────── */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-950 font-medium">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="font-extrabold text-amber-950">Crucial Security Notice:</strong> Store this API secret in your
          vault now. For zero-trust cryptographic safety, we never store
          plain-text keys in our database and{" "}
          <strong className="font-extrabold text-amber-950">this value cannot be displayed again</strong>.
        </span>
      </div>

      {/* ── Bound Account Scope ─────────────────────────────────────────────── */}
      {newlyGeneratedKey.linkedAccountId && (
        <div className="flex items-center gap-2 text-xs text-emerald-900 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
          <Server className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="font-medium">Bound VAM Account Scope:</span>
          <code className="font-mono font-extrabold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
            {newlyGeneratedKey.linkedAccountId}
          </code>
        </div>
      )}

      {/* ── Granted Permission Scopes ───────────────────────────────────────── */}
      {newlyGeneratedKey.scopes && newlyGeneratedKey.scopes.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-accent/60 uppercase tracking-wider">
            Granted Permission Scopes:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {newlyGeneratedKey.scopes.map((scope) => (
              <span
                key={scope}
                className="px-2.5 py-1 bg-surface text-accent font-mono text-xs font-bold rounded-lg border border-secondary/30"
              >
                {scope}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Raw Secret Key Box ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-surface p-4 rounded-xl border border-secondary/40 shadow-inner">
        <code className="font-mono text-sm sm:text-base font-bold text-accent flex-1 break-all select-all tracking-wide selection:bg-emerald-200">
          {showRawSecret
            ? newlyGeneratedKey.rawKey
            : "••••••••••••••••••••••••••••••••••••••••••••••••"}
        </code>

        <div className="flex items-center gap-2 shrink-0 justify-end">
          <button
            type="button"
            onClick={() => setShowRawSecret(!showRawSecret)}
            className="px-3.5 py-2 bg-dominant hover:bg-secondary/15 text-accent border border-secondary/40 rounded-xl text-xs font-bold transition-all focus:ring-2 focus:ring-sky-500 focus:outline-none flex items-center gap-1.5 min-h-[40px] shadow-sm"
          >
            {showRawSecret ? (
              <EyeOff className="w-3.5 h-3.5 text-accent/70" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-accent/70" />
            )}
            {showRawSecret ? "Hide" : "Show"}
          </button>

          <Button
            onClick={() => handleCopyNewKey(newlyGeneratedKey.rawKey)}
            className={`min-h-[40px] text-xs font-bold ${
              copiedState
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                : "bg-accent hover:bg-accent/90 text-white border-transparent"
            }`}
          >
            {copiedState ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copiedState ? "Copied to Clipboard!" : "Copy Key"}
          </Button>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-secondary/20">
        <span className="text-[11px] text-accent/60 font-medium">
          Use header{" "}
          <code className="text-accent font-mono font-bold bg-surface px-1.5 py-0.5 rounded border border-secondary/30">
            X-API-Key: {newlyGeneratedKey.rawKey.slice(0, 8)}...
          </code>{" "}
          for authenticated core banking calls.
        </span>
        <Button
          onClick={onDismiss}
          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold min-h-[40px] shadow-sm"
        >
          I have saved this key
        </Button>
      </div>
    </div>
  );
};

export default ApiKeyVaultAlert;
