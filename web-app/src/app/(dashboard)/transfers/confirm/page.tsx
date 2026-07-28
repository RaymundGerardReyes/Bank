import React from "react";
import Link from "next/link";
import { Card } from "@/components/common/Card";

export default function TransferConfirmPage() {
  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 text-center">
      <Card title="Transfer Successful">
        <div className="text-4xl text-emerald-400 mb-4">✓</div>
        <p className="text-slate-300 text-sm mb-6">
          Your transfer request has been successfully submitted and processed.
        </p>
        <Link href="/accounts" className="px-6 py-2.5 bg-sky-600 text-white rounded-lg font-medium">
          Back to Accounts
        </Link>
      </Card>
    </div>
  );
}
