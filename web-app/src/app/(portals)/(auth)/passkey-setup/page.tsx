"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { passkeyService } from "@/services/auth/passkeyService";

export default function PasskeySetupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-dominant selection:bg-secondary selection:text-accent font-sans">
      <div className="w-full max-w-md mb-6 flex justify-center">
        <Logo size="md" />
      </div>

      <Card className="max-w-md w-full shadow-2xl shadow-accent/5 border-secondary/20" title="Passkey Registration">
        <p className="text-sm text-accent/70 mb-6 font-medium leading-relaxed">
          Register Touch ID, Face ID, or a hardware security key for instant, passwordless sign-in.
        </p>
        <Button
          onClick={() => alert("Passkey registration initiated")}
          disabled={!passkeyService.isSupported()}
          className="w-full py-3.5 shadow-xl shadow-accent/10"
        >
          Register New Passkey
        </Button>
      </Card>
    </div>
  );
}
