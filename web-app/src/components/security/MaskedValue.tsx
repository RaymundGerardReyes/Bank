"use client";

import React from "react";
import { useUIStore } from "@/state/uiStore";

interface MaskedValueProps {
  value: string;
  maskedPlaceholder?: string;
}

export const MaskedValue: React.FC<MaskedValueProps> = ({ value, maskedPlaceholder = "****" }) => {
  const { maskSensitiveData } = useUIStore();

  return <span>{maskSensitiveData ? maskedPlaceholder : value}</span>;
};
