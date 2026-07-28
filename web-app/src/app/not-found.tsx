import React from "react";
import Link from "next/link";
import { Card } from "@/components/common/Card";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-900 text-slate-100">
      <Card className="max-w-md w-full text-center" title="404 - Page Not Found">
        <div className="text-5xl mb-4 text-sky-400 font-bold">404</div>
        <p className="text-slate-300 text-sm mb-6">
          The requested page or resource could not be found on the server.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg transition-colors"
        >
          Return to Portal Home
        </Link>
      </Card>
    </div>
  );
}
