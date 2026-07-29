"use client";

import React, { useEffect, useState } from "react";

interface ApiReferenceViewerProps {
  specUrl: string;
}

export const ApiReferenceViewer: React.FC<ApiReferenceViewerProps> = ({ specUrl }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Payment Orchestration Gateway API Reference</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
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
          /* Custom sleek scrollbar styling */
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
        <script
          id="api-reference"
          data-url="${specUrl}">
        </script>
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
  `;

  if (!isMounted) {
    return (
      <div className="w-full bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden min-h-[800px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-400 mr-3"></div>
        <span className="text-slate-300 font-medium">Initializing Developer Gateway...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden h-[850px] relative">
      <iframe
        title="Scalar API Reference Portal"
        srcDoc={srcDoc}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
      />
    </div>
  );
};