"use client";

import { useAuthStore } from "@/state/authStore";

export function useAuth() {
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();
  return { user, isAuthenticated, setUser, clearAuth };
}
