import React from "react";
import { Card } from "@/components/common/Card";

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-100">User Profile</h1>
      <Card title="Account Holder Information">
        <div className="flex flex-col gap-2 text-sm text-slate-300">
          <div><strong className="text-slate-100">Full Name:</strong> Enterprise Banking Client</div>
          <div><strong className="text-slate-100">Email:</strong> client@enterprise-bank.com</div>
          <div><strong className="text-slate-100">Auth Status:</strong> Verified (MFA Enabled)</div>
        </div>
      </Card>
    </div>
  );
}
