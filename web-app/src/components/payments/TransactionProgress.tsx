import React from "react";
import { TransactionState } from "@/models/TransactionTypes";

interface TransactionProgressProps {
  currentState: TransactionState;
}

export const TransactionProgress: React.FC<TransactionProgressProps> = ({ currentState }) => {
  const steps = [
    { label: "Details", states: ["FORM", "VALIDATING"] },
    { label: "Review", states: ["REVIEW"] },
    { label: "Authorization", states: ["AUTHENTICATING", "SUBMITTING", "PROCESSING", "SUCCESS", "PENDING", "FAILED"] },
  ];

  const getStepStatus = (stepStates: string[], idx: number) => {
    const currentStateIdx = Object.values(steps).findIndex(s => s.states.includes(currentState));
    
    if (idx < currentStateIdx) return "COMPLETED";
    if (idx === currentStateIdx) return "CURRENT";
    return "UPCOMING";
  };

  return (
    <div className="flex items-center justify-center w-full my-6 text-sm">
      {steps.map((step, idx) => {
        const status = getStepStatus(step.states, idx);
        
        return (
          <React.Fragment key={step.label}>
            <div className={`flex items-center gap-2 ${status === "CURRENT" ? "text-primary font-bold" : status === "COMPLETED" ? "text-emerald-500 font-semibold" : "text-accent/40 font-medium"}`}>
              {status === "COMPLETED" && <span>✓</span>}
              {status === "CURRENT" && <span>●</span>}
              {status === "UPCOMING" && <span>○</span>}
              <span>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className="h-px w-8 mx-3 bg-secondary/30"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
