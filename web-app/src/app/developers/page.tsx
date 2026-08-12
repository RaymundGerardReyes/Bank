"use client";

import { Card } from "@/components/common/Card";
import { useState } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type SdkLanguage = "cURL" | "Python" | "TypeScript" | "Go" | "C# .NET";

const SDK_LANGUAGES: SdkLanguage[] = ["cURL", "Python", "TypeScript", "Go", "C# .NET"];

const API_MODULES = [
  {
    domain: "Virtual Account Management (VAM)",
    description: "Provision dynamic sub-ledgers. API Keys are confined to their VAM boundary.",
    endpoints: [
      { method: "POST" as HttpMethod, path: "/api/v1/accounts", scope: "accounts:write", payload: { accountType: "PAYROLL", currency: "USD", initialDeposit: 0 } },
      { method: "GET" as HttpMethod, path: "/api/v1/accounts", scope: "accounts:read" }
    ]
  },
  {
    domain: "Treasury & Transfers",
    description: "Move money internally. VAM boundary violations return 403 Forbidden.",
    endpoints: [
      { method: "POST" as HttpMethod, path: "/api/v1/transfers/internal", scope: "treasury:write", payload: { sourceAccountNumber: "{{VAM_ACCOUNT_ID}}", destinationAccountNumber: "9876543210", amount: 1500.00 } },
      { method: "GET" as HttpMethod, path: "/api/v1/treasury/liquidity", scope: "treasury:read" }
    ]
  },
  {
    domain: "Immutable Ledger",
    description: "Query double-entry journal logs.",
    endpoints: [
      { method: "POST" as HttpMethod, path: "/api/v1/ledger", scope: "ledger:write", payload: { entryType: "CREDIT", amount: 500 } },
      { method: "GET" as HttpMethod, path: "/api/v1/ledger", scope: "ledger:read" }
    ]
  }
];

const getMethodStyle = (method: string) => {
  switch (method) {
    case "GET": return "bg-emerald-100 text-emerald-700 border-emerald-300";
    case "POST": return "bg-sky-100 text-sky-700 border-sky-300";
    default: return "bg-slate-100 text-slate-700 border-slate-300";
  }
};

export default function DevelopersPage() {
  const [activeSdk, setActiveSdk] = useState<SdkLanguage>("cURL");
  const [apiKeyInput, setApiKeyInput] = useState<string>("");
  const [vamAccountInput, setVamAccountInput] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Dynamic SDK Generation Engine
  const generateCodeSnippet = (method: HttpMethod, path: string, payload?: object) => {
    const keyStr = apiKeyInput.trim() || "sk_live_YOUR_API_KEY";
    const baseUrl = `https://api.novabank.com${path}`;

    // Dynamically inject the VAM Account ID into the payload string
    let payloadStr = "";
    if (payload) {
      const rawJson = JSON.stringify(payload, null, 2);
      payloadStr = rawJson.replace("{{VAM_ACCOUNT_ID}}", vamAccountInput.trim() || "YOUR_RESTRICTED_VAM_ACCOUNT_ID");
    }

    // A safely stringified single-line version of the body for CLI/Compiled languages
    const safeBody = payloadStr ? payloadStr.replace(/\n/g, "").replace(/\s\s+/g, ' ') : "";

    switch (activeSdk) {
      case "Python":
        return `import requests\nimport json\n\nurl = "${baseUrl}"\n\nheaders = {\n    "X-API-Key": "${keyStr}",\n    "Content-Type": "application/json"\n}\n${payloadStr ? `\npayload = ${payloadStr}\nresponse = requests.request("${method}", url, json=payload, headers=headers)` : `\nresponse = requests.request("${method}", url, headers=headers)`}\n\nprint(response.text)`;

      case "TypeScript":
        return `const url = "${baseUrl}";\n\nconst headers = {\n  "X-API-Key": "${keyStr}",\n  "Content-Type": "application/json"\n};\n${payloadStr ? `\nconst body = JSON.stringify(${payloadStr});\n` : ""}\nconst response = await fetch(url, {\n  method: "${method}",\n  headers: headers,${payloadStr ? `\n  body: body` : ""}\n});\n\nconst data = await response.json();\nconsole.log(data);`;

      case "Go":
        const goBody = safeBody ? `payload := strings.NewReader(\`${safeBody}\`)` : `payload := strings.NewReader("")`;
        return `package main\n\nimport (\n\t"fmt"\n\t"strings"\n\t"net/http"\n\t"io/ioutil"\n)\n\nfunc main() {\n\turl := "${baseUrl}"\n\n\t${goBody}\n\n\treq, _ := http.NewRequest("${method}", url, payload)\n\treq.Header.Add("X-API-Key", "${keyStr}")\n\treq.Header.Add("Content-Type", "application/json")\n\n\tres, _ := http.DefaultClient.Do(req)\n\tdefer res.Body.Close()\n\n\tbody, _ := ioutil.ReadAll(res.Body)\n\tfmt.Println(string(body))\n}`;

      case "C# .NET":
        // Correctly formats HttpMethod (e.g. "POST" -> "Post")
        const csharpMethod = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
        // Escapes internal double quotes inside the JSON string for C#
        const escapedBodyForCSharp = safeBody.replace(/"/g, '\\"');

        return `using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.${csharpMethod}, "${baseUrl}");
        
        request.Headers.Add("X-API-Key", "${keyStr}");
        ${safeBody ? `\n        var content = new StringContent("${escapedBodyForCSharp}", Encoding.UTF8, "application/json");\n        request.Content = content;\n` : ""}
        var response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        
        Console.WriteLine(await response.Content.ReadAsStringAsync());
    }
}`;

      case "cURL":
      default:
        // Accurate cURL formatting: wraps URL in quotes, uses single quotes for payload to prevent shell interpretation
        const curlPayload = safeBody ? ` \\\n  -d '${safeBody}'` : "";
        return `curl -X ${method} "${baseUrl}" \\\n  -H "X-API-Key: ${keyStr}" \\\n  -H "Content-Type: application/json"${curlPayload}`;
    }
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-dominant text-accent font-sans selection:bg-secondary selection:text-accent pb-24">
      {/* Header Section */}
      <div className="bg-surface border-b border-secondary/30 pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-accent text-dominant text-xs font-extrabold rounded-full uppercase tracking-wider shadow-md shadow-accent/20">API Reference v1.0</span>
            <span className="text-xs font-bold text-accent/50 uppercase tracking-wider">Strict VAM Enforcement Active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-accent tracking-tight">Developer Gateway</h1>
          <p className="text-accent/80 font-medium max-w-3xl text-lg leading-relaxed">
            Generate native SDK code snippets instantly. Your API Key scopes and Virtual Account limits are evaluated in real-time by the core ledger.
          </p>
        </div>
      </div>

      {/* Security Architecture Guide */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <Card title="📖 NovaBank Enterprise API: Developer Guide" className="bg-surface border-secondary/30">
          <div className="flex flex-col gap-6 text-accent/80">
            <div>
              <h3 className="text-xl font-bold text-accent mb-2">Two-Dimensional Least Privilege Model</h3>
              <p className="leading-relaxed">
                For an API request to succeed on our platform, it must pass two strict checks:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1 font-medium pl-2">
                <li><strong className="text-accent">The Scope Limit (Action):</strong> Is the API Key allowed to perform this specific action (Read vs. Write)?</li>
                <li><strong className="text-accent">The VAM Boundary (Context):</strong> Is the API Key allowed to touch this specific Virtual Account?</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="bg-dominant p-6 rounded-xl border border-secondary/20 shadow-sm">
                <h4 className="text-lg font-extrabold text-sky-400 mb-2">🏢 Virtual Account Management (VAM)</h4>
                <p className="text-sm mb-4 text-accent/70 font-medium">Responsible for provisioning and viewing isolated sub-ledgers.</p>
                <ul className="text-sm space-y-3 font-medium">
                  <li><span className="text-emerald-600 bg-emerald-500/10 font-bold font-mono px-1.5 py-0.5 rounded border border-emerald-500/20 text-xs">GET /api/v1/accounts</span> <br/><span className="mt-1 block">Returns a list of all VAM accounts the API key is bound to.</span></li>
                  <li><span className="text-sky-600 bg-sky-500/10 font-bold font-mono px-1.5 py-0.5 rounded border border-sky-500/20 text-xs">POST /api/v1/accounts</span> <br/><span className="mt-1 block">Provisions a new sub-account. <strong className="text-amber-500 font-bold">Limit:</strong> The key must be authorized to attach child accounts to the specified Master Account.</span></li>
                </ul>
              </div>

              <div className="bg-dominant p-6 rounded-xl border border-secondary/20 shadow-sm">
                <h4 className="text-lg font-extrabold text-sky-400 mb-2">💸 Treasury & Transfers</h4>
                <p className="text-sm mb-4 text-accent/70 font-medium">Responsible for moving money internally between corporate accounts.</p>
                <ul className="text-sm space-y-3 font-medium">
                  <li><span className="text-emerald-600 bg-emerald-500/10 font-bold font-mono px-1.5 py-0.5 rounded border border-emerald-500/20 text-xs">GET /api/v1/treasury/liquidity</span> <br/><span className="mt-1 block">Checks live cash positioning and available balances.</span></li>
                  <li><span className="text-sky-600 bg-sky-500/10 font-bold font-mono px-1.5 py-0.5 rounded border border-sky-500/20 text-xs">POST /api/v1/transfers/internal</span> <br/><span className="mt-1 block">Executes a money transfer. <strong className="text-amber-500 font-bold">Limit (VAM Boundary):</strong> The sourceAccountNumber in the payload must match the VAM account bound to the API Key, or the system throws a 403 FORBIDDEN.</span></li>
                </ul>
              </div>

              <div className="bg-dominant p-6 rounded-xl border border-secondary/20 shadow-sm">
                <h4 className="text-lg font-extrabold text-sky-400 mb-2">📚 Immutable Ledger</h4>
                <p className="text-sm mb-4 text-accent/70 font-medium">Responsible for the core double-entry accounting records.</p>
                <ul className="text-sm space-y-3 font-medium">
                  <li><span className="text-emerald-600 bg-emerald-500/10 font-bold font-mono px-1.5 py-0.5 rounded border border-emerald-500/20 text-xs">GET /api/v1/ledger</span> <br/><span className="mt-1 block">Queries transaction history and immutable journal logs.</span></li>
                  <li><span className="text-sky-600 bg-sky-500/10 font-bold font-mono px-1.5 py-0.5 rounded border border-sky-500/20 text-xs">POST /api/v1/ledger</span> <br/><span className="mt-1 block">Forces a manual journal entry. <strong className="text-amber-500 font-bold">Limit:</strong> This is a highly restricted scope usually reserved for internal Admin ERPs.</span></li>
                </ul>
              </div>

              <div className="bg-dominant p-6 rounded-xl border border-secondary/20 shadow-sm">
                <h4 className="text-lg font-extrabold text-sky-400 mb-2">🌐 Additional Enterprise Modules</h4>
                <p className="text-sm mb-4 text-accent/70 font-medium">If a developer requires access to these modules, they must be explicitly granted those scopes:</p>
                <ul className="text-sm space-y-3 font-medium">
                  <li><strong className="text-accent">Payments:</strong> Authorize, capture, and refund external merchant payments.</li>
                  <li><strong className="text-accent">Payroll:</strong> Upload bulk CSV/JSON files for mass disbursement.</li>
                  <li><strong className="text-accent">Routing:</strong> Configure multi-rail gateway fallbacks (e.g., routing to Stripe vs. Adyen).</li>
                  <li><strong className="text-accent">Risk:</strong> Trigger the AI fraud screening engine.</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 xl:grid-cols-12 gap-10">

        {/* Left Column: Security Context Simulator */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <Card title="Context Simulator" className="bg-sky-50 border-sky-200 shadow-xl shadow-sky-900/5 sticky top-24">
            <p className="text-xs font-medium text-sky-800/80 mb-5 leading-relaxed">
              Inject your credentials to dynamically update the code snippets. The payloads will automatically format to respect your VAM boundaries.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-sky-900 uppercase tracking-wider">Your API Key (Local Only)</label>
                <input
                  type="password"
                  placeholder="sk_live_..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="px-3 py-2 bg-white border border-sky-200 rounded-lg text-sky-900 text-xs font-mono focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Bound VAM Account ID</label>
                <input
                  type="text"
                  placeholder="e.g. 1001987654"
                  value={vamAccountInput}
                  onChange={(e) => setVamAccountInput(e.target.value)}
                  className="px-3 py-2 bg-white border border-emerald-200 rounded-lg text-emerald-900 text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: API Endpoints & Dynamic Snippets */}
        <div className="xl:col-span-8 flex flex-col gap-10">

          {/* Global Language Selector */}
          <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-secondary/30 overflow-x-auto">
            <span className="text-[10px] font-bold text-accent/50 uppercase tracking-wider pl-2 pr-4">Programming Language</span>
            {SDK_LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveSdk(lang)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${activeSdk === lang ? "bg-accent text-dominant shadow-md" : "text-accent/70 hover:bg-secondary/10"}`}
              >
                {lang}
              </button>
            ))}
          </div>

          {API_MODULES.map((module) => (
            <div key={module.domain} className="flex flex-col gap-6">
              <div className="border-b border-secondary/30 pb-2">
                <h2 className="text-2xl font-extrabold text-accent">{module.domain}</h2>
                <p className="text-sm text-accent/60 font-medium mt-1">{module.description}</p>
              </div>

              <div className="flex flex-col gap-8">
                {module.endpoints.map((ep, i) => {
                  const snippetId = `${module.domain}-${i}`;
                  const code = generateCodeSnippet(ep.method, ep.path, ep.payload);

                  return (
                    <div key={i} className="flex flex-col border border-secondary/30 rounded-xl overflow-hidden shadow-sm">
                      {/* Endpoint Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-dominant border-b border-secondary/20 gap-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded border ${getMethodStyle(ep.method)}`}>
                            {ep.method}
                          </span>
                          <span className="font-mono text-sm font-bold text-accent">{ep.path}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-surface px-2.5 py-1 rounded border border-secondary/20">
                          <span className="text-[10px] uppercase font-bold text-accent/40 tracking-wider">Required Scope:</span>
                          <span className="text-accent text-[10px] font-mono font-bold">{ep.scope}</span>
                        </div>
                      </div>

                      {/* Interactive Code Block */}
                      <div className="relative bg-[#0F172A] p-5 font-mono text-[13px] text-sky-200 overflow-x-auto group">
                        <button
                          onClick={() => handleCopy(code, snippetId)}
                          className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-sky-600 text-slate-100 rounded-lg border border-slate-600 text-[10px] font-bold transition-all opacity-0 group-hover:opacity-100"
                        >
                          {copiedCode === snippetId ? "Copied!" : "Copy Code"}
                        </button>
                        <pre className="whitespace-pre-wrap pr-16 leading-relaxed">
                          {code}
                        </pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}