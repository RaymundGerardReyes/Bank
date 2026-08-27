"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { accountService } from "@/services/account/accountService";
import { Account, UpdateAccountSettingsPayload } from "@/models/ApiResponse";
import { Card } from "@/components/ui/Card";
import {
  ShieldAlert,
  ArrowDownToLine,
  ArrowUpRight,
  Lock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function AccountDetailPage() {
  const params = useParams();
  const accountId = params?.accountId as string;

  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAccount = async () => {
    if (!accountId) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // First try fetching by account ID or account number
      const res = await accountService.getAccountById(accountId);
      if (res.data) {
        setAccount(res.data);
      } else {
        // Fallback: look up in list
        const listRes = await accountService.getAccounts();
        const found = listRes.data?.find(
          (acc) => acc.accountNumber === accountId || String(acc.id) === accountId
        );
        if (found) {
          setAccount(found);
        } else {
          setErrorMessage("Account not found.");
        }
      }
    } catch (err: any) {
      // If single account fetch fails, attempt list lookup
      try {
        const listRes = await accountService.getAccounts();
        const found = listRes.data?.find(
          (acc) => acc.accountNumber === accountId || String(acc.id) === accountId
        );
        if (found) {
          setAccount(found);
        } else {
          setErrorMessage(err.message || "Failed to load account details.");
        }
      } catch (listErr: any) {
        setErrorMessage(err.message || "Failed to load account details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [accountId]);

  const handleToggle = async (
    field: keyof UpdateAccountSettingsPayload,
    currentValue: boolean
  ) => {
    if (!account) return;
    setIsUpdating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const newValue = !currentValue;
    const payload: UpdateAccountSettingsPayload = { [field]: newValue };

    // Optimistic UI update
    setAccount((prev) => (prev ? { ...prev, [field]: newValue } : null));

    try {
      const res = await accountService.updateAccountSettings(
        account.accountNumber,
        payload
      );
      if (res.data) {
        setAccount(res.data);
        setSuccessMessage(`Account settings updated successfully.`);
      }
    } catch (err: any) {
      // Revert optimistic update
      setAccount((prev) => (prev ? { ...prev, [field]: currentValue } : null));
      setErrorMessage(err.message || "Failed to update account settings.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading account details...</p>
      </div>
    );
  }

  if (errorMessage && !account) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold text-red-200">{errorMessage}</h2>
          <button
            onClick={fetchAccount}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-sm transition"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!account) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <span className="inline-block px-2.5 py-1 text-xs font-semibold tracking-wider text-indigo-700 bg-indigo-50 rounded-md border border-indigo-200 mb-2">
            ACCOUNT GOVERNANCE
          </span>
          <h1 className="text-2xl font-black text-slate-900">
            {account.accountName || `Account #${account.accountNumber}`}
          </h1>
          <p className="text-sm text-slate-500 font-mono mt-1">{account.accountNumber}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Live Balance</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {account.currency} {Number(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
              account.frozen
                ? "bg-red-50 text-red-600 border border-red-200"
                : account.status === "ACTIVE"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-amber-50 text-amber-600 border border-amber-200"
            }`}
          >
            {account.frozen ? "FROZEN" : account.status}
          </span>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Controller & Governance Settings Section */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              Governance & Controller Settings
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage security controls, liquidity permissions, and transfer policy restrictions.
            </p>
          </div>
          {isUpdating && (
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold">
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </div>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          <ToggleRow
            title="Account Freeze State (Lockdown)"
            description="Completely freeze this account. Strictly blocks all inbound and outbound transaction activity."
            icon={<Lock className="w-5 h-5 text-rose-600" />}
            isActive={Boolean(account.frozen)}
            isPending={isUpdating}
            onToggle={() => handleToggle("frozen", Boolean(account.frozen))}
          />
          <ToggleRow
            title="Allow Incoming Transfers"
            description="Permit deposits, internal transfers, and incoming payments to credit this account."
            icon={<ArrowDownToLine className="w-5 h-5 text-emerald-600" />}
            isActive={account.allowIncoming ?? true}
            isPending={isUpdating}
            onToggle={() => handleToggle("allowIncoming", account.allowIncoming ?? true)}
          />
          <ToggleRow
            title="Allow Outgoing Transfers"
            description="Permit withdrawals, wire payments, and outbound transfers to debit this account."
            icon={<ArrowUpRight className="w-5 h-5 text-amber-600" />}
            isActive={account.allowOutgoing ?? true}
            isPending={isUpdating}
            onToggle={() => handleToggle("allowOutgoing", account.allowOutgoing ?? true)}
          />
          <ToggleRow
            title="Require Dual Approval"
            description="Enforce secondary authorization for any high-value transactions originating from this account."
            icon={<UserCheck className="w-5 h-5 text-indigo-600" />}
            isActive={Boolean(account.requireDualApproval)}
            isPending={isUpdating}
            onToggle={() => handleToggle("requireDualApproval", Boolean(account.requireDualApproval))}
          />
        </div>
      </section>
    </div>
  );
}

interface ToggleRowProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isPending: boolean;
  onToggle: () => void;
}

function ToggleRow({ title, description, icon, isActive, isPending, onToggle }: ToggleRowProps) {
  return (
    <div 
      className={`px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors ${isPending ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
      onClick={() => {
        if (!isPending) onToggle();
      }}
    >
      <div className="flex items-start gap-4 pr-6">
        <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm mt-0.5">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-sm">{title}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>

      <button
        type="button"
        disabled={isPending}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white
          ${isActive ? "bg-indigo-600" : "bg-slate-300"}
          ${isPending ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span className="sr-only">Toggle {title}</span>
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${isActive ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}
