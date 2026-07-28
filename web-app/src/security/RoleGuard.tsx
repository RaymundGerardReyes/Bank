"use client";

import React from "react";
import { useAuthStore } from "@/state/authStore";

interface RoleGuardProps {
  allowedRoles: Array<"USER" | "ADMIN" | "TELLER">;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children, fallback = null }) => {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
