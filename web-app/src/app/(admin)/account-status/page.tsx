import React from "react";
import { Card } from "@/components/common/Card";

export default function AdminAccountStatusPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-100">Account Status Management</h1>
      <Card title="Freeze / Unfreeze Controls">
        <p className="text-sm text-slate-300">Administrative tools to freeze, unfreeze, or lock customer banking accounts.</p>
      </Card>
    </div>
  );
}
