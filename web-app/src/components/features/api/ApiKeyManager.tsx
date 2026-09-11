"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useAccounts } from "@/hooks/useAccounts";
import { ShieldCheck } from "lucide-react";

import { ApiKey, MerchantStatus, OnboardingSuccessData } from "./types";
import { CommercialProfileForm } from "./CommercialProfileForm";
import { ApiKeyEmptyState } from "./ApiKeyEmptyState";
import { ApiKeyVaultAlert } from "./ApiKeyVaultAlert";
import { ApiKeyCreateForm } from "./ApiKeyCreateForm";
import { ApiKeyList } from "./ApiKeyList";
import { useApiKeyOperations } from "./hooks/useApiKeyOperations";

/**
 * ApiKeyManager — top-level orchestrator for the API credential section.
 *
 * One canonical path to create a credential: the "+ Create New Key" button
 * which opens ApiKeyCreateForm.
 *
 * Commercial profile and developer workspace registration are handled INLINE
 * via CommercialProfileForm — completely eliminating popups and modals.
 * Completely eliminates separate drawers, modals, and competing buttons.
 */
export const ApiKeyManager: React.FC = () => {
  const { data: accounts } = useAccounts();
  const {
    keys,
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
  } = useApiKeyOperations();

  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleOnboardSuccess = (data: OnboardingSuccessData) => {
    setMerchantStatus({
      hasMerchantProfile: true,
      verified: true,
      legalName: data.legalName,
      businessRegistrationNumber: data.businessRegistrationNumber,
      settlementAccountNumber: data.settlementAccountNumber,
      status: "ACTIVE",
      eligibleForLive: data.onboardingType === "MERCHANT" || data.environment === "LIVE",
    });
    setNeedsOnboarding(false);
    fetchKeys();
    fetchMerchantStatus();
  };

  const handleSubmitCreateKey = async (formData: Parameters<typeof handleCreateKey>[0]) => {
    const success = await handleCreateKey(formData);
    if (success) {
      setShowCreateForm(false);
    }
  };

  const handleCancelCreateForm = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {needsOnboarding ? (
        <ApiKeyEmptyState onSuccess={handleOnboardSuccess} />
      ) : (
        <Card>
          {/* ── Header ────────────────────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-secondary/20 pb-5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-2xl font-black text-accent tracking-tight">
                  API Keys & Security Controls
                </h3>
                <span className="px-2.5 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-extrabold rounded-full border border-sky-200 uppercase tracking-wider">
                  Direct VAM Scope
                </span>
                {merchantStatus?.eligibleForLive ? (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full border border-emerald-300 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Merchant: {merchantStatus.legalName}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full border border-slate-200 uppercase tracking-wider">
                    Developer Sandbox Active
                  </span>
                )}
              </div>
              <p className="text-sm text-accent/70 font-medium max-w-2xl">
                Manage API credentials. Scope each credential to a specific VAM account with IP CIDR whitelisting and permission scopes.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {!showCreateForm && !newlyGeneratedKey && (
                <Button onClick={() => setShowCreateForm(true)}>
                  + Create New Key
                </Button>
              )}
            </div>
          </div>

          {errorMsg && <ErrorBanner message={errorMsg} onClose={() => setErrorMsg(null)} />}

          {/* ── Vault Alert for newly generated key ─────────────────────── */}
          {newlyGeneratedKey && (
            <ApiKeyVaultAlert
              newlyGeneratedKey={newlyGeneratedKey}
              onDismiss={() => setNewlyGeneratedKey(null)}
            />
          )}

          {/* ── The ONE canonical credential creation form ───────────────── */}
          {showCreateForm && !newlyGeneratedKey && (
            <ApiKeyCreateForm
              accounts={accounts}
              merchantStatus={merchantStatus}
              isGenerating={isGenerating}
              onSuccessDirect={(newKey) => {
                setNewlyGeneratedKey(newKey);
                setShowCreateForm(false);
                fetchKeys();
                fetchMerchantStatus();
              }}
              onMerchantStatusUpdate={(status) => {
                setMerchantStatus(status);
                fetchMerchantStatus();
              }}
              onSubmit={handleSubmitCreateKey}
              onCancel={handleCancelCreateForm}
            />
          )}

          {/* ── Keys list ────────────────────────────────────────────────── */}
          <ApiKeyList
            keys={keys}
            isLoading={isLoading}
            isGenerating={isGenerating}
            activeFilter={activeFilter}
            searchQuery={searchQuery}
            onFilterChange={setActiveFilter}
            onSearchChange={setSearchQuery}
            onRotateKey={handleRotateKey}
            onRevokeKey={revokeKey}
            onDeleteKey={deleteKey}
          />
        </Card>
      )}
    </div>
  );
};

// Re-exports for backward compatibility with existing tests and imports
export { CommercialProfileForm as MerchantOnboardingForm, CommercialProfileForm as DeveloperOnboardPage, CommercialProfileForm as OnboardingPage } from "./CommercialProfileForm";
export type { ApiKey, MerchantStatus, OnboardingSuccessData, MerchantOnboardingFormProps } from "./types";
export default ApiKeyManager;
