import React from "react";
import { PaymentIntentStatus } from "@/models/GatewayModels";

export const PaymentStatusBadge: React.FC<{ status: PaymentIntentStatus | string; className?: string }> = ({
  status,
  className = "",
}) => {
  const getStyles = (s: PaymentIntentStatus | string) => {
    switch (s) {
      case "CAPTURED":
      case "SETTLED":
        return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";
      case "FAILED":
      case "CANCELLED":
        return "bg-rose-500/20 text-rose-500 border-rose-500/30";
      case "EXPIRED":
      case "REFUNDED":
        return "bg-amber-500/20 text-amber-500 border-amber-500/30";
      case "PENDING":
      case "AUTHORIZED":
        return "bg-sky-500/20 text-sky-500 border-sky-500/30";
      case "QR_GENERATED":
        return "bg-violet-500/20 text-violet-500 border-violet-500/30";
      case "CREATED":
      default:
        return "bg-secondary/20 text-accent/70 border-secondary/30";
    }
  };

  const getLabel = (s: PaymentIntentStatus | string) => {
    switch (s) {
      case "QR_GENERATED":
        return "QR READY";
      default:
        return s.replace("_", " ");
    }
  };

  return (
    <span
      className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider border rounded-md whitespace-nowrap ${getStyles(
        status
      )} ${className}`}
    >
      {getLabel(status)}
    </span>
  );
};
