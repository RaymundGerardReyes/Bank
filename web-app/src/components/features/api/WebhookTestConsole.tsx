"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

export const WebhookTestConsole: React.FC = () => {
  const [eventType, setEventType] = useState("payment.paid");
  const [reference, setReference] = useState("pi_test_123");
  const [eventId, setEventId] = useState("evt_test_" + Math.floor(Math.random() * 10000));
  const [scenario, setScenario] = useState("VALID");
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setErrorMsg(null);
    setResult(null);
    try {
      const res = await fetch("/api/proxy/webhooks/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, reference, eventId, scenario }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || json.error?.message || "Simulation failed");
      setResult(json.data);
    } catch (err: any) {
      setErrorMsg(err.message || "Simulation request failed.");
    } finally {
      setIsSimulating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED": case "SUCCESS": return "text-emerald-600 bg-emerald-100 border-emerald-200";
      case "PROCESSING": case "NOT_FOUND": return "text-sky-600 bg-sky-100 border-sky-200";
      case "FAILED": case "REJECTED": return "text-rose-600 bg-rose-100 border-rose-200";
      default: return "text-slate-600 bg-slate-100 border-slate-200";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card>
        <h4 className="font-extrabold text-accent text-lg mb-4">Local Webhook Simulator</h4>
        <p className="text-sm text-accent/70 font-medium mb-6">
          Test your webhook integration locally. This skips actual PayMongo delivery and invokes your internal payment webhook pipeline securely.
        </p>

        {errorMsg && <ErrorBanner message={errorMsg} onClose={() => setErrorMsg(null)} />}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent uppercase tracking-wider">Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="px-3 py-2 bg-dominant border border-secondary/40 rounded-lg text-accent font-bold"
            >
              <option value="payment.paid">payment.paid</option>
              <option value="payment.failed">payment.failed</option>
              <option value="checkout_session.payment.paid">checkout_session.payment.paid</option>
              <option value="unknown.event">unknown.event</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent uppercase tracking-wider">Payment Reference</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="px-3 py-2 bg-dominant border border-secondary/40 rounded-lg text-accent font-bold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent uppercase tracking-wider">Event ID</label>
            <div className="flex gap-2">
                <input
                type="text"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="flex-1 px-3 py-2 bg-dominant border border-secondary/40 rounded-lg text-accent font-bold"
                />
                <Button variant="secondary" onClick={() => setEventId("evt_test_" + Math.floor(Math.random() * 10000))}>New ID</Button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent uppercase tracking-wider">Test Scenario / Security</label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="px-3 py-2 bg-dominant border border-secondary/40 rounded-lg text-accent font-bold"
            >
              <option value="VALID">Valid Webhook Payload</option>
              <option value="INVALID_SIGNATURE">Invalid Signature (HMAC Mismatch)</option>
              <option value="MALFORMED_JSON">Malformed JSON Payload</option>
              <option value="WRONG_ENVIRONMENT">Wrong Environment (Live Mode = true)</option>
              <option value="OLD_TIMESTAMP">Expired / Old Timestamp</option>
            </select>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setScenario("VALID"); setEventType("payment.paid"); }}>Reset</Button>
            <Button onClick={handleSimulate} isLoading={isSimulating}>Simulate Webhook Delivery</Button>
          </div>
        </div>
      </Card>

      <Card>
        <h4 className="font-extrabold text-accent text-lg mb-4">Webhook Test Console</h4>
        
        {!result ? (
          <div className="flex items-center justify-center h-48 border-2 border-dashed border-secondary/30 rounded-xl bg-surface">
            <p className="text-sm font-bold text-accent/40">Run a simulation to see the results.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 animate-in slide-in-from-right-4">
            
            <div className="flex items-center justify-between border-b border-secondary/20 pb-2">
              <span className="text-xs font-bold text-accent/60 uppercase tracking-wider">Delivery Result</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border uppercase tracking-wider ${result.accepted ? 'text-emerald-700 bg-emerald-100 border-emerald-200' : 'text-rose-700 bg-rose-100 border-rose-200'}`}>
                {result.accepted ? 'HTTP 200 ACCEPTED' : 'HTTP REJECTED'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <h5 className="text-sm font-extrabold text-accent">Pipeline Outcomes</h5>
              
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-bold">
                <div className="text-accent/70">Signature & Auth:</div>
                <div className={result.exceptionMessage?.includes('Signature') ? "text-rose-600" : "text-emerald-600"}>
                  {result.exceptionMessage?.includes('Signature') ? "Mismatch / Rejected" : "Verified successfully"}
                </div>
                
                <div className="text-accent/70">Idempotency Status:</div>
                <div className="text-accent">
                    {result.processingStatus ? (
                        <span className={`px-2 py-0.5 rounded-md border ${getStatusColor(result.processingStatus)}`}>{result.processingStatus}</span>
                    ) : "N/A"}
                </div>

                <div className="text-accent/70">State Machine Event:</div>
                <div className="text-accent">{result.normalizedStatus || "N/A"}</div>
                
                <div className="text-accent/70">Processing Duration:</div>
                <div className="text-accent">{result.durationMs} ms</div>
              </div>
            </div>

            {result.exceptionMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                    <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1">Pipeline Exception</span>
                    <span className="text-sm font-medium text-rose-700">{result.exceptionMessage}</span>
                </div>
            )}

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-xs font-bold text-accent/60 uppercase tracking-wider">Simulated Request Headers</label>
              <pre className="bg-dominant p-3 rounded-lg text-[10px] font-mono text-accent/80 border border-secondary/30 overflow-x-auto">
                {`POST /api/webhooks/paymongo\nPaymongo-Signature: ${result.signatureHeader}`}
              </pre>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-accent/60 uppercase tracking-wider">Simulated Raw Payload</label>
              <pre className="bg-dominant p-3 rounded-lg text-[10px] font-mono text-accent/80 border border-secondary/30 overflow-x-auto max-h-40">
                {result.rawBody}
              </pre>
            </div>

          </div>
        )}
      </Card>
    </div>
  );
};
