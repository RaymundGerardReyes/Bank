"use client";

import React from "react";
import {
  KeyRound,
  RefreshCw,
  Search,
} from "lucide-react";
import { ApiKey } from "./types";
import { ApiKeyCard } from "./ApiKeyCard";

export interface ApiKeyListProps {
  keys: ApiKey[];
  isLoading: boolean;
  isGenerating: boolean;
  activeFilter: "ALL" | "LIVE" | "SANDBOX";
  searchQuery: string;
  onFilterChange: (filter: "ALL" | "LIVE" | "SANDBOX") => void;
  onSearchChange: (query: string) => void;
  onRotateKey: (id: number) => void;
  onRevokeKey: (id: number) => void;
  onDeleteKey: (id: number) => void;
}

export const ApiKeyList: React.FC<ApiKeyListProps> = ({
  keys,
  isLoading,
  isGenerating,
  activeFilter,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onRotateKey,
  onRevokeKey,
  onDeleteKey,
}) => {
  const filteredKeys = keys.filter((k) => {
    if (activeFilter === "LIVE" && k.environment !== "LIVE") return false;
    if (activeFilter === "SANDBOX" && k.environment !== "SANDBOX") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = k.name?.toLowerCase().includes(q);
      const matchHash = k.maskedHash?.toLowerCase().includes(q);
      const matchAcct = k.linkedAccountId?.toLowerCase().includes(q);
      const matchApp = k.applicationName?.toLowerCase().includes(q);
      if (!matchName && !matchHash && !matchAcct && !matchApp) return false;
    }
    return true;
  });

  const liveKeysCount = keys.filter((k) => k.environment === "LIVE").length;
  const sandboxKeysCount = keys.filter((k) => k.environment === "SANDBOX").length;

  return (
    <div className="flex flex-col gap-4">
      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-1.5 bg-surface p-1 rounded-xl border border-secondary/30">
          <button
            type="button"
            onClick={() => onFilterChange("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              activeFilter === "ALL"
                ? "bg-white text-accent shadow-sm"
                : "text-accent/60 hover:text-accent"
            }`}
          >
            All Keys ({keys.length})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("LIVE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 ${
              activeFilter === "LIVE"
                ? "bg-white text-rose-700 shadow-sm"
                : "text-accent/60 hover:text-accent"
            }`}
          >
            Live ({liveKeysCount})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("SANDBOX")}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 ${
              activeFilter === "SANDBOX"
                ? "bg-white text-sky-700 shadow-sm"
                : "text-accent/60 hover:text-accent"
            }`}
          >
            Sandbox ({sandboxKeysCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-accent/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keys by name or scope..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-surface border border-secondary/30 rounded-xl text-xs font-medium text-accent outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Keys List Rendering */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="p-10 text-center bg-surface rounded-2xl border border-secondary/30">
            <RefreshCw className="w-6 h-6 text-sky-600 animate-spin mx-auto mb-2" />
            <p className="text-accent/70 font-bold text-sm">
              Querying Vault Security Policies...
            </p>
          </div>
        ) : filteredKeys.length === 0 ? (
          <div className="p-10 text-center bg-surface rounded-2xl border border-secondary/30 flex flex-col items-center gap-2">
            <KeyRound className="w-8 h-8 text-accent/30" />
            <p className="text-accent/70 font-bold text-sm">
              No active API keys found in database.
            </p>
            <p className="text-accent/50 text-xs font-medium">
              Click &quot;+ Create New Key&quot; to provision cryptographic credentials.
            </p>
          </div>
        ) : (
          filteredKeys.map((key) => (
            <ApiKeyCard
              key={key.id}
              apiKey={key}
              isGenerating={isGenerating}
              onRotate={onRotateKey}
              onRevoke={onRevokeKey}
              onDelete={onDeleteKey}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ApiKeyList;

