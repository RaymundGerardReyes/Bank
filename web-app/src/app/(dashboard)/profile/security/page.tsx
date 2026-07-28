import React from "react";
import { Card } from "@/components/common/Card";

export default function ProfileSecurityPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-100">Security Settings</h1>
      <Card title="Authentication & Keys">
        <p className="text-sm text-slate-300">Manage two-factor authentication, password policies, and WebAuthn passkeys.</p>
      </Card>
    </div>
  );
}
