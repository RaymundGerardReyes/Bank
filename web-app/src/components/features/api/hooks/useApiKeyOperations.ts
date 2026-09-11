"use client";

import { useState, useEffect, useCallback } from "react";
import { ApiKey, MerchantStatus, NewlyGeneratedKeyData } from "../types";

export interface CreateKeyParams {
  name: string;
  applicationId?: string;
  environment: "LIVE" | "SANDBOX";
  linkedAccountId: string;
  ipWhitelist: string;
  selectedScopes: string[];
  perTxLimit?: string;
  dailyLimit?: string;
}

export function useApiKeyOperations() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<NewlyGeneratedKeyData | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [merchantStatus, setMerchantStatus] = useState<MerchantStatus | null>(null);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "LIVE" | "SANDBOX">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMerchantStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/proxy/apikeys/merchant-status");
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        if (data) {
          setMerchantStatus({
            hasMerchantProfile: Boolean(data.hasMerchantProfile ?? data.hasMerchant),
            verified: Boolean(data.verified ?? data.isVerified),
            eligibleForLive: Boolean(data.eligibleForLive ?? data.isVerified ?? data.verified),
            legalName: data.legalName || null,
            merchantCode: data.merchantCode || null,
            businessRegistrationNumber: data.businessRegistrationNumber || null,
            settlementAccountNumber: data.settlementAccountNumber || data.settlementAccount || null,
            status: data.status || null,
          });
        } else {
          setMerchantStatus(null);
        }
      }
    } catch (err) {
      console.warn("Could not fetch merchant status", err);
    }
  }, []);

  const fetchKeys = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/proxy/apikeys");
      const json = await res.json();
      if (res.ok) {
        setKeys(json.data || []);
      } else {
        if (res.status === 404) {
          setNeedsOnboarding(true);
        } else {
          setErrorMsg(json.message || json.error?.message || "Failed to load API keys");
        }
      }
    } catch (err: any) {
      console.error("Failed to load API keys", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
    fetchMerchantStatus();
  }, [fetchKeys, fetchMerchantStatus]);

  const validateCidr = (cidrStr: string): boolean => {
    if (!cidrStr || cidrStr.trim() === "" || cidrStr === "0.0.0.0/0") return true;
    const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    return cidrStr.split(",").every((p) => cidrRegex.test(p.trim()));
  };

  const getFormattedErrorMessage = (rawError: string): string => {
    if (rawError.includes("ACCOUNT_NOT_AUTHORIZED") || rawError.includes("ERR_GATEWAY_004")) {
      return "Account Authorization Error: The targeted account is not authorized or bound to this credential's policy.";
    }
    if (rawError.includes("ENVIRONMENT_MISMATCH") || rawError.includes("ERR_GATEWAY_005")) {
      return "Environment Boundary Error: Live keys cannot interact with Sandbox environments, and vice versa.";
    }
    if (rawError.includes("IP_NOT_WHITELISTED") || rawError.includes("ERR_GATEWAY_002")) {
      return "Source IP Denied: Client IP does not fall within the authorized CIDR range.";
    }
    if (rawError.includes("INSUFFICIENT_API_SCOPE") || rawError.includes("ERR_GATEWAY_003")) {
      return "Scope Enforcement Error: The API key lacks the required permission scope for this action.";
    }
    return rawError;
  };

  const handleCreateKey = async (params: CreateKeyParams): Promise<boolean> => {
    setErrorMsg(null);

    if (!params.name.trim()) {
      setErrorMsg("Key name is required.");
      return false;
    }
    if (!params.linkedAccountId || params.linkedAccountId === "ALL") {
      setErrorMsg("API Credential Account Scope selection is required. API Keys must be scoped to an eligible VAM sub-account.");
      return false;
    }
    if (params.ipWhitelist.trim() && !validateCidr(params.ipWhitelist)) {
      setErrorMsg("Invalid CIDR format. Use standard notation like 192.168.1.0/24 or comma-separated IPs.");
      return false;
    }
    if (params.environment === "LIVE" && !merchantStatus?.eligibleForLive) {
      setErrorMsg("LIVE production credentials require an active, verified commercial merchant profile. Click \"Register Commercial Profile\" above to complete registration.");
      return false;
    }

    setIsGenerating(true);
    try {
      const payload: Record<string, any> = {
        name: params.name.trim(),
        applicationId: params.applicationId?.trim() || undefined,
        applicationName: params.name.trim(),
        environment: params.environment,
        cidrWhitelist: params.ipWhitelist.trim() || "0.0.0.0/0",
        scopes: params.selectedScopes,
        linkedAccountId: params.linkedAccountId,
      };

      if (params.perTxLimit?.trim() && !isNaN(Number(params.perTxLimit))) {
        payload.perTransactionLimit = Number(params.perTxLimit);
      }
      if (params.dailyLimit?.trim() && !isNaN(Number(params.dailyLimit))) {
        payload.dailyLimit = Number(params.dailyLimit);
      }

      const res = await fetch("/api/proxy/apikeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error?.message || json.message || "Failed to generate Key");
      }

      const createdKey: ApiKey = json.data;
      setKeys((prev) => [createdKey, ...prev]);
      setNewlyGeneratedKey({
        name: createdKey.name,
        rawKey: createdKey.rawKey || "",
        environment: createdKey.environment,
        linkedAccountId: createdKey.linkedAccountId,
        scopes: createdKey.scopes,
      });
      return true;
    } catch (err: any) {
      setErrorMsg(getFormattedErrorMessage(err.message || "Key generation failed."));
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRotateKey = async (id: number) => {
    const confirmRotate = window.confirm(
      "Are you sure? This will instantly revoke the current key and generate a new one with identical security policies."
    );
    if (!confirmRotate) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/proxy/apikeys/${id}/rotate`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      const rotatedKey: ApiKey = json.data;
      setNewlyGeneratedKey({
        name: rotatedKey.name,
        rawKey: rotatedKey.rawKey || "",
        environment: rotatedKey.environment,
        linkedAccountId: rotatedKey.linkedAccountId,
        scopes: rotatedKey.scopes,
      });
      await fetchKeys();
    } catch (err: any) {
      alert(err.message || "Failed to rotate key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const revokeKey = async (id: number) => {
    if (
      !window.confirm(
        "Revoking this key will instantly terminate all active API traffic using it. Continue?"
      )
    )
      return;
    try {
      await fetch(`/api/proxy/apikeys/${id}/revoke`, { method: "POST" });
      setKeys((prev) =>
        prev.map((k: ApiKey) =>
          k.id === id ? { ...k, revokedAt: new Date().toISOString() } : k
        )
      );
    } catch (err) {
      alert("Failed to revoke key.");
    }
  };

  const deleteKey = async (id: number) => {
    if (
      !window.confirm(
        "Permanently delete this key record? This action is irreversible."
      )
    )
      return;
    try {
      const res = await fetch(`/api/proxy/apikeys/${id}`, { method: "DELETE" });
      if (res.ok) {
        setKeys((prev) => prev.filter((k: ApiKey) => k.id !== id));
      }
    } catch (err) {
      alert("Failed to delete key.");
    }
  };

  return {
    keys,
    setKeys,
    isLoading,
    isGenerating,
    errorMsg,
    setErrorMsg,
    newlyGeneratedKey,
    setNewlyGeneratedKey,
    needsOnboarding,
    setNeedsOnboarding,
    merchantStatus,
    setMerchantStatus,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    fetchKeys,
    fetchMerchantStatus,
    handleCreateKey,
    handleRotateKey,
    revokeKey,
    deleteKey,
    validateCidr,
    getFormattedErrorMessage,
  };
}

