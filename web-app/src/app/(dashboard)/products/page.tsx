import React from "react";
import { Card } from "@/components/common/Card";

export default function ProductsPage() {
  const products = [
    { title: "High-Yield Savings", rate: "4.50% APY", desc: "No minimum balance, FDIC insured." },
    { title: "Premium Checking", rate: "0.25% APY", desc: "Unlimited transfers and fee waivers." },
    { title: "Fixed CD 12-Month", rate: "5.10% APY", desc: "Guaranteed return on locked terms." },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-accent">Banking Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((prod, idx) => (
          <Card key={idx} title={prod.title}>
            <div className="text-2xl font-bold text-secondary mb-2">{prod.rate}</div>
            <p className="text-sm text-accent/80">{prod.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
