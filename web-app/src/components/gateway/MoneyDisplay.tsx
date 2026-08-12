import React from "react";
import { formatCurrency } from "@/utils/formatters";

interface MoneyDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
  hideCents?: boolean;
}

export const MoneyDisplay: React.FC<MoneyDisplayProps> = ({
  amount,
  currency = "PHP",
  className = "",
  hideCents = false,
}) => {
  // We use the existing formatter, but potentially adjust it for the specific PHP requirements
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: hideCents ? 0 : 2,
    maximumFractionDigits: hideCents ? 0 : 2,
  }).format(amount);

  // The symbol is usually '₱' for PHP
  const symbol = formatted.substring(0, 1); // Extract the symbol
  const value = formatted.substring(1); // Extract the rest

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span className="text-sm opacity-70 mr-0.5">{symbol}</span>
      <span>{value}</span>
    </span>
  );
};
