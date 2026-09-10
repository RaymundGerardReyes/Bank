"use client";

import { usePathname } from "next/navigation";
import React from "react";

export const PageTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className={`animate-scale-up transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};
