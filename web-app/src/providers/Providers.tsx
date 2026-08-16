"use client";

import React, { useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

// Singleton ref pattern — avoids creating a new QueryClient on every render
// and avoids the "useState is null" crash during Next.js static prerender workers.
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new client (never reuse between requests)
    return makeQueryClient();
  }
  // Browser: create once and reuse for the lifetime of the tab
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: Do NOT use useState here. The singleton pattern above is safe
  // for both SSR and CSR and avoids the "Cannot read properties of null
  // (reading 'useState')" prerender error caused by duplicate React copies.
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
