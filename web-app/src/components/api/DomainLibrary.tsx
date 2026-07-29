"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ApiTestResponse, executeApiTest } from "@/services/docs/apiTestRunner";
import React, { useState } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiEndpoint {
  method: HttpMethod;
  path: string;
  label: string;
  defaultPayload?: object;
}

interface DomainModule {
  id: string;
  title: string;
  description: string;
  endpoints: ApiEndpoint[];
}

const DOMAINS: DomainModule[] = [
  {
    id: "domain-payments",
    title: "1. Payment Processing",
    description: "Core lifecycle management: Authorization, Capture, Void, Refund, and Dispute handling.",
    endpoints: [
      { method: "POST", path: "/v1/payments", label: "Create Intent", defaultPayload: { amount: 100.0, currency: "USD", sourceAccount: "1001987654" } },
      { method: "POST", path: "/v1/payments/101/capture", label: "Capture", defaultPayload: { amount: 100.0 } },
      { method: "POST", path: "/v1/payments/101/refunds", label: "Refund", defaultPayload: { reason: "Customer return" } },
    ],
  },
  {
    id: "domain-payroll",
    title: "2. Bulk Distribution & Payroll",
    description: "CSV/JSON batch uploads, Maker-Checker dual approvals, and multi-disbursement routing.",
    endpoints: [
      { method: "POST", path: "/v1/batch/payroll", label: "Upload Batch", defaultPayload: { batchName: "July 2026 Payroll", count: 25 } },
      { method: "POST", path: "/v1/batch/501/approve", label: "Checker Approve", defaultPayload: { checkerComments: "Verified against ledger" } },
      { method: "GET", path: "/v1/batch/501/status", label: "Track Status" },
    ],
  },
  {
    id: "domain-orchestration",
    title: "3. Payment Orchestration",
    description: "Smart routing, multi-rail gateway failover, and dynamic active-active clustering.",
    endpoints: [
      { method: "POST", path: "/v1/routing/evaluate", label: "Route Payment", defaultPayload: { amount: 250.0, currency: "USD", preferredRail: "INSTAPAY" } },
      { method: "GET", path: "/v1/routing/rules", label: "List Rules" },
      { method: "POST", path: "/v1/routing/simulate", label: "Dry Run", defaultPayload: { amount: 1000.0, currency: "PHP" } },
    ],
  },
  {
    id: "domain-treasury",
    title: "4. Transfers & Treasury",
    description: "Internal, Scheduled, Wire, Cross-Border, and Virtual IBAN concentration.",
    endpoints: [
      { method: "POST", path: "/v1/transfers/internal", label: "Internal Transfer", defaultPayload: { sourceAccountNumber: "1001987654", recipientAccountNumber: "1002345678", amount: 50.0 } },
      { method: "POST", path: "/v1/transfers/scheduled", label: "Schedule", defaultPayload: { sourceAccountNumber: "1001987654", recipientAccountNumber: "1002345678", amount: 150.0, scheduledDate: "2026-08-01" } },
      { method: "GET", path: "/v1/treasury/liquidity", label: "Cash Position" },
    ],
  },
  {
    id: "domain-ledger",
    title: "5. Accounting Ledger",
    description: "Immutable double-entry ledger, event sourcing, and CQRS journal logs.",
    endpoints: [
      { method: "POST", path: "/v1/ledger/journal", label: "Write Entry", defaultPayload: { debitAccount: "1001987654", creditAccount: "1002345678", amount: 200.0 } },
      { method: "GET", path: "/v1/ledger/entries", label: "Query Ledger" },
      { method: "GET", path: "/v1/ledger/balances", label: "Trial Balance" },
    ],
  },
  {
    id: "domain-risk",
    title: "6. Fraud & Risk AI",
    description: "AI-driven velocity checks, AML/Sanctions screening, and dynamic limits.",
    endpoints: [
      { method: "POST", path: "/v1/risk/evaluate", label: "Score Txn", defaultPayload: { amount: 5000.0, accountNo: "1001987654" } },
      { method: "POST", path: "/v1/risk/aml-screen", label: "Screen Entity", defaultPayload: { entityName: "Acme Corp", country: "US" } },
      { method: "GET", path: "/v1/risk/velocity", label: "Check Limits" },
    ],
  },
];

const getMethodStyles = (method: HttpMethod) => {
  switch (method) {
    case "GET": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "POST": return "bg-sky-100 text-sky-700 border-sky-200";
    case "PATCH":
    case "PUT": return "bg-amber-100 text-amber-700 border-amber-200";
    case "DELETE": return "bg-rose-100 text-rose-700 border-rose-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export const DomainLibrary: React.FC = () => {
  const [activeTestKey, setActiveTestKey] = useState<string | null>(null);

  // Security State
  const [providedApiKey, setProvidedApiKey] = useState<string>("");
  const [isKeyVisible, setIsKeyVisible] = useState<boolean>(false);

  const [requestBodyText, setRequestBodyText] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResponse, setTestResponse] = useState<ApiTestResponse | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const openTryItPanel = (epKey: string, endpoint: ApiEndpoint) => {
    if (activeTestKey === epKey) {
      setActiveTestKey(null);
      setTestResponse(null);
      return;
    }
    setActiveTestKey(epKey);
    setTestResponse(null);
    setCopiedCode(false);
    setRequestBodyText(endpoint.defaultPayload ? JSON.stringify(endpoint.defaultPayload, null, 2) : "");
  };

  const handleRunTest = async (endpoint: ApiEndpoint) => {
    if (!providedApiKey.trim()) {
      alert("Please paste your raw API key to execute this test.");
      return;
    }

    if (providedApiKey.includes("sk_live_")) {
      const confirmLive = confirm("WARNING: You are executing a LIVE Production transaction. Proceed?");
      if (!confirmLive) return;
    }

    setIsRunning(true);
    setTestResponse(null);
    let parsedBody: any;

    if (requestBodyText.trim()) {
      try {
        parsedBody = JSON.parse(requestBodyText);
      } catch (e) {
        alert("Invalid JSON format in request body");
        setIsRunning(false);
        return;
      }
    }

    try {
      const result = await executeApiTest({
        endpoint: endpoint.path,
        method: endpoint.method,
        apiKey: providedApiKey.trim(),
        body: parsedBody,
      });
      setTestResponse(result);
    } catch (err: any) {
      setTestResponse({
        status: 500,
        statusText: "Internal Error",
        responseTimeMs: 0,
        data: { error: err.message },
      });
    } finally {
      setIsRunning(false);
    }
  };

  // What the user sees on screen (respects the visibility toggle)
  const getDisplayCurlCommand = (ep: ApiEndpoint) => {
    let keyStr = "<PASTE_YOUR_RAW_KEY_HERE>";
    if (providedApiKey.trim()) {
      keyStr = isKeyVisible ? providedApiKey.trim() : "sk_...[HIDDEN]... ";
    }
    const bodyStr = requestBodyText ? ` \\\n  -d '${requestBodyText.replace(/\n/g, "")}'` : "";
    return `curl -X ${ep.method} https://api.novabank.com${ep.path} \\\n  -H "X-API-Key: ${keyStr}" \\\n  -H "Content-Type: application/json" \\\n  -H "X-Request-Id: 550e8400-e29b-41d4-a716-446655440000"${bodyStr}`;
  };

  // What the user actually copies to their clipboard (always raw, never asterisks)
  const getCopyableCurlCommand = (ep: ApiEndpoint) => {
    const keyStr = providedApiKey.trim() ? providedApiKey.trim() : "<PASTE_YOUR_RAW_KEY_HERE>";
    const bodyStr = requestBodyText ? ` \\\n  -d '${requestBodyText.replace(/\n/g, "")}'` : "";
    return `curl -X ${ep.method} https://api.novabank.com${ep.path} \\\n  -H "X-API-Key: ${keyStr}" \\\n  -H "Content-Type: application/json" \\\n  -H "X-Request-Id: 550e8400-e29b-41d4-a716-446655440000"${bodyStr}`;
  };

  const handleCopy = (ep: ApiEndpoint) => {
    navigator.clipboard.writeText(getCopyableCurlCommand(ep));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-accent mb-2">Tier 1 Core Modules</h2>
          <p className="text-accent/70 font-medium max-w-2xl leading-relaxed">
            RESTful API architecture supporting idempotency, JSON-based payloads, and strict TLS 1.3 encryption.
          </p>
        </div>
        <Button onClick={() => window.open('/developers', '_blank')} className="bg-accent text-dominant whitespace-nowrap">
          View OpenAPI 3.1 Spec
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {DOMAINS.map((domain) => (
          <Card key={domain.id} className="flex flex-col h-full bg-dominant border border-secondary/30 shadow-md shadow-secondary/5 group">
            <div className="mb-6 flex-1">
              <h3 className="text-lg font-extrabold text-accent mb-2 group-hover:text-sky-600 transition-colors">
                {domain.title}
              </h3>
              <p className="text-sm font-medium text-accent/70 leading-relaxed">
                {domain.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 bg-surface p-4 rounded-xl border border-secondary/20">
              <span className="text-[10px] font-extrabold text-accent/40 uppercase tracking-widest mb-1">
                Lifecycle Endpoints
              </span>

              <div className="flex flex-col gap-3">
                {domain.endpoints.map((ep, i) => {
                  const epKey = `${domain.id}-${i}`;
                  const isExpanded = activeTestKey === epKey;

                  return (
                    <div key={i} className="flex flex-col gap-2 bg-dominant p-3 rounded-lg border border-secondary/30">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider w-12 text-center ${getMethodStyles(ep.method)}`}>
                            {ep.method}
                          </span>
                          <code className="text-xs font-mono font-bold text-accent/80 truncate">
                            {ep.path}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-accent/50 hidden sm:inline">
                            {ep.label}
                          </span>
                          <button
                            onClick={() => openTryItPanel(epKey, ep)}
                            className="px-3 py-1.5 bg-accent hover:bg-accent/90 text-dominant text-[10px] font-extrabold rounded transition-colors shadow-sm"
                          >
                            {isExpanded ? "Close" : "Try it"}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 flex flex-col gap-4 pt-4 border-t border-secondary/30 animate-in fade-in slide-in-from-top-2 duration-300">

                          {/* Secure Minimalist API Key Input */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-accent uppercase tracking-wider">
                              Authenticate Request
                            </label>
                            <div className="relative">
                              <input
                                type={isKeyVisible ? "text" : "password"}
                                placeholder="Paste raw key here (e.g. sk_test_...)"
                                value={providedApiKey}
                                onChange={(e) => setProvidedApiKey(e.target.value)}
                                className="w-full px-3 py-2 pr-10 bg-surface border border-secondary/40 rounded-lg text-accent text-xs font-mono focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setIsKeyVisible(!isKeyVisible)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-accent/50 hover:text-sky-600 transition-colors"
                              >
                                {/* Simple SVG Eye Icon */}
                                {isKeyVisible ? (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                            <span className="text-[9px] text-accent/50 italic">Keys are strictly local. Network interceptors cannot trace this value.</span>
                          </div>

                          {ep.method !== "GET" && (
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-accent uppercase tracking-wider">JSON Payload</label>
                              <textarea
                                rows={4}
                                value={requestBodyText}
                                onChange={(e) => setRequestBodyText(e.target.value)}
                                className="p-3 bg-surface border border-secondary/40 rounded-lg text-accent font-mono text-[11px] focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                              />
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] font-bold text-accent/50 uppercase">cURL Generator</span>
                            <Button
                              onClick={() => handleRunTest(ep)}
                              isLoading={isRunning}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-1.5 px-4 shadow-md shadow-emerald-600/20"
                            >
                              Execute Call
                            </Button>
                          </div>

                          {/* Beautiful Code Block with Smart Copy Button */}
                          <div className="relative bg-[#0F172A] text-sky-200 p-4 rounded-xl border border-slate-800 font-mono text-[11px] overflow-hidden group/code">
                            <button
                              onClick={() => handleCopy(ep)}
                              className="absolute top-2 right-2 px-3 py-1.5 bg-slate-800 hover:bg-sky-600 text-slate-100 rounded border border-slate-600 text-[10px] font-bold transition-all z-10"
                            >
                              {copiedCode ? "Copied Raw!" : "Copy"}
                            </button>
                            <pre className="whitespace-pre-wrap pr-16 leading-relaxed">
                              {getDisplayCurlCommand(ep)}
                            </pre>
                          </div>

                          {/* API Response Display */}
                          {testResponse && (
                            <div className="flex flex-col gap-2 mt-2 p-4 bg-surface rounded-xl border border-secondary/30">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded text-white ${testResponse.status >= 200 && testResponse.status < 300 ? "bg-emerald-600" : testResponse.status >= 400 && testResponse.status < 500 ? "bg-amber-600" : "bg-rose-600"}`}>
                                    HTTP {testResponse.status} {testResponse.statusText}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold text-accent/60">
                                    Latency: {testResponse.responseTimeMs}ms
                                  </span>
                                </div>
                              </div>
                              <div className="bg-dominant p-3 rounded-lg border border-secondary/30 font-mono text-[11px] text-accent max-h-48 overflow-y-auto">
                                <pre className="whitespace-pre-wrap">
                                  {typeof testResponse.data === "object" ? JSON.stringify(testResponse.data, null, 2) : testResponse.data}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};