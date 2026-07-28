"use client";

import React from "react";
import { Button } from "@/components/common/Button";

interface PasskeyPromptProps {
  onAuthenticate: () => void;
  isLoading?: boolean;
}

export const PasskeyPrompt: React.FC<PasskeyPromptProps> = ({ onAuthenticate, isLoading }) => {
  return (
    <div className="p-6 bg-slate-800 border border-slate-700 rounded-xl text-center flex flex-col items-center gap-4">
      <div className="text-3xl">🔑</div>
      <h3 className="text-lg font-semibold text-slate-100">WebAuthn Passkey Verification</h3>
      <p className="text-xs text-slate-400">
        Use Touch ID, Face ID, or your security key to complete step-up authentication.
      </p>
      <Button onClick={onAuthenticate} isLoading={isLoading}>
        Authenticate with Passkey
      </Button>
    </div>
  );
};
