"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import React, { useEffect, useState } from "react";

export interface ApiKey {
  id: number;
  name: string;
  environment: "LIVE" | "SANDBOX";
  keyPrefix: string;
  maskedHash: string;
  rawKey?: string | null;
  cidrWhitelist: string;
  scopes: string[];
  expiresAt: string;
  revokedAt?: string | null;
  lastUsedAt?: string | null;
  createdAt: string;
}

const AVAILABLE_SCOPES = [
  { id: "payments:write", label: "1. Payments Write" },
  { id: "payroll:approve", label: "2. Payroll Approve" },
  { id: "routing:evaluate", label: "3. Routing Evaluate" },
  { id: "treasury:write", label: "4. Treasury Write" },
  { id: "ledger:read", label: "5. Ledger Read" },
  { id: "risk:evaluate", label: "6. Risk Evaluate" },
];

export const ApiKeyManager: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Holds the raw key data immediately after creation or rotation
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<{ name: string; rawKey: string } | null>(null);
  const [copiedState, setCopiedState] = useState(false);

  const [newKeyName, setNewKeyName] = useState("");
  const [environment, setEnvironment] = useState<"LIVE" | "SANDBOX">("SANDBOX");
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["payments:write"]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchKeys = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/proxy/apikeys");
      if (res.ok) {
        const json = await res.json();
        setKeys(json.data || []);
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
    if (ipWhitelist.trim() && !validateCidr(ipWhitelist)) {
      return setErrorMsg("Invalid CIDR format. Use standard notation like 192.168.1.0/24.");
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/proxy/apikeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName,
          environment,
          cidrWhitelist: ipWhitelist.trim() || "0.0.0.0/0",
          scopes: selectedScopes,
        }),
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

  // Enterprise UX: Rotate Key instead of revealing old ones
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
      await fetchKeys(); // Refresh the list to show the revoked status of the old key
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
      setKeys(keys.map((k) => (k.id === id ? { ...k, revokedAt: new Date().toISOString() } : k)));
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

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-accent">API Keys & Security Controls</h3>
            <p className="text-sm text-accent/70 font-medium mt-1">
              Manage HMAC SHA256 keys for API access. For PCI DSS compliance, raw keys are only displayed once.
              If you lose a key, you must <strong>Rotate</strong> it.
            </p>
          </div>
          {!showCreateForm && !newlyGeneratedKey && (
            <Button onClick={() => setShowCreateForm(true)}>+ Create New Key</Button>
          )}
        </div>

        {errorMsg && <ErrorBanner message={errorMsg} onClose={() => setErrorMsg(null)} />}

        {/* Success Alert for New / Rotated Keys */}
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

        {/* Collapsible Creation Form */}
        {showCreateForm && !newlyGeneratedKey && (
          <form onSubmit={handleCreateKey} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-surface p-6 rounded-xl border border-secondary/30 animate-in slide-in-from-top-4">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold text-accent uppercase tracking-wider">Key Name</label>
              <input
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
            <div className="flex flex-col gap-1.5 md:col-span-4 mt-2">
              <label className="text-xs font-bold text-accent uppercase tracking-wider">IP Whitelist (CIDR notation)</label>
              <input
                type="text"
                placeholder="0.0.0.0/0 (Default: Allow All) or 192.168.1.0/24"
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                className="px-3.5 py-2.5 bg-dominant border border-secondary/40 rounded-lg font-mono text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-4 mt-2">
              <label className="text-xs font-bold text-accent uppercase tracking-wider">Granted Scopes</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-dominant p-4 rounded-xl border border-secondary/30">
                {AVAILABLE_SCOPES.map((scope) => (
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
                    {scope.label}
                  </label>
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
            keys.map((key) => {
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