"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Statement } from "@/models/ApiResponse";
import { accountService } from "@/services/account/accountService";
import { statementService } from "@/services/statement/statementService";
import { useEffect, useState } from "react";

export default function StatementsPage() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const accRes = await accountService.getAccounts();
        if (accRes.data && accRes.data.length > 0) {
          const primaryAcc = accRes.data[0].accountNumber;
          const stmtRes = await statementService.getStatements(primaryAcc);
          if (stmtRes.data) {
            setStatements(stmtRes.data);
          }
        }
      } catch (e) {
        console.error("Failed to load statements", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-accent">Account Statements</h1>
      <Card title="Monthly PDF Statements">

        {loading ? (
          <p className="text-sm font-medium text-accent/60 animate-pulse">Retrieving secure documents...</p>
        ) : statements.length === 0 ? (
          <p className="text-sm font-medium text-accent/60">No statements available.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {statements.map((stmt) => {
              const rawDate = stmt.startDate || stmt.periodStart || stmt.generatedAt;
              const period = rawDate ? new Date(rawDate).toLocaleString('default', { month: 'long', year: 'numeric' }) : "Monthly Statement";
              const maskedAcc = stmt.accountNumber ? "**** " + stmt.accountNumber.slice(-4) : "****";

              return (
                <div key={stmt.id} className="flex items-center justify-between p-4 bg-surface border border-secondary/30 rounded-lg">
                  <div>
                    <h4 className="font-bold text-accent">{period}</h4>
                    <span className="text-xs font-bold text-accent/60">Account {maskedAcc}</span>
                  </div>
                  <Button variant="secondary" onClick={() => stmt.pdfUrl || stmt.downloadUrl ? window.open(stmt.pdfUrl || stmt.downloadUrl, '_blank') : null}>Download PDF</Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}