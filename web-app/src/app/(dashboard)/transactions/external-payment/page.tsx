"use client";

import React from "react";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export default function ExternalPaymentPage() {
  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-100">External Wire & Payment</h1>
      <Card title="Wire Transfer Details">
        <form className="flex flex-col gap-4">
          <Input label="Routing / SWIFT Code" placeholder="ROUT12345" required />
          <Input label="Destination Account" placeholder="9988776655" required />
          <Input label="Amount (USD)" type="number" placeholder="0.00" required />
          <Button type="submit">Submit External Payment</Button>
        </form>
      </Card>
    </div>
  );
}
