"use client";

import React from "react";
import { Button } from "@/components/common/Button";

interface PasskeyPromptProps {
  onAuthenticate: () => void;
  isLoading?: boolean;
}

export const PasskeyPrompt: React.FC<PasskeyPromptProps> = ({ onAuthenticate, isLoading }) => {
  return (
    <div className="p-6 bg-surface border border-secondary/30 rounded-xl text-center flex flex-col items-center gap-4">
      <div className="text-3xl">🔑</div>
      <h3 className="text-lg font-bold text-accent">WebAuthn Passkey Verification</h3>
      <p className="text-xs text-accent/60 font-medium">
        Use Touch ID, Face ID, or your security key to complete step-up authentication.
      </p>
      <Button onClick={onAuthenticate} isLoading={isLoading}>
        Authenticate with Passkey
      </Button>
    </div>
  );
};
