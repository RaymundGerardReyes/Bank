"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useAccounts } from "@/hooks/useAccounts";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export interface ApiKey {
  id: number;
  name: string;
  environment: "LIVE" | "SANDBOX";
  keyPrefix: string;
  maskedHash: string;
  rawKey?: string | null;
  cidrWhitelist: string;
  scopes: string[];
  linkedAccountId?: string | null;
  expiresAt: string;
  revokedAt?: string | null;
  lastUsedAt?: string | null;
  createdAt: string;
}

// Grouped and perfectly aligned with the Backend Filter
const SCOPE_GROUPS = [
  {
    domain: "VAM & Accounts",
    scopes: [{ id: "accounts:read", label: "Read" }, { id: "accounts:write", label: "Write" }]
  },
  {
    domain: "Treasury Transfers",
    scopes: [{ id: "treasury:read", label: "Read" }, { id: "treasury:write", label: "Write" }]
  },
  {
    domain: "Payroll Batch",
    scopes: [{ id: "payroll:read", label: "Read" }, { id: "payroll:write", label: "Write" }]
  },
  {
    domain: "Ledger Journal",
    scopes: [{ id: "ledger:read", label: "Read" }, { id: "ledger:write", label: "Write" }]
  },
  {
    domain: "Payment Intent",
    scopes: [{ id: "payments:write", label: "Write Only" }]
  },
  {
    domain: "Fraud Risk AI",
    scopes: [{ id: "risk:read", label: "Read" }, { id: "risk:write", label: "Write" }]
  }
];

export const ApiKeyManager: React.FC = () => {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<{ name: string; rawKey: string } | null>(null);
  const [copiedState, setCopiedState] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Form State
  const [newKeyName, setNewKeyName] = useState("");
  const [environment, setEnvironment] = useState<"LIVE" | "SANDBOX">("SANDBOX");
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["treasury:read", "treasury:write", "accounts:read"]);
  const [linkedAccountId, setLinkedAccountId] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (accounts && accounts.length > 0 && !linkedAccountId) {
      setLinkedAccountId(accounts[0].accountNumber);
    }
  }, [accounts, linkedAccountId]);

  const fetchKeys = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/proxy/apikeys");
      const json = await res.json();
      if (res.ok) {
        setKeys(json.data || []);
      } else {
        if (res.status === 404) {
          setNeedsOnboarding(true);
        } else {
          setErrorMsg(json.message || json.error?.message || "Failed to load API keys");
        }
      }
    } catch (err: any) {
      console.error("Failed to load API keys", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const validateCidr = (cidrStr: string): boolean => {
    if (!cidrStr || cidrStr.trim() === "" || cidrStr === "0.0.0.0/0") return true;
    const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    return cidrStr.split(",").every((p) => cidrRegex.test(p.trim()));
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!newKeyName.trim()) return setErrorMsg("Key name is required.");
    if (!linkedAccountId || linkedAccountId === "ALL") {
      return setErrorMsg("API Credential Account Scope selection is required. API Keys must be scoped to an eligible VAM sub-account.");
    }
    if (ipWhitelist.trim() && !validateCidr(ipWhitelist)) {
      return setErrorMsg("Invalid CIDR format. Use standard notation like 192.168.1.0/24.");
    }
    setIsGenerating(true);
    try {
      const payload = {
        name: newKeyName,
        environment,
        cidrWhitelist: ipWhitelist.trim() || "0.0.0.0/0",
        scopes: selectedScopes,
        linkedAccountId: linkedAccountId,
      };

      const res = await fetch("/api/proxy/apikeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error?.message || json.message || "Failed to generate Key");

      const createdKey: ApiKey = json.data;
      setKeys([createdKey, ...keys]);
      setNewlyGeneratedKey({ name: createdKey.name, rawKey: createdKey.rawKey || "" });
      setCopiedState(false);
      setNewKeyName("");
      setShowCreateForm(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Key generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRotateKey = async (id: number) => {
    const confirmRotate = window.confirm("Are you sure? This will instantly revoke the current key and generate a new one.");
    if (!confirmRotate) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/proxy/apikeys/${id}/rotate`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      const rotatedKey: ApiKey = json.data;
      setNewlyGeneratedKey({ name: rotatedKey.name, rawKey: rotatedKey.rawKey || "" });
      setCopiedState(false);
      await fetchKeys();
    } catch (err: any) {
      alert(err.message || "Failed to rotate key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const revokeKey = async (id: number) => {
    if (!window.confirm("Revoking this key will instantly block all traffic using it. Continue?")) return;
    try {
      await fetch(`/api/proxy/apikeys/${id}/revoke`, { method: "POST" });
      setKeys(keys.map((k: ApiKey) => (k.id === id ? { ...k, revokedAt: new Date().toISOString() } : k)));
    } catch (err) {
      alert("Failed to revoke key.");
    }
  };

  const handleCopyNewKey = (rawKey: string) => {
    navigator.clipboard.writeText(rawKey);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const getExpiryStatus = (expiresAtStr: string, revokedAt?: string | null) => {
    if (revokedAt) return { label: "REVOKED", style: "bg-rose-100 text-rose-700 border-rose-200" };
    const diffDays = Math.ceil((new Date(expiresAtStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return { label: "EXPIRED", style: "bg-rose-100 text-rose-700 border-rose-200" };
    if (diffDays <= 14) return { label: `EXPIRES IN ${diffDays}D`, style: "bg-amber-100 text-amber-700 border-amber-200" };
    return { label: `ACTIVE (${diffDays}D)`, style: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  };

  if (needsOnboarding) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center shadow-md">
              <Zap className="w-7 h-7 text-sky-600" />
            </div>
            <div className="flex flex-col gap-2 max-w-lg">
              <h3 className="text-3xl font-black text-accent tracking-tight">Activate Developer Portal</h3>
              <p className="text-accent/70 font-medium text-base sm:text-lg leading-relaxed">
                You must provision a Merchant Account to generate HMAC API Keys and access the Payment Orchestrator.
              </p>
            </div>
            <Link
              href="/api/onboard"
              className="mt-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-accent/20 focus:ring-2 focus:ring-sky-500 focus:outline-none min-h-[48px]"
            >
              <Zap className="w-5 h-5 text-sky-400" />
              Start Developer Onboarding
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-accent">API Keys & Security Controls</h3>
            <p className="text-sm text-accent/70 font-medium mt-1">
              Manage HMAC SHA256 keys for API access. Scope keys to specific eligible VAM sub-accounts.
            </p>
          </div>
          {!showCreateForm && !newlyGeneratedKey && (
            <Button onClick={() => setShowCreateForm(true)}>+ Create New Key</Button>
          )}
        </div>

        {errorMsg && <ErrorBanner message={errorMsg} onClose={() => setErrorMsg(null)} />}

        {newlyGeneratedKey && (
          <div className="mb-8 p-6 bg-emerald-50 border-2 border-emerald-500/40 rounded-xl shadow-lg shadow-emerald-500/10 animate-in zoom-in-95 duration-300">
            <h4 className="text-emerald-800 font-extrabold text-lg mb-2">Key Generated Successfully</h4>
            <p className="text-emerald-700/80 text-sm font-medium mb-4">
              Please copy this key immediately. For security reasons, <strong>you will not be able to see it again.</strong>
            </p>
            <div className="flex items-center gap-3 bg-dominant p-3 rounded-lg border border-emerald-200">
              <code className="text-accent font-mono text-sm font-bold flex-1 break-all">
                {newlyGeneratedKey.rawKey}
              </code>
              <Button
                variant={copiedState ? "primary" : "secondary"}
                onClick={() => handleCopyNewKey(newlyGeneratedKey.rawKey)}
                className={copiedState ? "bg-emerald-600 text-white border-emerald-600" : ""}
              >
                {copiedState ? "Copied!" : "Copy Key"}
              </Button>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setNewlyGeneratedKey(null)}>I have saved this key</Button>
            </div>
          </div>
        )}

        {showCreateForm && !newlyGeneratedKey && (
          <form onSubmit={handleCreateKey} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-surface p-6 rounded-xl border border-secondary/30 animate-in slide-in-from-top-4">

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="keyNameInput" className="text-xs font-bold text-accent uppercase tracking-wider">Key Name</label>
              <input
                id="keyNameInput"
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="px-3.5 py-2.5 bg-dominant border border-secondary/40 rounded-lg text-accent font-bold focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-accent uppercase tracking-wider">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as "LIVE" | "SANDBOX")}
                className="px-3.5 py-2.5 bg-dominant border border-secondary/40 rounded-lg text-accent font-bold"
              >
                <option value="SANDBOX">Sandbox (365d)</option>
                <option value="LIVE">Live Prod (90d)</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setShowCreateForm(false)}>Cancel</Button>
              <Button type="submit" isLoading={isGenerating}>Generate</Button>
            </div>

            {/* VAM SUB-ACCOUNT BINDING - Highlighted for clarity */}
            <div className="flex flex-col gap-1.5 md:col-span-2 mt-4">
              <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider">API Credential Account Scope (Required)</label>
              <p className="text-[10px] text-accent/60 mb-1 leading-tight">This API credential can access only the selected VAM sub-account, subject to your account permissions.</p>
              <select
                value={linkedAccountId}
                onChange={(e) => setLinkedAccountId(e.target.value)}
                className="px-3.5 py-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 font-bold focus:ring-2 focus:ring-emerald-500"
              >
                {(!accounts || accounts.length === 0) && (
                  <option value="">No Accounts Available</option>
                )}
                {accounts?.map((acc) => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountNumber} {acc.accountName ? `(${acc.accountName})` : ''} (**** {acc.accountNumber.slice(-4)}) — {acc.currency || 'PHP'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2 mt-4">
              <label className="text-xs font-bold text-accent uppercase tracking-wider">IP Whitelist (CIDR notation)</label>
              <p className="text-[10px] text-accent/60 mb-1 leading-tight">Limit API calls to originating from these specific IPv4 addresses.</p>
              <input
                type="text"
                placeholder="0.0.0.0/0 (Default: Allow All)"
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                className="px-3.5 py-2.5 bg-dominant border border-secondary/40 rounded-lg font-mono text-sm"
              />
            </div>

            {/* ENHANCED GRANULAR SCOPES */}
            <div className="flex flex-col gap-3 md:col-span-4 mt-4">
              <div className="flex items-center justify-between border-b border-secondary/30 pb-2">
                <label className="text-xs font-bold text-accent uppercase tracking-wider">Granted Scopes</label>
                <span className="text-[10px] text-accent/60 font-bold bg-secondary/10 px-2 py-0.5 rounded">Action Limits</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {SCOPE_GROUPS.map((group) => (
                  <div key={group.domain} className="bg-surface p-3 rounded-lg border border-secondary/30 flex flex-col gap-2">
                    <span className="text-[11px] font-extrabold text-sky-700 tracking-wide">{group.domain}</span>
                    <div className="flex flex-col gap-2">
                      {group.scopes.map(scope => (
                        <label key={scope.id} className="flex items-center gap-2 text-xs font-bold text-accent cursor-pointer ml-1">
                          <input
                            type="checkbox"
                            checked={selectedScopes.includes(scope.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedScopes([...selectedScopes, scope.id]);
                              else setSelectedScopes(selectedScopes.filter((s: string) => s !== scope.id));
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
          </form>
        )}

        {/* Existing Keys List */}
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="p-8 text-center bg-surface rounded-xl border border-secondary/30">
              <p className="text-accent/60 font-bold animate-pulse">Loading secure keys from Vault...</p>
            </div>
          ) : keys.length === 0 ? (
            <div className="p-8 text-center bg-surface rounded-xl border border-secondary/30">
              <p className="text-accent/60 font-bold">No active API keys found in database.</p>
            </div>
          ) : (
            keys.map((key: ApiKey) => {
              const status = getExpiryStatus(key.expiresAt, key.revokedAt);
              const isRevoked = !!key.revokedAt;

              return (
                <div key={key.id} className={`flex flex-col md:flex-row md:items-center justify-between p-5 bg-dominant border rounded-xl gap-4 transition-all shadow-sm ${isRevoked ? "border-rose-100 opacity-60 grayscale" : "border-secondary/40 hover:border-secondary/80"}`}>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h5 className="font-bold text-accent text-lg">{key.name}</h5>
                      <span className={`px-2 py-0.5 rounded text-xs font-extrabold tracking-wide ${key.environment === "LIVE" ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-700"}`}>
                        {key.environment}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border uppercase tracking-wider ${status.style}`}>
                        {status.label}
                      </span>
                      {key.linkedAccountId && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          Account Scope: ****{key.linkedAccountId.slice(-4)}
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-sm font-bold text-accent/80 bg-surface px-3 py-1.5 rounded-lg border border-secondary/30 inline-block mb-3">
                      {key.keyPrefix}{key.maskedHash}
                    </div>
                    <div className="flex gap-6 text-xs font-bold text-accent/50">
                      <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                      <span>Last Used: {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : "Never"}</span>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2 justify-end">
                    {!isRevoked && (
                      <>
                        <Button variant="secondary" onClick={() => handleRotateKey(key.id)} disabled={isGenerating}>
                          Rotate Key
                        </Button>
                        <Button variant="danger" onClick={() => revokeKey(key.id)} disabled={isGenerating}>
                          Revoke
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};
