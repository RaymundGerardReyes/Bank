export const dynamic = 'force-dynamic';

import React from "react";
import { env } from "@/server/config/env";
import { ApiReferenceViewer } from "@/components/docs/ApiReferenceViewer";

export default async function DeveloperSubRoutePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-sky-400">Developer API Reference ({slug.join("/")})</h1>
      <ApiReferenceViewer specUrl={env.openApiSpecUrl || ""} />
    </div>
  );
}
