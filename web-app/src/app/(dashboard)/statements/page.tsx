"use client";

import React from "react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

export default function StatementsPage() {
  const statements = [
    { id: "stmt-1", period: "July 2026", account: "**** 7654" },
    { id: "stmt-2", period: "June 2026", account: "**** 7654" },
    { id: "stmt-3", period: "May 2026", account: "**** 7654" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-100">Account Statements</h1>
      <Card title="Monthly PDF Statements">
        <div className="flex flex-col gap-4">
          {statements.map((stmt) => (
            <div
              key={stmt.id}
              className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-lg"
            >
              <div>
                <h4 className="font-semibold text-slate-200">{stmt.period}</h4>
                <span className="text-xs text-slate-400">Account {stmt.account}</span>
              </div>
              <Button variant="secondary">Download PDF</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
