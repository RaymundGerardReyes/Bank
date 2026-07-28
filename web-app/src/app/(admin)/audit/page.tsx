import React from "react";
import { Card } from "@/components/common/Card";

export default function AdminAuditPage() {
  const auditLogs = [
    { id: "log-1", action: "TRANSFER_EXECUTE", actor: "user_admin", timestamp: "2026-07-28 21:00:15", status: "SUCCESS" },
    { id: "log-2", action: "AUTH_LOGIN", actor: "user_client1", timestamp: "2026-07-28 20:45:02", status: "SUCCESS" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-slate-100">Admin Audit Trail</h1>
      <Card title="Security Event Log">
        <div className="flex flex-col gap-3">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex justify-between items-center p-3 bg-slate-900 border border-slate-700 rounded-lg text-sm">
              <div>
                <span className="font-mono text-sky-400 font-bold">{log.action}</span>
                <span className="text-slate-400 ml-3">By {log.actor}</span>
              </div>
              <span className="text-xs text-slate-500">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
