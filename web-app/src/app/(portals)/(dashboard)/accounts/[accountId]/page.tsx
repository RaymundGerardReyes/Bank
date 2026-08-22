import React from "react";
import { Card } from "@/components/ui/Card";

export default async function AccountDetailPage({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-100">Account Details</h1>
      <Card title={`Account ID: ${accountId}`}>
        <p className="text-slate-300">Detailed account metadata and transaction history filter.</p>
      </Card>
    </div>
  );
}
