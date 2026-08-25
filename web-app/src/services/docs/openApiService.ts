import { env } from "@/server/config/env";

export const openApiService = {
  fetchSpec: async (): Promise<Record<string, unknown>> => {
    const res = await fetch(env.openApiSpecUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch OpenAPI spec from ${env.openApiSpecUrl}`);
    }
    return res.json();
  },
};
