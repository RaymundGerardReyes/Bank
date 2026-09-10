"use client";

import React, { useEffect, useState } from "react";
import { useUIStore } from "@/state/uiStore";

interface MaskedBalanceProps {
  amount: number;
  currency?: string;
  className?: string;
  decimals?: number;
}

export const MaskedBalance: React.FC<MaskedBalanceProps> = ({
  amount,
  currency = "$",
  className = "",
  decimals = 2,
}) => {
  const { maskSensitiveData } = useUIStore();
  const [displayValue, setDisplayValue] = useState(amount);

  useEffect(() => {
    let start = displayValue;
    const end = amount;
    if (start === end) return;

    const duration = 500; // milliseconds
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(start + (end - start) * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    const animFrame = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animFrame);
  }, [amount]);

  return (
    <div className={`relative inline-flex items-center transition-all duration-300 ${className}`}>
      <span
        className={`transition-all duration-300 font-numeric ${
          maskSensitiveData ? "blur-md select-none opacity-20 scale-95" : "blur-0 opacity-100 scale-100"
        }`}
      >
        {currency}
        {displayValue.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
      </span>
      {maskSensitiveData && (
        <span className="absolute inset-0 flex items-center justify-center font-mono text-accent/80 tracking-widest text-base animate-pulse">
          ••••••••
        </span>
      )}
    </div>
  );
};
