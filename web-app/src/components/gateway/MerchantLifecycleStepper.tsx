import React from "react";
import { MerchantLifecycleStage } from "@/models/GatewayModels";

const STAGES: MerchantLifecycleStage[] = [
  "APPLICATION",
  "KYB",
  "SCREENING",
  "RISK_ASSESSMENT",
  "COMPLIANCE_REVIEW",
  "APPROVED",
  "ACTIVE",
];

export const MerchantLifecycleStepper: React.FC<{ currentStage: MerchantLifecycleStage }> = ({
  currentStage,
}) => {
  const currentIndex = STAGES.indexOf(currentStage);

  // If the current stage is rejected or suspended, we might want to handle it differently,
  // but for simplicity, we'll just highlight the regular flow up to the point it stopped,
  // or we could show a generic error state. Let's assume standard happy-path progression for the stepper.
  const isErrorState = currentStage === "REJECTED" || currentStage === "SUSPENDED";
  const displayIndex = isErrorState ? -1 : currentIndex;

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-secondary/30 -translate-y-1/2 z-0" />

        {/* Progress Line */}
        {displayIndex > 0 && (
          <div
            className="absolute left-0 top-1/2 h-0.5 bg-accent transition-all duration-500 ease-in-out -translate-y-1/2 z-0"
            style={{ width: `${(displayIndex / (STAGES.length - 1)) * 100}%` }}
          />
        )}

        {STAGES.map((stage, index) => {
          const isCompleted = index < displayIndex;
          const isCurrent = index === displayIndex;
          const isPending = index > displayIndex;

          return (
            <div key={stage} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted
                    ? "bg-accent text-dominant"
                    : isCurrent
                    ? "bg-surface border-2 border-accent text-accent shadow-lg shadow-accent/20"
                    : "bg-surface border-2 border-secondary/30 text-secondary/50"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider absolute top-10 whitespace-nowrap ${
                  isCurrent ? "text-accent" : "text-accent/40"
                }`}
              >
                {stage.replace("_", " ")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
