import { ApiKeyManager } from "@/components/features/api/ApiKeyManager";
import { WebhookManager } from "@/components/features/api/WebhookManager";
import { ApiReferenceViewer } from "@/components/docs/ApiReferenceViewer";
import { env } from "@/server/config/env";

export default function ApiGatewayPage() {
  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto w-full">

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

        {/* This single component replaces the entire DomainLibrary! */}
        <ApiReferenceViewer specUrl={env.openApiSpecUrl || ""} />
      </div>

    </div>
  );
}