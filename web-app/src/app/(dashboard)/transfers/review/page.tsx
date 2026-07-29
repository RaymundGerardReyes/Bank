"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

interface TransferSession {
  sourceAccountNumber: string;
  recipientAccountNumber: string;
  amount: number;
  description?: string;
  scheduledDate?: string;
  idempotencyKey: string;
}

export default function TransferReviewPage() {
  const router = useRouter();
  const [session, setSession] = useState<TransferSession | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = sessionStorage.getItem("pending_transfer_session");
      if (raw) {
        try {
          setSession(JSON.parse(raw));
        } catch {
          router.push("/transfers");
        }
      } else {
        router.push("/transfers");
      }
    }
  }, [router]);

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-accent/60 font-medium">
        Loading transfer review...
      </div>
    );
  }

  const traceRef = session.idempotencyKey ? session.idempotencyKey.split("-")[0] : "REF-N/A";

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-accent">Review Transfer</h1>

      <Card title="Step 2: Verify Transfer Details">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-accent/70 font-medium">
            Please review the details below before proceeding to passkey authorization.
          </p>

          <div className="p-4 bg-surface rounded-xl border border-secondary/30 flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-accent/60">From Account:</span>
              <span className="font-bold text-accent">{session.sourceAccountNumber}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-accent/60">Recipient Account:</span>
              <span className="font-bold text-accent">{session.recipientAccountNumber}</span>
            </div>
            {session.description && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-accent/60">Memo:</span>
                <span className="font-bold text-accent">{session.description}</span>
              </div>
            )}
            {session.scheduledDate && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-accent/60">Execution:</span>
                <span className="font-bold text-sky-600">Scheduled for {new Date(session.scheduledDate).toLocaleString()}</span>
              </div>
            )}
            <div className="w-full h-px bg-secondary/30 my-1"></div>
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-accent">Total Amount:</span>
              <span className="text-2xl font-black text-accent">${session.amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center text-xs font-mono font-bold text-accent/50">
            Trace Ref: {traceRef}
          </div>

          <div className="flex gap-4 mt-2">
            <Button variant="secondary" onClick={() => router.push("/transfers")}>
              ← Edit Details
            </Button>
            <Button onClick={() => router.push("/transfers/confirm")} className="flex-1">
              Proceed to Passkey Step-Up →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
