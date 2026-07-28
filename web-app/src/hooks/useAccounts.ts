"use client";

import { useQuery } from "@tanstack/react-query";
import { accountService } from "@/services/account/accountService";

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await accountService.getAccounts();
      return res.data;
    },
  });
}
