import React from "react";
import { env } from "@/config/env";
import { ApiReferenceViewer } from "@/components/docs/ApiReferenceViewer";

export default function DevelopersPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-sky-400">Developer Gateway & API Reference</h1>
        <p className="text-slate-300">
          Internal engineering contract documentation and OpenAPI 3.1 specifications.
        </p>
      </div>

      <ApiReferenceViewer specUrl={env.openApiSpecUrl} />
    </div>
  );
}
