"use client";

import React, { useEffect, useState } from "react";

interface ApiReferenceViewerProps {
  specUrl?: string;
}

export const ApiReferenceViewer: React.FC<ApiReferenceViewerProps> = ({ specUrl }) => {
  const [specContent, setSpecContent] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSpec = async () => {
      // If specUrl is undefined (e.g. lost during Next.js static rendering), fallback to the relative path
      // that Nginx natively reverse-proxies to the Spring Boot backend.
      const safeSpecUrl = specUrl || "/v3/api-docs/developer-gateway";

      try {
        const url = safeSpecUrl.startsWith("http")
          ? safeSpecUrl
          : `${window.location.origin}${safeSpecUrl.startsWith("/") ? "" : "/"}${safeSpecUrl}`;

        const res = await fetch(url);

        if (!res.ok) {
          setError(`Failed to load API spec: ${res.status} ${res.statusText}`);
          return;
        }

        const text = await res.text();

        // Parse, patch, and re-serialize.
        // The spec uses servers[0].url = "/" (relative). Inside a srcDoc iframe the
        // document origin is null, so relative URLs cannot be resolved by Scalar's
        // internal fetch. We must patch it to the browser's real absolute origin
        // so that Scalar routes API calls through Nginx correctly.
        const spec = JSON.parse(text);
        if (spec.servers && Array.isArray(spec.servers) && spec.servers.length > 0) {
          spec.servers[0].url = window.location.origin;
        }

        setSpecContent(JSON.stringify(spec));
      } catch (err) {
        console.error("[ApiReferenceViewer] Failed to fetch spec:", err);
        setError(`Network error loading API spec: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    fetchSpec();
  }, [specUrl]);

  if (error) {
    return (
      <div className="w-full bg-slate-900 rounded-xl border border-red-500/30 p-8 flex flex-col items-center justify-center h-[850px]">
        <div className="text-red-400 font-bold text-xl mb-2">Documentation Error</div>
        <div className="text-red-300/80 font-mono text-sm">{error}</div>
      </div>
    );
  }

  if (!specContent) {
    return (
      <div className="w-full bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden h-[850px] relative flex flex-col items-center justify-center">
        <div className="text-accent/50 font-medium animate-pulse mb-4">Fetching OpenAPI Specification...</div>
        <div className="text-xs text-slate-500 font-mono">
          Debug specUrl: {specUrl === undefined ? 'undefined' : specUrl === '' ? 'empty string' : specUrl}
        </div>
      </div>
    );
  }

  // Safely escape the JSON string to prevent HTML injection (e.g., closing script tags)
  const safeSpecContent = specContent.replace(/</g, '\\u003c');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>NovaBank API Reference</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            background-color: #0f172a;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow-y: auto;
          }
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #0f172a;
          }
          ::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #475569;
          }
        </style>
      </head>
      <body>
        <script id="api-reference" type="application/json">
          ${safeSpecContent}
        </script>
        
        <!-- Pinned to a modern, verified version to prevent CDN drift -->
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.62.0"></script>
      </body>
    </html>
  `;

  return (
    <div className="w-full bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden h-[850px] relative">
      <iframe
        srcDoc={htmlContent}
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        title="Scalar API Reference Documentation"
      />
    </div>
  );
};

export default ApiReferenceViewer;