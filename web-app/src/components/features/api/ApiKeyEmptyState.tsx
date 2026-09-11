"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Zap } from "lucide-react";
import { OnboardingSuccessData } from "./types";
import { CommercialProfileForm } from "./CommercialProfileForm";

export interface ApiKeyEmptyStateProps {
  onSuccess: (data: OnboardingSuccessData) => void;
}

/**
 * ApiKeyEmptyState — first-time workspace activation.
 *
 * Shown when the user has no existing API workspace. Embeds the developer
 * workspace registration form directly inline — no modals, no popups.
 */
export const ApiKeyEmptyState: React.FC<ApiKeyEmptyStateProps> = ({
  onSuccess,
}) => {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <Card>
        <div className="flex flex-col gap-6 p-2 sm:p-4">
          <div className="flex items-center gap-3 border-b border-secondary/20 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-sky-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-black text-accent tracking-tight">
                Set Up Your Developer Workspace
              </h3>
              <p className="text-accent/70 font-medium text-xs sm:text-sm">
                Activate your developer workspace to generate secure API credentials and automated VAM settlement accounts.
              </p>
            </div>
          </div>

          <CommercialProfileForm
            mode="SANDBOX"
            onSuccess={onSuccess}
          />
        </div>
      </Card>
    </div>
  );
};

export default ApiKeyEmptyState;
