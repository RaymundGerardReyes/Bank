import React from "react";
import { Card } from "@/components/ui/Card";

export default async function AccountStatementDetailPage({ params }: { params: Promise<{ accountNumber: string }> }) {
  const { accountNumber } = await params;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-100">Account Statements</h1>
      <Card title={`Account ${accountNumber} Statement Archive`}>
        <p className="text-slate-300">Historical PDF statements for account {accountNumber}.</p>
      </Card>
    </div>
  );
}
