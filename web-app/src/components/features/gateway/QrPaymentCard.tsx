import React, { useEffect, useState } from "react";
import { DynamicQrPayment } from "@/models/GatewayModels";

export const QrPaymentCard: React.FC<{ qrPayment: DynamicQrPayment }> = ({ qrPayment }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const isExpiredOrFinal = qrPayment.status !== "CREATED" && qrPayment.status !== "ACTIVE";

  useEffect(() => {
    if (isExpiredOrFinal) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiration = new Date(qrPayment.expiresAt).getTime();
      const difference = expiration - now;

      if (difference <= 0) {
        setTimeLeft("00:00");
      } else {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [qrPayment.expiresAt, isExpiredOrFinal]);

  const getStatusColor = () => {
    switch (qrPayment.status) {
      case "ACTIVE":
        return "bg-sky-50 text-sky-600 border-sky-200";
      case "SCANNED":
        return "bg-violet-50 text-violet-600 border-violet-200";
      case "PAID":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "EXPIRED":
      case "CANCELLED":
        return "bg-rose-50 text-rose-600 border-rose-200";
      default:
        return "bg-secondary/10 text-accent/70 border-secondary/30";
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-surface border border-secondary/30 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-accent text-dominant flex items-center justify-between">
        <h3 className="font-extrabold tracking-tight">QR Ph P2M</h3>
        <span className="text-xs font-bold opacity-70">
          Ref: {qrPayment.qrReference.substring(0, 8)}...
        </span>
      </div>

      {/* QR Code Area (Mocked visually for now) */}
      <div className="p-8 flex flex-col items-center justify-center border-b border-secondary/20 bg-white">
        <div className={`w-48 h-48 rounded-lg flex items-center justify-center relative ${isExpiredOrFinal ? 'opacity-30' : ''}`}>
           {/* Decorative generic QR-like pattern */}
           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwRjJDNTkiPjwvcmVjdD4KPC9zdmc+')] opacity-80" />
           {/* Center Logo marker (optional) */}
           <div className="w-10 h-10 bg-dominant border border-accent rounded z-10 flex items-center justify-center text-accent font-black text-xl">
             N
           </div>
        </div>

        {/* Overlay for expired/paid states */}
        {isExpiredOrFinal && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-20">
             <div className={`px-4 py-2 rounded-lg font-black tracking-widest text-lg border-2 shadow-xl ${getStatusColor()} uppercase transform -rotate-12`}>
               {qrPayment.status}
             </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col gap-3">
         <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-accent/60">Status</span>
            <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded border ${getStatusColor()}`}>
              {qrPayment.status}
            </span>
         </div>
         
         {!isExpiredOrFinal && (
           <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-accent/60">Expires in</span>
              <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                {timeLeft || "..."}
              </span>
           </div>
         )}
         
         <div className="mt-2 text-[10px] font-mono text-accent/40 break-all p-2 bg-secondary/10 rounded">
            {qrPayment.qrPayload.substring(0, 40)}...
         </div>
      </div>
    </div>
  );
};
