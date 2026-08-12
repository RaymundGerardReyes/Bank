"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/state/authStore";
import { useRouter, usePathname } from "next/navigation";

interface RoleGuardProps {
  allowedRoles: Array<"USER" | "ADMIN" | "TELLER" | "MERCHANT" | "OPS_OFFICER">;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children, fallback }) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthorized = user && allowedRoles.includes(user.role as any);

  useEffect(() => {
    if (!isAuthorized && fallback === undefined) {
      // If unauthorized and no custom fallback is provided, force redirect to login
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthorized, fallback, router, pathname]);

  if (!isAuthorized) {
    return fallback !== undefined ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};
