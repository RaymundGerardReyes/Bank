"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/services/api/httpClient";

interface TransactionResult {
  transactionReference: string;
  idempotencyKey: string;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  timestamp: string;
}

export default function AdminAuditPage() {
  const [traceRef, setTraceRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [matchedTx, setMatchedTx] = useState<TransactionResult | null>(null);
  const [error, setError] = useState("");

  const auditLogs = [
    { id: "log-1", action: "TRANSFER_EXECUTE", actor: "user_admin", timestamp: "2026-07-28 21:00:15", status: "SUCCESS" },
    { id: "log-2", action: "AUTH_LOGIN", actor: "user_client1", timestamp: "2026-07-28 20:45:02", status: "SUCCESS" },
  ];

  const handleTraceLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!traceRef.trim()) return;

    setLoading(true);
    setError("");
    setMatchedTx(null);

    try {
      const response = await apiFetch<{ data: TransactionResult }>(`/v1/transactions/trace/${traceRef.trim()}`);
      if (response?.data) {
        setMatchedTx(response.data);
      } else {
        setError("No matching transaction found for trace ref.");
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Transaction trace lookup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-8">
      <div>
        <h1 className="text-2xl font-bold text-accent">Admin Audit Trail & Support Tools</h1>
        <p className="text-sm text-accent/60 font-medium">
          Cross-platform transaction investigation and system audit log viewer.
        </p>
      </div>

      {/* Trace Reference Lookup Tool */}
      <Card title="Shared Transaction Trace Lookup (Trace Ref)">
        <form onSubmit={handleTraceLookup} className="flex flex-col gap-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                label="Trace Reference / Idempotency Key Prefix"
                placeholder="e.g. idem-172223 or full UUID key"
                value={traceRef}
                onChange={(e) => setTraceRef(e.target.value)}
                required
              />
            </div>
            <Button type="submit" isLoading={loading} className="mb-0.5">
              🔍 Search Trace Record
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-600 text-sm font-semibold">
              {error}
            </div>
          )}

          {matchedTx && (
            <div className="p-4 bg-surface border border-secondary/40 rounded-xl flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-accent text-lg">
                  Reference: {matchedTx.transactionReference}
                </span>
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {matchedTx.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-accent/70 pt-2 border-t border-secondary/20">
                <div>
                  <span className="block text-accent/50 font-bold">Source Account</span>
                  <span className="text-accent font-bold">{matchedTx.sourceAccountNumber}</span>
                </div>
                <div>
                  <span className="block text-accent/50 font-bold">Destination Account</span>
                  <span className="text-accent font-bold">{matchedTx.destinationAccountNumber || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-accent/50 font-bold">Amount</span>
                  <span className="text-accent font-bold">${matchedTx.amount.toFixed(2)} {matchedTx.currency}</span>
                </div>
                <div>
                  <span className="block text-accent/50 font-bold">Idempotency Trace Key</span>
                  <span className="font-mono text-sky-600 font-bold">{matchedTx.idempotencyKey}</span>
                </div>
              </div>
            </div>
          )}
        </form>
      </Card>

      <Card title="Security Event Log">
        <div className="flex flex-col gap-3">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex justify-between items-center p-3 bg-surface border border-secondary/30 rounded-lg text-sm">
              <div>
                <span className="font-mono text-accent font-bold">{log.action}</span>
                <span className="text-accent/60 ml-3">By {log.actor}</span>
              </div>
              <span className="text-xs text-accent/50 font-semibold">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
