"use client";

import React from "react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

export default function TransferReviewPage() {
  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-100">Review Transfer Details</h1>
      <Card title="Transfer Summary">
        <div className="flex flex-col gap-3 text-sm text-slate-300 mb-6">
          <div className="flex justify-between"><span>Source Account:</span><span className="font-mono">1001987654</span></div>
          <div className="flex justify-between"><span>Recipient:</span><span className="font-mono">2001987655</span></div>
          <div className="flex justify-between font-bold text-slate-100"><span>Amount:</span><span>$450.00</span></div>
        </div>
        <Button className="w-full">Confirm & Execute Transfer</Button>
      </Card>
    </div>
  );
}
