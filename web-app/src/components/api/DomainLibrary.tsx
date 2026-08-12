"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ApiTestResponse, executeApiTest } from "@/services/docs/apiTestRunner";
import React, { useState } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type SdkLanguage = "cURL" | "Python" | "Go" | "C# .NET" | "TypeScript" | "JavaScript";

const SDK_LANGUAGES: SdkLanguage[] = ["cURL", "Python", "Go", "C# .NET", "TypeScript", "JavaScript"];

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
    id: "domain-vam",
    title: "1. Virtual Account Management (VAM)",
    description: "Provision dynamic, isolated sub-ledgers tied to your master corporate account.",
    endpoints: [
      {
        method: "POST",
        path: "/v1/accounts",
        label: "Provision VAM",
        defaultPayload: {
          accountType: "PAYROLL",
          accountName: "Contractor Payroll 2026",
          currency: "USD",
          parentAccountId: "4859220013371001",
          dailyLimit: 250000.0,
          allowIncoming: false,
          allowOutgoing: true,
          issueVirtualCard: true,
          requireDualApproval: false
        }
      },
      { method: "GET", path: "/v1/accounts", label: "List Hierarchy" },
    ],
  },
  {
    id: "domain-payments",
    title: "2. Payment Processing",
    description: "Core lifecycle management: Authorization, Capture, Void, Refund, and Dispute handling.",
    endpoints: [
      { method: "POST", path: "/v1/payments", label: "Create Intent", defaultPayload: { amount: 100.0, currency: "USD", sourceAccount: "1001987654" } },
      { method: "POST", path: "/v1/payments/101/capture", label: "Capture", defaultPayload: { amount: 100.0 } },
      { method: "POST", path: "/v1/payments/101/refunds", label: "Refund", defaultPayload: { reason: "Customer return" } },
    ],
  },
  {
    id: "domain-payroll",
    title: "3. Bulk Distribution & Payroll",
    description: "CSV/JSON batch uploads, Maker-Checker dual approvals, and multi-disbursement routing.",
    endpoints: [
      { method: "POST", path: "/v1/batch/payroll", label: "Upload Batch", defaultPayload: { batchName: "July 2026 Payroll", count: 25 } },
      { method: "POST", path: "/v1/batch/501/approve", label: "Checker Approve", defaultPayload: { checkerComments: "Verified against ledger" } },
      { method: "GET", path: "/v1/batch/501/status", label: "Track Status" },
    ],
  },
  {
    id: "domain-orchestration",
    title: "4. Payment Orchestration",
    description: "Smart routing, multi-rail gateway failover, and dynamic active-active clustering.",
    endpoints: [
      { method: "POST", path: "/v1/routing/evaluate", label: "Route Payment", defaultPayload: { amount: 250.0, currency: "USD", preferredRail: "INSTAPAY" } },
      { method: "GET", path: "/v1/routing/rules", label: "List Rules" },
      { method: "POST", path: "/v1/routing/simulate", label: "Dry Run", defaultPayload: { amount: 1000.0, currency: "PHP" } },
    ],
  },
  {
    id: "domain-treasury",
    title: "5. Transfers & Treasury",
    description: "Internal, Scheduled, Wire, Cross-Border, and Virtual IBAN concentration.",
    endpoints: [
      { method: "POST", path: "/v1/transfers/internal", label: "Internal Transfer", defaultPayload: { sourceAccountNumber: "1001987654", recipientAccountNumber: "1002345678", amount: 50.0 } },
      { method: "POST", path: "/v1/transfers/scheduled", label: "Schedule", defaultPayload: { sourceAccountNumber: "1001987654", recipientAccountNumber: "1002345678", amount: 150.0, scheduledDate: "2026-08-01" } },
      { method: "GET", path: "/v1/treasury/liquidity", label: "Cash Position" },
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
  const [activeSdk, setActiveSdk] = useState<SdkLanguage>("cURL");

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

  // Dynamic SDK Generation Engine
  const getDisplaySdkCode = (ep: ApiEndpoint, isCopying: boolean) => {
    let keyStr = "<PASTE_YOUR_RAW_KEY_HERE>";
    if (providedApiKey.trim()) {
      keyStr = isCopying || isKeyVisible ? providedApiKey.trim() : "sk_...[HIDDEN]... ";
    }

    const baseUrl = `https://api.novabank.com${ep.path}`;
    const safeBody = requestBodyText ? requestBodyText.replace(/\n/g, "") : "";

    switch (activeSdk) {
      case "Python":
        return `import requests\nimport json\n\nurl = "${baseUrl}"\n\nheaders = {\n    "X-API-Key": "${keyStr}",\n    "Content-Type": "application/json",\n    "X-Request-Id": "550e8400-e29b-41d4-a716-446655440000"\n}\n${safeBody ? `\npayload = ${safeBody}\nresponse = requests.request("${ep.method}", url, json=payload, headers=headers)` : `\nresponse = requests.request("${ep.method}", url, headers=headers)`}\n\nprint(response.text)`;

      case "TypeScript":
      case "JavaScript":
        return `const url = "${baseUrl}";\n\nconst headers = {\n  "X-API-Key": "${keyStr}",\n  "Content-Type": "application/json",\n  "X-Request-Id": "550e8400-e29b-41d4-a716-446655440000"\n};\n${safeBody ? `\nconst body = JSON.stringify(${safeBody});\n` : ""}\nconst response = await fetch(url, {\n  method: "${ep.method}",\n  headers: headers,${safeBody ? `\n  body: body` : ""}\n});\n\nconst data = await response.json();\nconsole.log(data);`;

      case "Go":
        const goBody = safeBody ? `payload := strings.NewReader(\`${safeBody}\`)` : `payload := strings.NewReader("")`;
        return `package main\n\nimport (\n\t"fmt"\n\t"strings"\n\t"net/http"\n\t"io/ioutil"\n)\n\nfunc main() {\n\turl := "${baseUrl}"\n\tmethod := "${ep.method}"\n\n\t${goBody}\n\n\tclient := &http.Client {}\n\treq, err := http.NewRequest(method, url, payload)\n\n\tif err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n\treq.Header.Add("X-API-Key", "${keyStr}")\n\treq.Header.Add("Content-Type", "application/json")\n\treq.Header.Add("X-Request-Id", "550e8400-e29b-41d4-a716-446655440000")\n\n\tres, err := client.Do(req)\n\tif err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n\tdefer res.Body.Close()\n\n\tbody, err := ioutil.ReadAll(res.Body)\n\tfmt.Println(string(body))\n}`;

      case "C# .NET":
        const csharpMethod = ep.method === 'POST' ? 'Post' : ep.method === 'PUT' ? 'Put' : ep.method === 'PATCH' ? 'Patch' : ep.method === 'DELETE' ? 'Delete' : 'Get';
        return `using System;\nusing System.Net.Http;\nusing System.Threading.Tasks;\n\nclass Program\n{\n    static async Task Main()\n    {\n        var client = new HttpClient();\n        var request = new HttpRequestMessage(HttpMethod.${csharpMethod}, "${baseUrl}");\n\n        request.Headers.Add("X-API-Key", "${keyStr}");\n        request.Headers.Add("X-Request-Id", "550e8400-e29b-41d4-a716-446655440000");\n${safeBody ? `\n        var content = new StringContent("${safeBody.replace(/"/g, '\\"')}", null, "application/json");\n        request.Content = content;\n` : ""}\n        var response = await client.SendAsync(request);\n        response.EnsureSuccessStatusCode();\n        Console.WriteLine(await response.Content.ReadAsStringAsync());\n    }\n}`;

      case "cURL":
      default:
        const curlBody = safeBody ? ` \\\n  -d '${safeBody}'` : "";
        return `curl -X ${ep.method} ${baseUrl} \\\n  -H "X-API-Key: ${keyStr}" \\\n  -H "Content-Type: application/json" \\\n  -H "X-Request-Id: 550e8400-e29b-41d4-a716-446655440000"${curlBody}`;
    }
  };

  const handleCopy = (ep: ApiEndpoint) => {
    navigator.clipboard.writeText(getDisplaySdkCode(ep, true));
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

                          {/* Action Buttons & Execution */}
                          <div className="flex justify-between items-center mt-2 border-t border-secondary/30 pt-4">
                            <span className="text-[10px] font-bold text-accent/50 uppercase">Integration SDKs</span>
                            <Button
                              onClick={() => handleRunTest(ep)}
                              isLoading={isRunning}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-1.5 px-4 shadow-md shadow-emerald-600/20"
                            >
                              Execute Live Call
                            </Button>
                          </div>

                          {/* SDK Language Tabs */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {SDK_LANGUAGES.map((lang) => (
                              <button
                                key={lang}
                                onClick={() => setActiveSdk(lang)}
                                className={`px-3 py-1 text-[10px] font-bold rounded transition-colors border ${activeSdk === lang
                                    ? "bg-sky-100 text-sky-700 border-sky-300"
                                    : "bg-dominant text-accent/60 border-secondary/30 hover:bg-surface"
                                  }`}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>

                          {/* Beautiful Code Block with Smart Copy Button */}
                          <div className="relative bg-[#0F172A] text-sky-200 p-4 rounded-xl border border-slate-800 font-mono text-[11px] overflow-hidden group/code">
                            <button
                              onClick={() => handleCopy(ep)}
                              className="absolute top-2 right-2 px-3 py-1.5 bg-slate-800 hover:bg-sky-600 text-slate-100 rounded border border-slate-600 text-[10px] font-bold transition-all z-10"
                            >
                              {copiedCode ? "Copied Code!" : "Copy"}
                            </button>
                            <pre className="whitespace-pre-wrap pr-16 leading-relaxed overflow-x-auto custom-scrollbar">
                              {getDisplaySdkCode(ep, false)}
                            </pre>
                          </div>

                          {/* API Response Display */}
                          {testResponse && (
                            <div className="flex flex-col gap-2 mt-2 p-4 bg-surface rounded-xl border border-secondary/30 animate-in fade-in duration-300">
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