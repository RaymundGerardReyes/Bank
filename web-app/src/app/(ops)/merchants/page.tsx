"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/gateway/DataTable";
import { merchantService } from "@/services/gateway/merchantService";
import { Merchant } from "@/models/GatewayModels";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";

export default function OpsMerchantsPage() {
  const router = useRouter();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING">("ALL");

  useEffect(() => {
    setIsLoading(true);
    merchantService.listMerchants()
      .then(res => setMerchants(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredMerchants = merchants.filter(m => {
    if (filter === "PENDING") {
      return m.status !== "ACTIVE" && m.status !== "REJECTED";
    }
    return true;
  });

  const columns = [
    { header: "Merchant ID", accessorKey: "id" as keyof Merchant },
    { 
      header: "Code", 
      accessorKey: "merchantCode" as keyof Merchant,
      cell: (m: Merchant) => <span className="font-mono font-bold text-accent">{m.merchantCode}</span>
    },
    { header: "Legal Name", accessorKey: "legalName" as keyof Merchant },
    { 
      header: "KYB Status", 
      accessorKey: "status" as keyof Merchant,
      cell: (m: Merchant) => {
         const isActive = m.status === "ACTIVE";
         const isRejected = m.status === "REJECTED";
         const bg = isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                    isRejected ? "bg-rose-100 text-rose-700 border-rose-200" :
                    "bg-sky-100 text-sky-700 border-sky-200";
         
         return (
           <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${bg}`}>
             {m.status.replace("_", " ")}
           </span>
         );
      }
    },
    { 
      header: "Risk Profile", 
      accessorKey: "riskProfile" as keyof Merchant,
      cell: (m: Merchant) => (
         <span className={`font-bold ${m.riskProfile === 'HIGH' ? 'text-rose-500' : 'text-accent/60'}`}>
           {m.riskProfile || 'UNRATED'}
         </span>
      )
    },
    { 
      header: "Date Applied", 
      accessorKey: "createdAt" as keyof Merchant,
      cell: (m: Merchant) => <span className="text-xs">{new Date(m.createdAt).toLocaleDateString()}</span>
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-accent">Merchants</h1>
          <p className="text-accent/60 font-medium">Manage platform merchants and KYB onboarding</p>
        </div>
        <div className="flex gap-2">
           <Button variant={filter === "ALL" ? "primary" : "secondary"} onClick={() => setFilter("ALL")}>All</Button>
           <Button variant={filter === "PENDING" ? "primary" : "secondary"} onClick={() => setFilter("PENDING")}>Pending Review</Button>
        </div>
      </div>

      <DataTable
        data={filteredMerchants}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        searchKey="legalName"
        searchPlaceholder="Search by legal name..."
        emptyMessage="No merchants found matching filter."
        onRowClick={(m) => router.push(`/merchants/${m.id}`)}
      />
    </div>
  );
}
