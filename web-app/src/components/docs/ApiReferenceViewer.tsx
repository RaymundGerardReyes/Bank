"use client";

import React from "react";
import { Card } from "@/components/common/Card";

interface ApiReferenceViewerProps {
  specUrl: string;
}

export const ApiReferenceViewer: React.FC<ApiReferenceViewerProps> = ({ specUrl }) => {
  return (
    <Card title="Developer API Gateway Documentation" className="w-full">
      <p className="text-slate-300 mb-4">
        Interactive OpenAPI spec for non-production environments.
      </p>
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg">
        <span className="text-xs text-sky-400 font-mono">OpenAPI Specification Source: {specUrl}</span>
      </div>
    </Card>
  );
};
