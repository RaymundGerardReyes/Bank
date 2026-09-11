"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import {
  KeyRound,
  RefreshCw,
  Trash2,
  Server,
} from "lucide-react";
import { ApiKey } from "./types";

export interface ApiKeyCardProps {
  apiKey: ApiKey;
  isGenerating: boolean;
  onRotate: (id: number) => void;
  onRevoke: (id: number) => void;
  onDelete: (id: number) => void;
}

export const getExpiryStatus = (expiresAtStr: string, revokedAt?: string | null) => {
  if (revokedAt) return { label: "REVOKED", style: "bg-rose-100 text-rose-700 border-rose-200" };
  const diffDays = Math.ceil((new Date(expiresAtStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return { label: "EXPIRED", style: "bg-rose-100 text-rose-700 border-rose-200" };
  if (diffDays <= 14) return { label: `EXPIRES IN ${diffDays}D`, style: "bg-amber-100 text-amber-700 border-amber-200" };
  return { label: `ACTIVE (${diffDays}D)`, style: "bg-emerald-100 text-emerald-700 border-emerald-200" };
};

export const ApiKeyCard: React.FC<ApiKeyCardProps> = ({
  apiKey,
  isGenerating,
  onRotate,
  onRevoke,
  onDelete,
}) => {
  const status = getExpiryStatus(apiKey.expiresAt, apiKey.revokedAt);
  const isRevoked = !!apiKey.revokedAt;

  return (
    <div
      className={`flex flex-col lg:flex-row lg:items-center justify-between p-5 bg-dominant border rounded-2xl gap-4 transition-all shadow-sm ${
        isRevoked
          ? "border-rose-100 opacity-60 grayscale bg-rose-50/20"
          : "border-secondary/40 hover:border-secondary/80"
      }`}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <h5 className="font-extrabold text-accent text-base sm:text-lg tracking-tight">
            {apiKey.name}
          </h5>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${
              apiKey.environment === "LIVE"
                ? "bg-rose-100 text-rose-700 border border-rose-200"
                : "bg-sky-100 text-sky-700 border border-sky-200"
            }`}
          >
            {apiKey.environment}
          </span>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${status.style}`}
          >
            {status.label}
          </span>

          {apiKey.linkedAccountId && (
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <Server className="w-3 h-3 text-emerald-700" />
              Account Scope: ****{apiKey.linkedAccountId.slice(-4)}
            </span>
          )}

          {apiKey.cidrWhitelist && apiKey.cidrWhitelist !== "0.0.0.0/0" && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
              IP: {apiKey.cidrWhitelist}
            </span>
          )}

          {apiKey.perTransactionLimit && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Max: ₱{apiKey.perTransactionLimit.toLocaleString()} / tx
            </span>
          )}
        </div>

        {/* Key Masked Fingerprint */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
          <div className="font-mono text-xs sm:text-sm font-bold text-accent/80 bg-surface px-3 py-1.5 rounded-lg border border-secondary/30 inline-flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-accent/40" />
            <span>
              {apiKey.keyPrefix}
              {apiKey.maskedHash}
            </span>
          </div>
          <span className="text-[10px] text-accent/50 font-medium">
            (Fingerprint only — secret key was only revealed once upon creation)
          </span>
        </div>

        {/* Granted Scopes Badges */}
        {apiKey.scopes && apiKey.scopes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {apiKey.scopes.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 bg-surface text-accent/70 font-mono text-[10px] font-semibold rounded border border-secondary/30"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-6 text-[11px] font-bold text-accent/50">
          <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
          <span>
            Last Used:{" "}
            {apiKey.lastUsedAt
              ? new Date(apiKey.lastUsedAt).toLocaleDateString()
              : "Never"}
          </span>
          {apiKey.applicationName && <span>App: {apiKey.applicationName}</span>}
        </div>
      </div>

      <div className="flex items-center lg:flex-col gap-2 shrink-0 justify-end">
        {!isRevoked ? (
          <>
            <Button
              variant="secondary"
              onClick={() => onRotate(apiKey.id)}
              disabled={isGenerating}
              className="text-xs"
            >
              <RefreshCw className="w-3 h-3 text-sky-600" />
              Rotate Key
            </Button>
            <Button
              variant="danger"
              onClick={() => onRevoke(apiKey.id)}
              disabled={isGenerating}
              className="text-xs"
            >
              Revoke
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            onClick={() => onDelete(apiKey.id)}
            className="text-xs text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default ApiKeyCard;

