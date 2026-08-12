"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { QrPaymentCard } from "@/components/gateway/QrPaymentCard";
import { paymentService } from "@/services/gateway/paymentService";
import { DynamicQrPayment } from "@/models/GatewayModels";

const schema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  reference: z.string().min(1, "Reference is required"),
});

type FormData = z.infer<typeof schema>;

export default function CreateQrPaymentPage() {
  const [qrPayment, setQrPayment] = useState<DynamicQrPayment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0 },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError("");
    try {
      // 1. In a real flow, we would create a PaymentIntent first if one doesn't exist,
      // but for this UI demo we assume the API creates it or we mock the flow.
      // Assuming a generic creation flow for the demo:
      const intentRes = await fetch('/api/proxy/gateway/payments', { 
         method: 'POST', 
         body: JSON.stringify({ amount: data.amount, currency: 'PHP', merchantId: 1, channel: 'QR_PH_P2M' }) // Mock body
      }).then(r => r.json());
      
      const intentId = intentRes.data?.intentId || "mock-intent-id";

      // 2. Generate the QR for the intent
      const qrRes = await paymentService.generateQr(intentId);
      
      if (qrRes.success && qrRes.data) {
        setQrPayment(qrRes.data);
        
        // Start polling for status changes (mocked)
        const pollInterval = setInterval(async () => {
           try {
             const statusRes = await paymentService.getQrStatus(qrRes.data.qrReference);
             if (statusRes.data) {
                setQrPayment(statusRes.data);
                if (statusRes.data.status === 'PAID' || statusRes.data.status === 'EXPIRED') {
                  clearInterval(pollInterval);
                }
             }
           } catch(e) {
             console.error("Polling error", e);
           }
        }, 5000);
      } else {
        setError(qrRes.message || "Failed to generate QR");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-black text-accent">Create QR Payment</h1>
        <p className="text-accent/60 font-medium">Generate a dynamic QR Ph P2M for a customer to scan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface border border-secondary/20 rounded-2xl p-6 shadow-sm">
          {error && <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Amount (PHP)"
              type="number"
              step="0.01"
              error={errors.amount?.message}
              {...register("amount", { valueAsNumber: true })}
            />
            
            <Input
              label="Reference"
              placeholder="e.g. INV-2026-000123"
              error={errors.reference?.message}
              {...register("reference")}
            />
            
            <div className="pt-4">
              <Button type="submit" isLoading={isSubmitting} className="w-full py-3">
                Generate QR
              </Button>
            </div>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center">
          {qrPayment ? (
            <QrPaymentCard qrPayment={qrPayment} />
          ) : (
            <div className="w-full max-w-sm aspect-square border-2 border-dashed border-secondary/30 rounded-2xl flex flex-col items-center justify-center text-accent/30 gap-4">
               <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4" />
               </svg>
               <span className="font-bold">Enter details to generate</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
