import React from "react";
import { Card } from "@/components/ui/Card";

export default function ProfileDevicesPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-100">Registered Devices</h1>
      <Card title="Active Sessions">
        <p className="text-sm text-slate-300">View and revoke active sessions and registered trusted web/mobile clients.</p>
      </Card>
    </div>
  );
}
