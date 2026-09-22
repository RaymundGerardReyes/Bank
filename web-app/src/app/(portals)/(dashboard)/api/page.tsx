import { ApiKeyManager } from "@/components/features/api/ApiKeyManager";
import { WebhookManager } from "@/components/features/api/WebhookManager";
import ApiReferenceViewer from "@/components/docs/ApiReferenceViewer";
import DeveloperNavTabs from "@/components/docs/DeveloperNavTabs";
import Link from "next/link";
import { Code2, ArrowRight } from "lucide-react";
import { env } from "@/server/config/env";

export const dynamic = "force-dynamic";

export default function ApiGatewayPage() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Top Cross-Navigation Tabs */}
      <DeveloperNavTabs />

      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-extrabold rounded-full border border-sky-200 uppercase tracking-wider">
            Enterprise Tier 1
          </span>
          <span className="text-xs font-bold text-accent/50 uppercase tracking-wider">
            OpenAPI 3.1 Supported
          </span>
        </div>
        <h1 className="text-4xl font-black text-accent tracking-tight">Payment Orchestration Gateway</h1>
        <p className="text-accent/80 font-medium max-w-3xl text-lg leading-relaxed">
          Manage your secure API keys and explore our massive suite of Core Banking and Multi-Rail Routing modules.
        </p>

        {/* Codebase Snippets Callout Banner */}
        <div className="mt-2 p-4 rounded-xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-sky-600 text-white shadow-xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-sky-950">Pre-Made Codebase Snippets & Production Webhooks</h4>
              <p className="text-xs text-sky-800 font-medium mt-0.5">
                Ready-to-run C# .NET, Spring Boot, FastAPI, TypeScript, and cURL snippets with live credential injection.
              </p>
            </div>
          </div>
          <Link
            href="/developers/snippets"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs whitespace-nowrap self-start sm:self-auto"
          >
            <span>View Snippets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* API Key Management */}
      <ApiKeyManager />
      
      {/* Webhook Management */}
      <WebhookManager />

      <div className="w-full h-px bg-secondary/30 my-2"></div>

      {/* Automated Documentation */}
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold text-accent">Live API Documentation</h2>
        <p className="text-accent/70 font-medium mb-4">
          Interactive developer gateway reference. Test endpoints directly using your generated API keys.
        </p>

        {/* 
          Spec is loaded seamlessly via the Nginx reverse proxy.
          Nginx routes /v3/api-docs directly to the backend.
        */}
        <ApiReferenceViewer specUrl={env.openApiSpecUrl} />
      </div>

    </div>
  );
}