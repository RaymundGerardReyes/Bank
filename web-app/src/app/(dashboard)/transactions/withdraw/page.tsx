"use client";

import React from "react";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export default function WithdrawPage() {
  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-100">Withdraw Funds</h1>
      <Card title="ATM / Bank Transfer Withdrawal">
        <form className="flex flex-col gap-4">
          <Input label="Source Account" value="1001987654" readOnly />
          <Input label="Withdrawal Amount (USD)" type="number" placeholder="0.00" required />
          <Button type="submit">Submit Withdrawal</Button>
        </form>
      </Card>
    </div>
  );
}
