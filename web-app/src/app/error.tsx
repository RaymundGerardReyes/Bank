"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Error Caught by App Router Error Boundary:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-900 text-slate-100">
      <Card className="max-w-md w-full text-center" title="Application Error">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-slate-300 text-sm mb-6">
          An unexpected error occurred while processing your request.
        </p>
        {error.message && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 font-mono text-xs mb-6 text-left break-words">
            {error.message}
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>Try Again</Button>
          <Button variant="secondary" onClick={() => (window.location.href = "/")}>
            Return Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
